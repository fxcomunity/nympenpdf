// =====================================================
// PDF LIST (DARI DATABASE NEON)
// =====================================================
let pdfList = [];

// =====================================================
// ADMIN KEY (PRIVATE)
// =====================================================
function getAdminKey() {
  return localStorage.getItem("ADMIN_KEY") || "";
}
function setAdminKey(key) {
  localStorage.setItem("ADMIN_KEY", key);
}

// =====================================================
// ✅ DEVICE HELPER
// =====================================================
function getDeviceType() {
  const w = window.innerWidth;
  if (w <= 600) return "mobile";
  if (w <= 1024) return "tablet";
  return "desktop";
}

// =====================================================
// ✅ APPLY GRID RESPONSIVE
// =====================================================
function applyGridResponsive(containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  const device = getDeviceType();

  if (device === "mobile") {
    grid.style.gridTemplateColumns = "1fr";
  } else if (device === "tablet") {
    grid.style.gridTemplateColumns = "repeat(2, 1fr)";
  } else {
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
  }
}

// =====================================================
// ✅ MAINTENANCE CHECK
// =====================================================
async function checkMaintenance() {
  try {
    const res = await fetch("/api/settings");
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ /api/settings bukan JSON:", text);
      return false;
    }

    if (data.maintenance === true && !getAdminKey()) {
      window.location.href = "maintenance.html";
      return true;
    }
    return false;
  } catch (err) {
    console.log("Maintenance check error:", err);
    return false;
  }
}

// =====================================================
// ✅ LOAD DOCS FROM NEON
// =====================================================
async function loadDocsFromDB() {
  try {
    const res = await fetch("/api/docs");
    const text = await res.text();

    console.log("✅ API RAW /api/docs:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ API bukan JSON. Kemungkinan /api/docs 404:", text);
      return;
    }

    if (!Array.isArray(data)) return console.error("Invalid response:", data);

    pdfList = data.map((d) => [
      d.title,
      d.url,
      d.id,
      d.views || 0,
      d.downloads || 0,
    ]);

    // update totals
    document.getElementById("total-docs")?.textContent = pdfList.length;
    document.getElementById("total-files")?.textContent = pdfList.length;

    const totalViews = data.reduce((sum, d) => sum + (d.views || 0), 0);
    const totalDownloads = data.reduce((sum, d) => sum + (d.downloads || 0), 0);

    document.getElementById("total-views")?.textContent = totalViews;
    document.getElementById("total-downloads")?.textContent = totalDownloads;

    renderPublic(pdfList);
    renderAdmin(pdfList);

    initPublicSearch();
    initAdminSearch();
    initContactForm();
    initAdminKeyPrompt();
    initAdminAddDoc();

  } catch (err) {
    console.error("❌ Gagal load Neon DB:", err);
  }
}

// =====================================================
// ✅ RENDER PUBLIC
// =====================================================
function renderPublic(list) {
  const container = document.getElementById("public-files-container");
  if (!container) return;

  container.innerHTML = "";
  applyGridResponsive("public-files-container");

  if (!list.length) {
    container.innerHTML = `<div class="loading-state">Tidak ada dokumen ditemukan.</div>`;
    return;
  }

  list.forEach(([title, url, id]) => {
    const card = document.createElement("div");
    card.className = "pdf-card";

    card.innerHTML = `
      <div class="pdf-card-top">
        <div class="pdf-icon"><i class="fas fa-file-pdf"></i></div>
        <div class="pdf-info">
          <h4 class="pdf-title">${title}</h4>
          <p class="pdf-subtitle">Dokumen PDF • FX Material</p>
        </div>
      </div>

      <div class="pdf-actions">
        <a class="btn-preview" href="viewer.html?id=${id}&type=view" target="_blank">
          <i class="fas fa-eye"></i> Preview
        </a>
        <a class="btn-download" href="viewer.html?id=${id}&type=download" target="_blank">
          <i class="fas fa-download"></i> Download
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

// =====================================================
// ✅ RENDER ADMIN
// =====================================================
function renderAdmin(list) {
  const grid = document.getElementById("admin-files-grid");
  if (!grid) return;

  grid.innerHTML = "";
  applyGridResponsive("admin-files-grid");

  if (!list.length) {
    grid.innerHTML = `<div class="loading-state">Tidak ada dokumen admin ditemukan.</div>`;
    return;
  }

  list.forEach(([title, url, id, views, downloads]) => {
    const card = document.createElement("div");
    card.className = "pdf-card admin-pdf-card";

    card.innerHTML = `
      <div class="pdf-card-top">
        <div class="pdf-icon"><i class="fas fa-file-pdf"></i></div>
        <div class="pdf-info">
          <h4 class="pdf-title">${title}</h4>
          <p class="pdf-subtitle">Views: <b>${views}</b> • Downloads: <b>${downloads}</b></p>
        </div>
      </div>

      <div class="pdf-actions">
        <a class="btn-preview admin-preview" href="viewer.html?id=${id}&type=view" target="_blank">
          <i class="fas fa-eye"></i> Preview
        </a>
        <a class="btn-download admin-download" href="viewer.html?id=${id}&type=download" target="_blank">
          <i class="fas fa-download"></i> Download
        </a>
        <button class="btn-delete" data-id="${id}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    `;

    card.querySelector(".btn-delete").addEventListener("click", async () => {
      if (!confirm("Yakin mau hapus dokumen ini?")) return;

      const adminKey = getAdminKey();
      if (!adminKey) return alert("⚠️ Masukkan ADMIN KEY dulu!");

      const response = await fetch("/api/delete-doc", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.error) return alert("❌ " + result.error);

      alert("✅ Dokumen berhasil dihapus!");
      loadDocsFromDB();
    });

    grid.appendChild(card);
  });

  document.getElementById("last-update")?.textContent =
    new Date().toLocaleString("id-ID");
}

// =====================================================
// ✅ INIT
// =====================================================
document.addEventListener("DOMContentLoaded", async () => {
  const isMaintenance = await checkMaintenance();
  if (isMaintenance) return;

  await loadDocsFromDB();

  window.addEventListener("resize", () => {
    renderPublic(pdfList);
    renderAdmin(pdfList);
  });
});
