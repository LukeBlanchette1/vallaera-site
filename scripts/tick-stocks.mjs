// Updates the Vallaera stock market.
//
//   node scripts/tick-stocks.mjs              add a tick if one is due (or events are waiting)
//   node scripts/tick-stocks.mjs --force      add a tick now
//   node scripts/tick-stocks.mjs --reset      throw away history and regenerate 30 days
//
// Prices move randomly each tick. Anything listed in extra/stocks/data/events.json
// (see EVENTS.md next to it) is applied on top of the random movement.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "extra", "stocks", "data")
const INTERVAL_HOURS = 4
const BACKFILL_TICKS = 180 // 30 days
const MAX_TICKS = 2000
const MEAN_REVERSION = 0.01 // gentle pull back toward each company's starting price
const DEFAULT_SPREAD = 4 // an event's effect is spread over this many ticks

const args = new Set(process.argv.slice(2))
const readJson = (name, fallback) => {
  const file = path.join(DATA, name)
  if (!fs.existsSync(file)) return fallback
  try {
    return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""))
  } catch (err) {
    console.warn(`WARNING: could not read ${name} (${err.message}). Ignoring it.`)
    return fallback
  }
}
const writeJson = (name, value) =>
  fs.writeFileSync(path.join(DATA, name), JSON.stringify(value, null, 1) + "\n")

const gauss = () => {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
const round2 = (n) => Math.round(n * 100) / 100

const companies = readJson("companies.json", [])
const events = readJson("events.json", [])
let state = readJson("history.json", null)
const now = new Date()
const stepMs = INTERVAL_HOURS * 3600 * 1000

// advance every price by one tick; returns the new price map
function step(prices, effects) {
  const market = gauss() * 0.004 // a little shared movement so the stocks feel related
  const next = {}
  for (const c of companies) {
    const p = prices[c.ticker]
    let r = (c.drift ?? 0) + (c.vol ?? 0.015) * gauss() + market
    r += MEAN_REVERSION * (Math.log(c.start) - Math.log(p))
    for (const e of effects) if (e.ticker === c.ticker && e.remaining > 0) r += e.per
    next[c.ticker] = Math.max(1, round2(p * Math.exp(r)))
  }
  for (const e of effects) e.remaining -= 1
  return next
}

// ---- first run / reset: generate a month of history ending now
if (!state || args.has("--reset")) {
  const prices = Object.fromEntries(companies.map((c) => [c.ticker, c.start]))
  const ticks = []
  let p = prices
  for (let i = BACKFILL_TICKS; i >= 0; i--) {
    p = step(p, [])
    ticks.push({ t: new Date(now.getTime() - i * stepMs).toISOString(), p })
  }
  state = { intervalHours: INTERVAL_HOURS, ticks, applied: [], effects: [], news: [] }
  writeJson("history.json", state)
  console.log(`Generated ${ticks.length} ticks of history.`)
  process.exit(0)
}

// ---- pick up new events
const eventId = (e) => e.id || `${e.date || "now"}|${[].concat(e.tickers || e.ticker || "ALL").join(",")}|${e.change}`
const pending = events.filter((e) => {
  if (typeof e.change !== "number") return false
  if (state.applied.includes(eventId(e))) return false
  const when = e.date ? new Date(e.date) : new Date(0)
  return !(when > now)
})

const last = new Date(state.ticks[state.ticks.length - 1].t)
const due = now - last >= stepMs * 0.9
if (!due && pending.length === 0 && !args.has("--force")) {
  console.log("Nothing to do: no tick due and no new events.")
  process.exit(0)
}

for (const e of pending) {
  const tickers = [].concat(e.tickers || e.ticker || "ALL")
  const targets = tickers.includes("ALL") ? companies.map((c) => c.ticker) : tickers
  const spread = Math.max(1, e.spread || DEFAULT_SPREAD)
  for (const ticker of targets) {
    if (!companies.some((c) => c.ticker === ticker)) {
      console.warn(`Event "${eventId(e)}": unknown ticker ${ticker}, skipped.`)
      continue
    }
    state.effects.push({ id: eventId(e), ticker, remaining: spread, per: Math.log(1 + e.change / 100) / spread })
  }
  state.applied.push(eventId(e))
  state.news.unshift({
    t: e.date ? new Date(e.date).toISOString() : now.toISOString(),
    id: eventId(e),
    tickers: targets,
    change: e.change,
    headline: e.headline || "Market news",
    detail: e.detail || "",
  })
}

const prev = state.ticks[state.ticks.length - 1].p
state.ticks.push({ t: now.toISOString(), p: step(prev, state.effects) })
state.effects = state.effects.filter((e) => e.remaining > 0)
if (state.ticks.length > MAX_TICKS) state.ticks = state.ticks.slice(-MAX_TICKS)
state.news = state.news.slice(0, 50)
writeJson("history.json", state)
console.log(`Tick added at ${now.toISOString()}${pending.length ? ` with ${pending.length} event(s)` : ""}.`)
