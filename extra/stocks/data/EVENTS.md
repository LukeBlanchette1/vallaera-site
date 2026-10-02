# Moving the market

Prices move randomly on their own. To nudge a stock, add an entry to `events.json` in this folder.
The next update (within a few minutes of saving, or at most 4 hours) applies it.

```json
[
  {
    "id": "pirates-west-sea-1",
    "date": "2026-10-05",
    "tickers": ["WSSC"],
    "change": -12,
    "headline": "Pirates raid the West Sea",
    "detail": "Three cargo ships lost off the coast of Motu.",
    "spread": 4
  }
]
```

| Field | Meaning |
| --- | --- |
| `id` | Any unique name. Prevents the event from being applied twice. |
| `date` | Optional. Leave out to apply right away, or give a future date to schedule it. |
| `tickers` | `["ONYX"]`, `["SCRY", "WSSC"]`, or `["ALL"]`. |
| `change` | Percent move: `15` means up 15%, `-12` means down 12%. |
| `headline` / `detail` | Shown in the "Market news" list on the Stocks page. |
| `spread` | Optional. How many updates the move is spread across (default 4), so it looks like a trend instead of one jump. |

Tickers: `ONYX` (Onyx Emporium), `SCRY` (Scrolls and Scries), `WSSC` (West Sea Shipping Company), `ASHW` (Ashwick Vineyards), `SADD` (Saddiq's Menagerie), `KTCO` (Krettlam Trading Company).
Keep earlier events in the file, since the `id` is how the game remembers they were already applied.
