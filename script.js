// =====================================================
// PDF LIST (DARI KAMU)
// =====================================================
const pdfList = [
  ["Trading Psychology","https://drive.google.com/file/d/1nGaFSHsGpX3H75DSj_Kv_biPmSenK2Wf/view?usp=drive_link"],
  ["Tradable vs Non-Tradable Order Blocks","https://drive.google.com/file/d/1vZoKMTjSDGO6vPptjXgYwLmqPO8CIyak/view?usp=drive_link"],
  ["Market Structure 1","https://drive.google.com/file/d/1jO4JslpkkZLHYev1YyZ91Gpa6gK_VTDD/view?usp=drive_link"],
  ["Market Structure 2","https://drive.google.com/file/d/1jfx84nvvDBanQGdHRSMq7Xir_5M8djQH/view?usp=drive_link"],
  ["Liquidity Concepts","https://drive.google.com/file/d/11_70wg7O0gSoEF10v9X1DU4agu1cKJq4/view?usp=drive_link"],
  ["Supply and Demand 1","https://drive.google.com/file/d/1oYkKYkAO0cS7g8Sp_D2Yg8Pp7uZXZlc_/view?usp=drive_link"],
  ["Supply and Demand 2","https://drive.google.com/file/d/1E5YAbKdRGqNYsKBmDEDH-9ZpRbp1R0Rk/view?usp=drive_link"],
  ["Entry Refinement 1","https://drive.google.com/file/d/11tnIz_vRIe5CLkPwB9Us2Dd8YzCeaQWx/view?usp=drive_link"],
  ["Entry Refinement 2","https://drive.google.com/file/d/1dzS9mYUvGITy1eAHWG7SKaDJpFOI2H2L/view?usp=drive_link"],
  ["Risk Management 1","https://drive.google.com/file/d/1M3PkpBuvkuV-TDtObyPAXMst-emYODrH/view?usp=drive_link"],
  ["Risk Management 2","https://drive.google.com/file/d/19YiETeO8AZbISHiMl3FBYmn5a75UaUr4/view?usp=drive_link"],
  ["Trading Plan Checklist","https://drive.google.com/file/d/1x_Dp5AFr8YokHGwfWZB7SdaZuapv18tK/view?usp=drive_link"],
  ["Advance Order Blocks","https://drive.google.com/file/d/1p1d3X0nYPcO4D5RMjJqvHzh4TK3BK4fe/view?usp=drive_link"],
  ["Break of Structure Guide","https://drive.google.com/file/d/1dxdyD3v7d-5MFuD97JK7zNw9Z2dncpjj/view?usp=drive_link"],
  ["Change of Character (CHoCH)","https://drive.google.com/file/d/1QmRPJ3DbTfgr_O03fCP8kC7yn471Qi6C/view?usp=drive_link"],
  ["Fair Value Gap (FVG)","https://drive.google.com/file/d/1rrE4QL0jE4QeiOy0U8S48Ui4VnoLM00Q/view?usp=drive_link"],
  ["Imbalance Analysis","https://drive.google.com/file/d/13Qn34LKgyMfRHoKO_Ow1rPC-iQfzP6yn/view?usp=drive_link"],
  ["Premium and Discount Zones","https://drive.google.com/file/d/1Rvsfk66vRQwE23LVowBYrVKsgmWEVaai/view?usp=drive_link"],
  ["Fibonacci Trading","https://drive.google.com/file/d/1jPcCnuLXsURaoi9yQyF5O_uLaJFZaruK/view?usp=drive_link"],
  ["Institutional Flow","https://drive.google.com/file/d/1v7j8Vze4KBKR4KO1iPYtAPbVdeqindDM/view?usp=drive_link"],
  ["High Probability Setups","https://drive.google.com/file/d/11FxUS88Ts0E50hFR0rFwbNamm1NUpN8b/view?usp=drive_link"],
  ["Candlestick Patterns","https://drive.google.com/file/d/15ScThpFMmYIll-O5zgrQ3z8hg6YYETTD/view?usp=drive_link"],
  ["Wyckoff Theory 1","https://drive.google.com/file/d/15RMg044QY_nz719-BtsgOsmjT5VHXBVV/view?usp=drive_link"],
  ["Wyckoff Theory 2","https://drive.google.com/file/d/1tMfjfTda0LhH_EHChGN12qKHk1Eq_qaO/view?usp=drive_link"],
  ["Session Timing (London/NY)","https://drive.google.com/file/d/1xe2vqGQryNT8aNACjy6n3A0U0AS8k2Ow/view?usp=drive_link"],
  ["Inducement Concepts","https://drive.google.com/file/d/1t43q2eszfJ88obayIABjLtmqVnEcA6LN/view?usp=drive_link"],
  ["Top Down Analysis","https://drive.google.com/file/d/1_Mspp8uveZoFnT6upavvSOD2xHDd3vPN/view?usp=drive_link"],
  ["Multi Timeframe Execution","https://drive.google.com/file/d/1eg33AcqXlvXqf8ImYqyUJNl3jm5-MVr6/view?usp=drive_link"],
  ["Swing Trading Strategy","https://drive.google.com/file/d/1vnaQGhsdx2lSrnoQjCcudII1v8nDrmRz/view?usp=drive_link"],
  ["Scalping Techniques","https://drive.google.com/file/d/1qUpkiWQl920-11Q8igLedF1nUV2dnedI/view?usp=drive_link"],
  ["Daily Bias Masterclass","https://drive.google.com/file/d/1t9qyXjV6fMLxCp9jNX44d8V7KhXmmVUB/view?usp=drive_link"],
  ["Power of 3 (PO3)","https://drive.google.com/file/d/13QJW4o6M35TfJw1jMcMcf1ablG-2sRJ0/view?usp=drive_link"],
  ["Asian Range Strategy","https://drive.google.com/file/d/1PwN9fAZAtp8i12szgEHjuMjduxlrYC7T/view?usp=drive_link"],
  ["Killzones Guide","https://drive.google.com/file/d/1hAicdiRfND1z1tFp4Ki9Fpq0DKd0r6H7/view?usp=drive_link"],
  ["SMT Divergence","https://drive.google.com/file/d/1-rRetTt9FGLrfVijFZ_Mm8uBEVb-FGBC/view?usp=drive_link"],
  ["Mitigation Blocks","https://drive.google.com/file/d/1JNmMA4SOxSSZo6rieM-s7KNMnPjJxbEo/view?usp=drive_link"],
  ["Breaker Blocks","https://drive.google.com/file/d/1Vp4QCF4ugfbm_ny6NKkRrFhtRMtjXNQX/view?usp=drive_link"],
  ["External vs Internal Liquidity","https://drive.google.com/file/d/1gQa-LO816sS2Xp3UUOFqOKOiGYMog8gC/view?usp=drive_link"],
  ["Advanced Trading Journal","https://drive.google.com/file/d/11ORFQEkeBAbz9svmP7yyPHbsmhndvvRN/view?usp=drive_link"]
];

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
// RENDER ADMIN ✅ FIX
// =====================================================
function renderAdmin(list) {
  const adminGrid = document.getElementById("admin-files-grid");
  if (!adminGrid) return;

  adminGrid.innerHTML = "";

  if (!list.length) {
    adminGrid.innerHTML = `<div class="loading-state">Tidak ada dokumen admin ditemukan.</div>`;
    return;
  }

  list.forEach(([title, url]) => {
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
      </div>
    `;

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
// INIT ✅ PASTI JALAN DI ADMIN + PUBLIC
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  renderPublic(pdfList);
  renderAdmin(pdfList);
  initPublicSearch();
  initAdminSearch();
  initContactForm();
});
