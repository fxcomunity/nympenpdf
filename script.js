// =====================================================
// PDF LIST (DARI DATABASE NEON)
// =====================================================
let pdfList = []; // format: [title, url, id, views, downloads]

// =====================================================
// API BASE PATH DETECTOR (SUPPORT /website12/api/...)
// =====================================================
function getApiBase() {
  // kalau user set API path di localStorage
  const saved = localStorage.getItem("API_DOCS");
  if (saved) {
    // contoh: "/website12/api/docs"
    return saved.replace("/docs", "");
  }

  // auto detect folder website12
  const path = window.location.pathname;
  const parts = path.split("/").filter(Boolean);

  // Kalau admin.html di /website12/admin.html
  if (parts.length > 1) return `/${parts[0]}/api`;

  // Kalau admin.html di /admin.html
  return `/api`;
}

const API_BASE = getApiBase();
const API_DOCS = `${API_BASE}/docs`;
const API_ADD = `${API_BASE}/add-doc`;
const API_DELETE = `${API_BASE}/delete-doc`;

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
// UPDATE STATS (Dashboard + Statistik)
// =====================================================
function updateAllStats(data) {
  const totalViews = data.reduce((sum, d) => sum + (d.views || 0), 0);
  const totalDownloads = data.reduce((sum, d) => sum + (d.downloads || 0), 0);
  const totalDocs = data.length;

  // Dashboard stats
  document.getElementById("total-files")?.textContent = totalDocs.toLocaleString("id-ID");
  document.getElementById("total-views")?.textContent = totalViews.toLocaleString("id-ID");
  document.getElementById("total-downloads")?.textContent = totalDownloads.toLocaleString("id-ID");

  // Statistik page stats
  document.getElementById("statDocs")?.textContent = totalDocs.toLocaleString("id-ID");
  document.getElementById("statViews")?.textContent = totalViews.toLocaleString("id-ID");
  document.getElementById("statDownloads")?.textContent = totalDownloads.toLocaleString("id-ID");

  // Public stats (kalau ada)
  document.getElementById("total-docs")?.textContent = totalDocs.toLocaleString("id-ID");
}

// =====================================================
// LOAD DATA FROM API (NEON DB)
// =====================================================
async function loadDocsFromDB(force = false) {
  try {
    const res = await fetch(API_DOCS);
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Response bukan array");

    // convert DB rows => format array lama
    pdfList = data.map((d) => [
      d.title,
      d.url,
      d.id,
      d.views || 0,
      d.downloads || 0,
    ]);

    updateAllStats(data);

    // render
    renderPublic(pdfList);
    renderAdmin(pdfList);

    // init sekali aja
    if (!window.__INIT_DONE__) {
      initPublicSearch();
      initAdminSearch();
      initContactForm();
      initAdminKeyPrompt();
      initAdminAddDoc();
      window.__INIT_DONE__ = true;
    }

  } catch (err) {
    console.error("❌ Gagal load data dari Neon:", err);
  }
}

// =====================================================
// RENDER PUBLIC (VIEWER TRACKING)
// =====================================================
function renderPublic(list) {
  const publicContainer = document.getElementById("public-files-container");
  if (!publicContainer) return;

  publicContainer.innerHTML = "";

  if (!list.length) {
    publicContainer.innerHTML = `<div class="loading-state">Tidak ada dokumen ditemukan.</div>`;
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

  if (!list.length) {
    adminGrid.innerHTML = `<div class="loading-state">Tidak ada dokumen admin ditemukan.</div>`;
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
          <p class="pdf-subtitle">
            Views: <b>${views}</b> • Downloads: <b>${downloads}</b>
          </p>
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

      const response = await fetch(API_DELETE, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.error) return alert("❌ " + result.error);

      loadDocsFromDB();
    });

    adminGrid.appendChild(card);
  });

  document.getElementById("last-update")?.textContent = new Date().toLocaleString("id-ID");
}

// =====================================================
// SEARCH PUBLIC
// =====================================================
function initPublicSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const clearSearch = document.getElementById("clearSearch");
  if (!searchInput) return;

  function filterPublic() {
    const keyword = searchInput.value.toLowerCase().trim();
    const filtered = pdfList.filter(([title]) =>
      title.toLowerCase().includes(keyword)
    );
    renderPublic(filtered);
  }

  searchInput.addEventListener("input", filterPublic);
  searchBtn?.addEventListener("click", filterPublic);
  clearSearch?.addEventListener("click", () => {
    searchInput.value = "";
    filterPublic();
  });
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

    const response = await fetch(API_ADD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ title, url }),
    });

    const result = await response.json();
    if (result.error) return alert("❌ " + result.error);

    alert(result.duplicated ? "⚠️ Dokumen sudah ada (URL duplikat)." : "✅ Dokumen berhasil ditambahkan!");
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
// INIT ✅
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  loadDocsFromDB();

  // ✅ polling optional (matikan default biar gak error spam neon)
  // setInterval(loadDocsFromDB, 3000);
});

// expose supaya admin.html bisa call refresh stats
window.loadDocsFromDB = loadDocsFromDB;
