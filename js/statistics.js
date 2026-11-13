const StudyStats = (() => {
  const pad = n => String(n).padStart(2, "0");
  function formatClock(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  function formatHours(seconds) {
    const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }
  function sumBetween(totals, start, end) {
    let sum = 0;
    const cursor = new Date(start);
    while (cursor <= end) {
      sum += totals[StudyTimer.dateKey(cursor)] || 0;
      cursor.setDate(cursor.getDate() + 1);
    }
    return sum;
  }
  function weekStart(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
  }
  function render() {
    const totals = StudyTimer.currentTotals();
    const now = new Date();
    const today = StudyTimer.dateKey(now);
    const todaySeconds = totals[today] || 0;
    const goal = StudyTimer.goalSeconds();
    const pct = Math.min(100, todaySeconds / goal * 100);
    document.getElementById("studyTime").textContent = formatClock(todaySeconds);
    document.getElementById("progressFill").style.width = `${pct}%`;
    document.getElementById("progressText").textContent = `${Math.floor(pct)}% of daily goal`;
    document.getElementById("remainingText").textContent = todaySeconds >= goal ? "Daily goal completed" : `${formatHours(goal - todaySeconds)} remaining`;
    document.getElementById("countdown").textContent = formatClock(Math.max(0, goal - todaySeconds));
    const ws = weekStart(now), monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    document.getElementById("weekTotal").textContent = formatHours(sumBetween(totals, ws, now));
    document.getElementById("monthTotal").textContent = formatHours(sumBetween(totals, monthStart, now));
    document.getElementById("todayLabel").textContent = now.toLocaleDateString(undefined, { weekday:"long", month:"long", day:"numeric" }).toUpperCase();
    document.getElementById("startBtn").disabled = StudyTimer.isRunning();
    document.getElementById("stopBtn").disabled = !StudyTimer.isRunning();
    document.getElementById("statusMessage").textContent = StudyTimer.isRunning()
      ? "Timer is running. You can leave this page; your session will be recovered."
      : "Timer paused. Press Start when you're ready.";
    renderSelectedDate(totals);
    renderHistory(totals);
  }
  function renderSelectedDate(totals) {
    const input = document.getElementById("historyDate");
    const key = input.value || StudyTimer.dateKey(new Date());
    const seconds = totals[key] || 0;
    const date = new Date(`${key}T12:00:00`);
    document.getElementById("selectedDateLabel").textContent = date.toLocaleDateString(undefined, { weekday:"short", year:"numeric", month:"short", day:"numeric" });
    document.getElementById("selectedDateTotal").textContent = formatHours(seconds);
    document.getElementById("selectedGoalStatus").textContent = `${Math.min(100, Math.floor(seconds / StudyTimer.goalSeconds() * 100))}% of goal`;
  }
  function renderHistory(totals) {
    const list = document.getElementById("historyList");
    const empty = document.getElementById("emptyHistory");
    const entries = Object.entries(totals).filter(([,v]) => v > 0).sort((a,b) => b[0].localeCompare(a[0])).slice(0, 7);
    list.innerHTML = "";
    empty.hidden = entries.length > 0;
    entries.forEach(([key, seconds]) => {
      const row = document.createElement("div");
      row.className = "history-row";
      const date = new Date(`${key}T12:00:00`).toLocaleDateString(undefined, { weekday:"short", month:"short", day:"numeric", year:"numeric" });
      const left = document.createElement("span"); left.textContent = date;
      const right = document.createElement("strong"); right.textContent = formatHours(seconds);
      row.append(left, right); list.append(row);
    });
  }
  return { render, formatHours };
})();
