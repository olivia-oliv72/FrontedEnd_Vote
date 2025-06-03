// client/src/pages/admin/EditCategory.jsx (sesuaikan path jika perlu)
import { createSignal, onMount, For, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import Navbar from "../../components/Navbar"; // Pastikan path Navbar benar
import "../../assets/css/admin/dashboard.css"; // Pastikan path CSS benar
import "../../assets/css/admin/addCategory.css"; // Atau CSS khusus edit
import removeIcon from "../../assets/img/remove.png";
import addIcon from "../../assets/img/add.png";

export default function EditCategory() {
  const params = useParams();
  const navigate = useNavigate();
  const categoryIdToEdit = params.categoryId;

  // console.log("EditCategory.jsx - ID Kategori dari URL:", categoryIdToEdit);

  const [categoryName, setCategoryName] = createSignal("");
  const [candidates, setCandidates] = createSignal([]);
  const [originalCategoryName, setOriginalCategoryName] = createSignal(""); // Untuk judul & kondisi render form
  
  const [isLoading, setIsLoading] = createSignal(true);
  const [isSaving, setIsSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");
  const [error, setError] = createSignal(null);

  onMount(async () => {
    setIsLoading(true);
    setError(null);
    setCategoryName("");
    setCandidates([]);
    setOriginalCategoryName("");

    if (!categoryIdToEdit) {
      setError("ID Kategori tidak valid atau tidak ditemukan di URL.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/categories');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal mengambil data. Status: ${response.status}. Pesan: ${errorText || response.statusText}`);
      }
      const allCategories = await response.json();
      // console.log("EditCategory.jsx - Semua kategori dari server:", allCategories);
      
      if (!Array.isArray(allCategories)) {
        throw new Error("Format data semua kategori dari server tidak sesuai (bukan array).");
      }

      const categoryToEdit = allCategories.find(c => c.id === categoryIdToEdit);
      // console.log(`EditCategory.jsx - Kategori ditemukan untuk ID "${categoryIdToEdit}":`, categoryToEdit);

      if (categoryToEdit) {
        setOriginalCategoryName(categoryToEdit.name);
        setCategoryName(categoryToEdit.name);
        setCandidates(
          categoryToEdit.candidates && Array.isArray(categoryToEdit.candidates) && categoryToEdit.candidates.length > 0 
          ? JSON.parse(JSON.stringify(categoryToEdit.candidates)) // Deep copy
          : [{ name: "", photo: "" }] // Default jika tidak ada kandidat
        );
      } else {
        setError(`Kategori dengan ID "${categoryIdToEdit}" tidak ditemukan.`);
      }
    } catch (err) {
      console.error("EditCategory.jsx - Error saat memuat data kategori:", err);
      setError(err.message || "Terjadi kesalahan saat memuat data kategori.");
    } finally {
      setIsLoading(false);
    }
  });

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = candidates().map((candidate, i) => {
      if (i === index) {
        return { ...candidate, [field]: value };
      }
      return candidate;
    });
    setCandidates(updatedCandidates);
  };

  const handleAddCandidate = () => {
    setCandidates([...candidates(), { name: "", photo: "" }]);
  };

  const handleRemoveCandidate = (indexToRemove) => {
    if (candidates().length > 1) {
        setCandidates(candidates().filter((_, index) => index !== indexToRemove));
    } else {
        // Jika hanya satu, kosongkan fieldnya, jangan hapus barisnya agar tetap ada field input
        handleCandidateChange(indexToRemove, "name", "");
        handleCandidateChange(indexToRemove, "photo", "");
    }
  };

  async function handleUpdateForm() {
    setIsSaving(true);
    setMessage("");
    setError(null);

    if (!categoryName().trim()) {
      setMessage("Nama kategori tidak boleh kosong.");
      setIsSaving(false);
      return;
    }
    
    // Filter kandidat yang valid (memiliki nama)
    // Biarkan array kandidat kosong jika memang tidak ada kandidat yang diisi
    const validCandidates = candidates().filter(c => c.name && c.name.trim() !== "");

    const updatedCategoryData = {
      // ID kategori tidak dikirim dalam body untuk update, karena sudah ada di URL endpoint
      name: categoryName(),
      candidates: validCandidates.map(c => ({
        // Jika kandidat memiliki ID (dari data awal), sertakan. Jika tidak (kandidat baru), server bisa menanganinya.
        id: c.id || (c.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 9)), 
        name: c.name,
        photo: c.photo || 'placeholder.png', // Beri placeholder jika foto kosong
      })),
    };
    // console.log("Mengirim data update ke server:", updatedCategoryData);

    try {
      const response = await fetch(`http://localhost:8080/api/categories/${categoryIdToEdit}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategoryData),
      });
      
      let result;
      try {
          // Coba parse JSON, server mungkin mengirim pesan error atau sukses dalam JSON
          result = await response.json(); 
      } catch (e) {
          // Jika body bukan JSON atau kosong (misalnya untuk status 204 No Content)
          result = { message: response.statusText || (response.ok ? "Operasi berhasil" : "Operasi gagal") };
      }

      if (response.ok) {
        setMessage(result.message || "Kategori berhasil diperbarui! Mengarahkan...");
        setOriginalCategoryName(categoryName()); // Update judul halaman jika nama kategori berubah
        // Refresh data kategori secara lokal jika perlu, atau biarkan navigasi yang memuat ulang
        setTimeout(() => { navigate("/admin/awardstable"); }, 1500);
      } else {
        setMessage(result.message || `Gagal memperbarui kategori. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error saat memperbarui kategori:", error);
      setMessage("Tidak dapat terhubung ke server atau terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  }

  const cancelEdit = () => {
    navigate("/admin");
  };

  return (
    <div>
      <Navbar />
      <div class="edit-container">
        <div class="title-container">
          <h1 class="title">Edit Category: {
            isLoading() ? 'Loading...' 
            : (originalCategoryName() || `(ID: ${categoryIdToEdit} - Tidak Ditemukan)`)
          }</h1>
        </div>

        <Show when={isLoading()}>
          <p>Memuat data kategori...</p>
        </Show>
        <Show when={error() && !isLoading()}>
          <p style={{ color: "red" }}>Error: {error()}</p>
        </Show>

        {/* Tampilkan form hanya jika tidak loading, tidak ada error fetch utama, dan nama kategori asli sudah termuat */}
        <Show when={!isLoading() && !error() && originalCategoryName()}>
          <form onSubmit={e => { e.preventDefault(); handleUpdateForm(); }}>
            <div class="container-form">
              <div class="category-container">
                <label for="categoryNameInput" class="name">Category Name: </label>
                <input id="categoryNameInput"
                  type="text" class="input-category" placeholder="Category Name"
                  value={categoryName()}
                  onInput={(e) => setCategoryName(e.currentTarget.value)}
                  required
                />
              </div>
              <h3>Candidates:</h3>
              <For each={candidates()}>
                {(candidate, index) => (
                  <div class="candidate-input-group">
                    <div class="candidate-name-input">
                      <label for={`candidateName-${index()}`} class="name">Artist name #{index() + 1}:</label>
                      <input id={`candidateName-${index()}`}
                        class="input-category" type="text" placeholder="Artist Name"
                        value={candidate.name}
                        onInput={e => handleCandidateChange(index(), "name", e.currentTarget.value)}
                      />
                    </div>
                    <div class="candidate-photo-input">
                      <label for={`candidatePhoto-${index()}`} class="name">Photo Filename:</label>
                      <input id={`candidatePhoto-${index()}`}
                        class="input-category" type="text" placeholder="e.g., artist.png"
                        value={candidate.photo}
                        onInput={e => handleCandidateChange(index(), "photo", e.currentTarget.value)}
                      />
                      <button type="button" class="remove-candidate-btn" onClick={() => handleRemoveCandidate(index())}>
                        <img src={removeIcon} alt="Remove Candidate" style={{width: "20px", height: "20px"}}/>
                      </button>
                    </div>
                  </div>
                )}
              </For>
              <div class="buttons-form-actions">
                <button type="button" onClick={handleAddCandidate} class="add-candidate-btn">
                  <img src={addIcon} alt="Add Candidate" style={{width: "20px", height: "20px", "margin-right": "5px"}}/> Add Candidate Field
                </button>
                {/* Pesan feedback: hijau untuk sukses, merah untuk error */}
                {message() && 
                  <p class="message-feedback" 
                     style={{ color: message().toLowerCase().includes("berhasil") ? "green" : "red" }}>
                     {message()}
                  </p>
                }
                <div class="cancel-save-btn">
                  <button type="button" onClick={cancelEdit} disabled={isSaving()}>Cancel</button>
                  <button type="submit" disabled={isSaving()}>
                    {isSaving() ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Show>
        {/* Kondisi jika kategori spesifik tidak ditemukan setelah loading selesai */}
        <Show when={!isLoading() && !error() && !originalCategoryName()}>
            <p>Kategori dengan ID "{categoryIdToEdit}" tidak ditemukan atau gagal dimuat. Silakan kembali dan coba lagi.</p>
            <button type="button" onClick={cancelEdit}>Kembali ke Daftar Kategori</button>
        </Show>
      </div>
    </div>
  );
}