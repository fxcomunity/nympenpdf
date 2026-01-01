// =====================================================
// PDF LIST (DARI DATABASE NEON)
// =====================================================
let pdfList = []; // format: [title, url, id, views, downloads]

// =====================================================
// ADMIN KEY (PRIVATE) - disimpan di localStorage
// =====================================================
function getAdminKey() {
  return localStorage.getItem("ADMIN_KEY") || "";
}

function setAdminKey(key) {
  localStorage.setItem("ADMIN_KEY", key);
}

// =====================================================
// DEVICE HELPER ✅ (HP / TABLET / DESKTOP)
// =====================================================
function getDeviceType() {
  const w = window.innerWidth;
  if (w <= 600) return "mobile";
  if (w <= 1024) return "tablet";
  return "desktop";
}

// =====================================================
// DRIVE HELPERS
// =====================================================
function extractDriveId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function drivePreview(url) {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
}

function driveDownload(url) {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
}

// =====================================================
// ✅ MAINTENANCE CHECK (NEON SETTINGS)
// =====================================================
async function checkMaintenance() {
  try {
    const res = await fetch("/api/settings");
    const data = await res.json();

    const isAdmin = !!getAdminKey();

    // kalau maintenance ON & bukan admin
    if (data.maintenance === true && !isAdmin) {
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
// LOAD DATA FROM API (NEON DB)
// =====================================================
async function loadDocsFromDB() {
  try {
    const res = await fetch("/api/docs");
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Invalid response:", data);
      return;
    }

    // convert DB rows => format array lama
    pdfList = data.map((d) => [
      d.title,
      d.url,
      d.id,
      d.views || 0,
      d.downloads || 0,
    ]);

    // Total views / downloads dari DB
    const totalViews = data.reduce((sum, d) => sum + (d.views || 0), 0);
    const totalDownloads = data.reduce((sum, d) => sum + (d.downloads || 0), 0);

    const viewsEl = document.getElementById("total-views");
    if (viewsEl) viewsEl.textContent = totalViews.toLocaleString("id-ID");

    const downloadsEl = document.getElementById("total-downloads");
    if (downloadsEl) downloadsEl.textContent = totalDownloads.toLocaleString("id-ID");

    const totalDocs = document.getElementById("total-files");
    if (totalDocs) totalDocs.textContent = pdfList.length.toLocaleString("id-ID");

    const totalDocsPublic = document.getElementById("total-docs");
    if (totalDocsPublic) totalDocsPublic.textContent = pdfList.length.toLocaleString("id-ID");

    renderPublic(pdfList);
    renderAdmin(pdfList);

    initPublicSearch();
    initAdminSearch();
    initContactForm();
    initAdminKeyPrompt();
    initAdminAddDoc();
  } catch (err) {
    console.error("Gagal load data dari Neon:", err);
  }
}

// =====================================================
// ✅ RESPONSIVE GRID APPLY (PUBLIC & ADMIN)
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
// RENDER PUBLIC (VIEWER TRACKING)
// =====================================================
function renderPublic(list) {
  const publicContainer = document.getElementById("public-files-container");
  if (!publicContainer) return;

  publicContainer.innerHTML = "";

  applyGridResponsive("public-files-container");

  if (!list.length) {
    publicContainer.innerHTML = `<div class="loading-state">Tidak ada dokumen ditemukan.</div>`;
    return;
  }

  list.forEach(([title, url, id]) => {
    const card = document.createElement("div");
    card.className = "pdf-card";

    const device = getDeviceType();
    const actionLayout = device === "mobile" ? "flex-direction:column;" : "";

    card.innerHTML = `
      <div class="pdf-card-top">
        <div class="pdf-icon">
          <i class="fas fa-file-pdf"></i>
        </div>
        <div class="pdf-info">
          <h4 class="pdf-title">${title}</h4>
          <p class="pdf-subtitle">Dokumen PDF • FX Material</p>
        </div>
      </div>

      <div class="pdf-actions" style="${actionLayout}">
        <a class="btn-preview" href="viewer.html?id=${id}&type=view" target="_blank">
          <i class="fas fa-eye"></i> Preview
        </a>

        <a class="btn-download" href="viewer.html?id=${id}&type=download" target="_blank">
          <i class="fas fa-download"></i> Download
        </a>
      </div>
    `;

    publicContainer.appendChild(card);
  });
}

// =====================================================
// RENDER ADMIN + DELETE BUTTON
// =====================================================
function renderAdmin(list) {
  const adminGrid = document.getElementById("admin-files-grid");
  if (!adminGrid) return;

  adminGrid.innerHTML = "";

  applyGridResponsive("admin-files-grid");

  if (!list.length) {
    adminGrid.innerHTML = `<div class="loading-state">Tidak ada dokumen ditemukan.</div>`;
    return;
  }

  list.forEach(([title, url, id, views, downloads]) => {
    const card = document.createElement("div");
    card.className = "pdf-card admin-pdf-card";

    const device = getDeviceType();
    const actionLayout = device === "mobile" ? "flex-direction:column;" : "";

    card.innerHTML = `
      <div class="pdf-card-top">
        <div class="pdf-icon">
          <i class="fas fa-file-pdf"></i>
        </div>
        <div class="pdf-info">
          <h4 class="pdf-title">${title}</h4>
          <p class="pdf-subtitle">
            Views: <b>${views}</b> • Downloads: <b>${downloads}</b>
          </p>
        </div>
      </div>

      <div class="pdf-actions" style="${actionLayout}">
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

    // delete handler
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

    adminGrid.appendChild(card);
  });

  const lastUpdate = document.getElementById("last-update");
  if (lastUpdate) lastUpdate.textContent = new Date().toLocaleString("id-ID");
}

// =====================================================
// SEARCH PUBLIC
// =====================================================
function initPublicSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  function filterPublic() {
    const keyword = searchInput.value.toLowerCase().trim();
    const filtered = pdfList.filter(([title]) =>
      title.toLowerCase().includes(keyword)
    );
    renderPublic(filtered);
  }

  searchInput.addEventListener("input", filterPublic);
}

// =====================================================
// SEARCH ADMIN
// =====================================================
function initAdminSearch() {
  const adminSearch = document.getElementById("admin-search");
  if (!adminSearch) return;

  adminSearch.addEventListener("input", () => {
    const keyword = adminSearch.value.toLowerCase().trim();
    const filtered = pdfList.filter(([title]) =>
      title.toLowerCase().includes(keyword)
    );
    renderAdmin(filtered);
  });
}

// =====================================================
// ADMIN KEY INPUT
// =====================================================
function initAdminKeyPrompt() {
  const input = document.getElementById("adminKeyInput");
  const saveBtn = document.getElementById("saveAdminKeyBtn");
  if (!input || !saveBtn) return;

  input.value = getAdminKey();

  saveBtn.addEventListener("click", () => {
    const key = input.value.trim();
    if (!key) return alert("ADMIN KEY tidak boleh kosong!");
    setAdminKey(key);
    alert("✅ ADMIN KEY tersimpan!");
  });
}

// =====================================================
// ADMIN ADD DOC (PRIVATE)
// =====================================================
function initAdminAddDoc() {
  const addBtn = document.getElementById("addDocBtn");
  if (!addBtn) return;

  addBtn.addEventListener("click", async () => {
    const titleInput = document.getElementById("newTitle");
    const urlInput = document.getElementById("newUrl");

    const title = titleInput?.value.trim();
    const url = urlInput?.value.trim();
    const adminKey = getAdminKey();

    if (!adminKey) return alert("⚠️ Masukkan ADMIN KEY dulu!");
    if (!title || !url) return alert("Judul dan URL wajib diisi!");

    const response = await fetch("/api/add-doc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ title, url }),
    });

    const result = await response.json();
    if (result.error) return alert("❌ " + result.error);

    alert("✅ Dokumen berhasil ditambahkan!");
    titleInput.value = "";
    urlInput.value = "";
    loadDocsFromDB();
  });
}

// =====================================================
// CONTACT FORM -> WA
// =====================================================
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const msg = document.getElementById("contact-message").value;

    const text = `Halo Admin, saya ${name}%0AEmail: ${email}%0A%0APesan:%0A${msg}`;
    window.open(`https://wa.me/62895404147521?text=${text}`, "_blank");
  });
}

// =====================================================
// INIT ✅ + POLLING REALTIME (OPSIONAL)
// =====================================================
document.addEventListener("DOMContentLoaded", async () => {
  const isMaintenance = await checkMaintenance();
  if (isMaintenance) return;

  await loadDocsFromDB();

  // realtime update tiap 3 detik (matikan kalau berat)
  setInterval(loadDocsFromDB, 3000);

  // ✅ re-render kalau user rotate layar / resize
  window.addEventListener("resize", () => {
    renderPublic(pdfList);
    renderAdmin(pdfList);
  });
});
