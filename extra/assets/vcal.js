// The Vallaera calendar: 12 months of 30 days, a 10-day week, 360 days a year.
// "Today" in Vallaera is anchored to a real moment (extra/calendar/data/today.json) and then
// moves forward one in-world day per real day, rolling over at the configured UTC hour.
(function () {
  var MONTHS = ["Newrise", "Driftsweep", "Rainwend", "Greenbloom", "Stormbridge", "Sunreach",
                "Starfall", "Oldsol", "Brunlef", "Bundelreth", "Crowfoot", "Chill-Writ"];
  var WEEK = ["Onar", "Duvel", "Tressa", "Quorin", "Veyra", "Sisael", "Sevrin", "Othiel", "Nereth", "Tenor"];
  var DPM = 30, MPY = 12, DPY = DPM * MPY, DAY_MS = 86400000;
  var anchor = null;

  function toN(y, m, d) { return y * DPY + m * DPM + (d - 1); }
  function fromN(n) {
    var y = Math.floor(n / DPY), r = n - y * DPY;
    return { year: y, month: Math.floor(r / DPM), day: (r % DPM) + 1 };
  }
  function realDay(ms, hr) { return Math.floor((ms - hr * 3600000) / DAY_MS); }

  window.Vcal = {
    MONTHS: MONTHS, WEEK: WEEK, DPM: DPM, MPY: MPY, DPY: DPY,
    toN: toN, fromN: fromN,
    // load the anchor ({anchor: ISO time, year, month (0-11), day (1-30), rolloverUtcHour})
    init: function (t) {
      anchor = null;
      if (t && t.anchor && !isNaN(Date.parse(t.anchor))) {
        var hr = t.rolloverUtcHour == null ? 4 : t.rolloverUtcHour;
        anchor = { ms: Date.parse(t.anchor), n: toN(t.year, t.month, t.day), hr: hr };
      }
    },
    ready: function () { return !!anchor; },
    // the in-world date at a real moment (ms or ISO string), or null if no anchor is loaded
    atReal: function (t) {
      if (!anchor) return null;
      var ms = typeof t === "number" ? t : Date.parse(t);
      return fromN(anchor.n + realDay(ms, anchor.hr) - realDay(anchor.ms, anchor.hr));
    },
    today: function () { return window.Vcal.atReal(Date.now()); },
    addDays: function (d, k) { return fromN(toN(d.year, d.month, d.day) + k); },
    label: function (d) { return MONTHS[d.month] + " " + d.day; },
    fullLabel: function (d) { return MONTHS[d.month] + " " + d.day + ", " + d.year; }
  };
})();
