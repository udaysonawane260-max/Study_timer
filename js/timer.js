/* Timer accounting uses timestamps, not interval tick counts, so sleeping/closing a tab
   does not make the saved duration drift. Sessions crossing midnight are split by date. */
const StudyTimer = (() => {
  const GOAL_SECONDS = 8 * 60 * 60;
  const dateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  function splitElapsed(startMs, endMs) {
    const result = {};
    let cursor = startMs;
    while (cursor < endMs) {
      const date = new Date(cursor);
      const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime();
      const segmentEnd = Math.min(endMs, midnight);
      const key = dateKey(date);
      result[key] = (result[key] || 0) + Math.floor((segmentEnd - cursor) / 1000);
      cursor = segmentEnd;
    }
    return result;
  }
  function currentTotals() {
    const totals = StudyStore.getDays();
    const active = StudyStore.getActiveSince();
    if (active) {
      const additions = splitElapsed(active, Date.now());
      Object.entries(additions).forEach(([key, seconds]) => totals[key] = (totals[key] || 0) + seconds);
    }
    return totals;
  }
  function start() {
    if (!StudyStore.getActiveSince()) StudyStore.setActiveSince(Date.now());
  }
  function stop() {
    const active = StudyStore.getActiveSince();
    if (!active) return;
    StudyStore.addDays(splitElapsed(active, Date.now()));
    StudyStore.setActiveSince(null);
  }
  function isRunning() { return Boolean(StudyStore.getActiveSince()); }
  function todaySeconds() { return currentTotals()[dateKey(new Date())] || 0; }
  function goalSeconds() { return GOAL_SECONDS; }
  return { start, stop, isRunning, todaySeconds, currentTotals, goalSeconds, dateKey };
})();
