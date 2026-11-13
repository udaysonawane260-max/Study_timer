document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("historyDate");
  dateInput.value = StudyTimer.dateKey(new Date());
  document.getElementById("startBtn").addEventListener("click", () => { StudyTimer.start(); StudyStats.render(); });
  document.getElementById("stopBtn").addEventListener("click", () => { StudyTimer.stop(); StudyStats.render(); });
  dateInput.addEventListener("change", StudyStats.render);
  document.getElementById("todayBtn").addEventListener("click", () => { dateInput.value = StudyTimer.dateKey(new Date()); StudyStats.render(); });
  document.getElementById("exportBtn").addEventListener("click", () => {
    // Stop the timer only for the exported snapshot? No: include elapsed time without stopping it.
    const data = { app: "StudyTrack", version: 1, exportedAt: new Date().toISOString(), days: StudyTimer.currentTotals() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `studytrack-backup-${StudyTimer.dateKey(new Date())}.json`; a.click();
    URL.revokeObjectURL(url);
  });
  document.getElementById("importFile").addEventListener("change", async (event) => {
    const file = event.target.files[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data.days || typeof data.days !== "object" || Array.isArray(data.days)) throw new Error("Invalid backup");
      const clean = {};
      for (const [key, value] of Object.entries(data.days)) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(key) && Number.isFinite(value) && value >= 0) clean[key] = Math.floor(value);
      }
      if (!confirm("Import this backup? It will replace the study records currently on this device.")) return;
      StudyStore.replace(clean); StudyStats.render(); alert("Backup imported.");
    } catch (error) { alert("Could not import this file. Please choose a valid StudyTrack backup."); }
    event.target.value = "";
  });
  StudyStats.render();
  setInterval(StudyStats.render, 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) StudyStats.render(); });
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./service-worker.js").catch(err => console.warn("Service worker registration failed", err));
  }
});
