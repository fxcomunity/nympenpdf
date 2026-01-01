document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("public-files-container");
  const totalDocsEl = document.getElementById("total-docs");
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");

  let docs = [];

  async function fetchDocs() {
    container.innerHTML = `
      <div class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Memuat daftar dokumen...</p>
      </div>
    `;

    try {
      const res = await fetch("/api/docs");
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Data docs invalid!");

      docs = data;
      totalDocsEl.textContent = docs.length;
      renderDocs(docs);
    } catch (err) {
      container.innerHTML = `
        <div class="loading-state">
          <i class="fas fa-triangle-exclamation"></i>
          <p>Gagal memuat dokumen: ${err.message}</p>
        </div>
      `;
    }
  }

  function renderDocs(list) {
    if (!list.length) {
      container.innerHTML = `
        <div class="loading-state">
          <i class="fas fa-folder-open"></i>
          <p>Tidak ada dokumen ditemukan</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(doc => `
      <div class="doc-card">
        <div class="doc-icon">
          <i class="fas fa-file-pdf"></i>
        </div>

        <div class="doc-body">
          <h3 class="doc-title">${doc.title}</h3>

          <div class="doc-meta">
            <span><i class="fas fa-eye"></i> ${doc.views || 0}</span>
            <span><i class="fas fa-download"></i> ${doc.downloads || 0}</span>
          </div>

          <div class="doc-actions">
            <a href="${doc.url}" target="_blank" class="btn-preview">
              <i class="fas fa-eye"></i> Preview
            </a>
            <a href="${doc.url}" download class="btn-download">
              <i class="fas fa-download"></i> Download
            </a>
          </div>
        </div>
      </div>
    `).join("");
  }

  function handleSearch() {
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = docs.filter(doc =>
      doc.title.toLowerCase().includes(keyword)
    );
    renderDocs(filtered);
  }

  // search realtime
  searchInput.addEventListener("input", handleSearch);

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    renderDocs(docs);
  });

  fetchDocs();
});
