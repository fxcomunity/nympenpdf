// =====================================================
// PDF LIST (DARI DATABASE NEON)
// =====================================================
let pdfList = []; // format: [title, url, id]

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
// LOAD DATA FROM API (NEON DB)
// =====================================================
async function loadDocsFromDB() {
  try {
    const res = await fetch("/api/docs");
    const data = await res.json();

    // convert DB rows => format array lama
    pdfList = data.map((d) => [d.title, d.url, d.id]);

    renderPublic(pdfList);
    renderAdmin(pdfList);
    initPublicSearch();
    initAdminSearch();
    initContactForm();
    initAdminKeyPrompt(); // ✅ admin key input (admin page only)
    initAdminAddDoc(); // ✅ add doc (admin page only)
  } catch (err) {
    console.error("Gagal load data dari Neon:", err);
  }
}

// =====================================================
// RENDER PUBLIC
// =====================================================
function renderPublic(list) {
  const publicContainer = document.getElementById("public-files-container");
  const totalDocs = document.getElementById("total-docs");
  if (!publicContainer) return;

  publicContainer.innerHTML = "";

  if (!list.length) {
    publicContainer.innerHTML = `<div class="loading-state">Tidak ada dokumen ditemukan.</div>`;
    if (totalDocs) totalDocs.textContent = "0";
    return;
  }

  list.forEach(([title, url]) => {
    const card = document.createElement("div");
    card.className = "pdf-card";

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

      <div class="pdf-actions">
        <a class="btn-preview" href="${drivePreview(url)}" target="_blank">
          <i class="fas fa-eye"></i> Preview
        </a>

        <a class="btn-download" href="${driveDownload(url)}" download>
          <i class="fas fa-download"></i> Download
        </a>
      </div>
    `;

    publicContainer.appendChild(card);
  });

  if (totalDocs) totalDocs.textContent = list.length;
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

  list.forEach(([title, url, id]) => {
    const card = document.createElement("div");
    card.className = "pdf-card admin-pdf-card";

    card.innerHTML = `
      <div class="pdf-card-top">
        <div class="pdf-icon">
          <i class="fas fa-file-pdf"></i>
        </div>
        <div class="pdf-info">
          <h4 class="pdf-title">${title}</h4>
          <p class="pdf-subtitle">Admin Panel • PDF File</p>
        </div>
      </div>

      <div class="pdf-actions">
        <a class="btn-preview admin-preview" href="${drivePreview(url)}" target="_blank">
          <i class="fas fa-eye"></i> Preview
        </a>

        <a class="btn-download admin-download" href="${driveDownload(url)}" download>
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
      if (!adminKey) {
        alert("⚠️ Masukkan ADMIN KEY dulu!");
        return;
      }

      const response = await fetch("/api/delete-doc", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.error) {
        alert("❌ " + result.error);
        return;
      }

      loadDocsFromDB();
    });

    adminGrid.appendChild(card);
  });

  const totalFiles = document.getElementById("total-files");
  if (totalFiles) totalFiles.textContent = list.length;

  const lastUpdate = document.getElementById("last-update");
  if (lastUpdate) lastUpdate.textContent = new Date().toLocaleString("id-ID");
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
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") filterPublic();
  });

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
// ADMIN KEY INPUT (BUTUH INPUT DI admin.html)
// =====================================================
function initAdminKeyPrompt() {
  const input = document.getElementById("adminKeyInput");
  const saveBtn = document.getElementById("saveAdminKeyBtn");

  if (!input || !saveBtn) return; // berarti bukan di admin page

  // isi otomatis key yang pernah disimpan
  input.value = getAdminKey();

  saveBtn.addEventListener("click", () => {
    const key = input.value.trim();
    if (!key) {
      alert("ADMIN KEY tidak boleh kosong!");
      return;
    }
    setAdminKey(key);
    alert("✅ ADMIN KEY tersimpan!");
  });
}

// =====================================================
// ADMIN ADD DOC (BUTUH INPUT DI admin.html)
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

    if (!adminKey) {
      alert("⚠️ Masukkan ADMIN KEY dulu!");
      return;
    }

    if (!title || !url) {
      alert("Judul dan URL wajib diisi!");
      return;
    }

    const response = await fetch("/api/add-doc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ title, url }),
    });

    const result = await response.json();

    if (result.error) {
      alert("❌ " + result.error);
      return;
    }

    if (result.duplicated) {
      alert("⚠️ Dokumen sudah ada (URL duplikat).");
    } else {
      alert("✅ Dokumen berhasil ditambahkan!");
    }

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

    const text =
      `Halo Admin, saya ${name}%0AEmail: ${email}%0A%0APesan:%0A${msg}`;

    window.open(`https://wa.me/62895404147521?text=${text}`, "_blank");
  });
}

// =====================================================
// INIT ✅
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  loadDocsFromDB();
});
