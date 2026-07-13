// Helper functions — pre-provided. Do not modify.

function updateMetrics({ loadAvg, freeMemMB, totalMemMB, memUsagePct }) {
  document.getElementById("mem-usage").textContent = memUsagePct;
  document.getElementById("free-mem").textContent = freeMemMB;
  document.getElementById("total-mem").textContent = totalMemMB;
  document.getElementById("load-1").textContent = loadAvg[0].toFixed(2);
  document.getElementById("load-5").textContent = loadAvg[1].toFixed(2);
  document.getElementById("load-15").textContent = loadAvg[2].toFixed(2);
}

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

// Your code below — create a WebSocket connection and handle events.
