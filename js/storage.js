/* Local device storage. Records are stored as seconds keyed by local date YYYY-MM-DD. */
const StudyStore = (() => {
  const KEY = "studytrack-v1";
  const empty = () => ({ days: {}, activeSince: null });
  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY));
      if (parsed && parsed.days && typeof parsed.days === "object") {
        return { days: parsed.days, activeSince: parsed.activeSince || null };
      }
    } catch (error) { console.warn("Could not read saved StudyTrack data", error); }
    return empty();
  }
  let state = load();
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function getDays() { return { ...state.days }; }
  function setDay(dateKey, seconds) {
    state.days[dateKey] = Math.max(0, Math.floor(seconds));
    if (state.days[dateKey] === 0) delete state.days[dateKey];
    save();
  }
  function addDays(additions) {
    Object.entries(additions).forEach(([key, seconds]) => {
      state.days[key] = Math.max(0, Math.floor((state.days[key] || 0) + seconds));
    });
    save();
  }
  function getActiveSince() { return state.activeSince; }
  function setActiveSince(value) { state.activeSince = value; save(); }
  function replace(days) {
    state.days = days;
    state.activeSince = null;
    save();
  }
  return { getDays, setDay, addDays, getActiveSince, setActiveSince, replace };
})();
