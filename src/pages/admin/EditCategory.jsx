// client/src/pages/admin/EditCategory.jsx (sesuaikan path jika perlu)
import { createSignal, onMount, For, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
// HAPUS: import { loadCategories, saveCategories } from "../../utils/localStorage";
import Navbar from "../../components/Navbar"; // Pastikan path Navbar benar
import "../../assets/css/admin/dashboard.css"; // Pastikan path CSS benar
import "../../assets/css/admin/addCategory.css"; // Ini mungkin perlu CSS khusus edit atau bisa pakai addCategory.css
import removeIcon from "../../assets/img/remove.png"; // Ganti nama variabel
import addIcon from "../../assets/img/add.png";   // Ganti nama variabel

export default function EditCategory() {
  const params = useParams();
  const navigate = useNavigate();
  const categoryIdToEdit = params.categoryId; // ID kategori yang akan diedit

  const [categoryName, setCategoryName] = createSignal("");
  const [candidates, setCandidates] = createSignal([]); // Mulai dengan array kosong
  const [originalCategory, setOriginalCategory] = createSignal(null); // Untuk menyimpan data asli
  
  const [isLoading, setIsLoading] = createSignal(true);
  const [isSaving, setIsSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");
  const [error, setError] = createSignal(null);

  onMount(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Ambil semua kategori dari server
      const response = await fetch('http://localhost:8080/api/categories'); // Sesuaikan port
      if (!response.ok) {
        throw new Error(`Gagal mengambil data kategori. Status: ${response.status}`);
      }
      const allCategories = await response.json();
      const categoryToEdit = allCategories.find(c => c.id === categoryIdToEdit);

      if (categoryToEdit) {
        setOriginalCategory(categoryToEdit); // Simpan data asli
        setCategoryName(categoryToEdit.name);
        setCandidates(categoryToEdit.candidates && categoryToEdit.candidates.length > 0 
          ? JSON.parse(JSON.stringify(categoryToEdit.candidates)) // Deep copy untuk menghindari mutasi tak sengaja
          : [{ name: "", photo: "" }]);
      } else {
        setError(`Kategori dengan ID "${categoryIdToEdit}" tidak ditemukan.`);
      }
    } catch (err) {
      console.error("Error fetching category to edit:", err);
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
    setCandidates(candidates().filter((_, index) => index !== indexToRemove));
  };

  async function handleUpdateForm() {
    setIsSaving(true);
    setMessage("");

    if (!categoryName().trim()) {
      setMessage("Nama kategori tidak boleh kosong.");
      setIsSaving(false);
      return;
    }
    const validCandidates = candidates().filter(c => c.name.trim() !== "");
     if (validCandidates.length === 0) {
        setMessage("Minimal harus ada satu kandidat dengan nama yang valid.");
        setIsSaving(false);
        return;
    }

    const updatedCategoryData = {
      id: categoryIdToEdit, // ID tidak berubah
      name: categoryName(),
      candidates: validCandidates.map(c => ({
        // Jika kandidat sudah punya ID dari server, pertahankan. Jika baru, buat ID sementara atau biarkan server yg buat.
        // Untuk saat ini, kita asumsikan ID kandidat bisa dikirim ulang atau server menanganinya.
        id: c.id || (c.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 5)),
        name: c.name,
        photo: c.photo || 'placeholder.png',
      })),
    };

    try {
      // Anda perlu endpoint PUT di server, misalnya /api/categories/:id
      const response = await fetch(`http://localhost:8080/api/categories/${categoryIdToEdit}`, {
        method: 'PUT', // Gunakan PUT untuk update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategoryData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Kategori berhasil diperbarui! Mengarahkan ke admin...");
        setTimeout(() => {
          navigate("/admin/awardstable"); // Arahkan kembali
        }, 1500);
      } else {
        setMessage(result.message || "Gagal memperbarui kategori.");
      }
    } catch (error) {
      console.error("Error saat memperbarui kategori:", error);
      setMessage("Tidak dapat terhubung ke server.");
    } finally {
      setIsSaving(false);
    }
  }

  const cancelEdit = () => {
    navigate("/admin/awardstable"); // Arahkan kembali
  };

  return (
    <div>
      <Navbar />
      <div class="edit-container">
        <div class="title-container">
          <h1 class="title">Edit Category: {originalCategory() ? originalCategory().name : 'Loading...'}</h1>
        </div>

        <Show when={isLoading()}>
          <p>Memuat data kategori...</p>
        </Show>
        <Show when={error()}>
          <p style={{ color: "red" }}>Error: {error()}</p>
        </Show>

        <Show when={!isLoading() && !error() && originalCategory()}>
          <form onSubmit={e => { e.preventDefault(); handleUpdateForm(); }}>
            <div class="container-form"> {/* Gunakan class, bukan className di SolidJS kecuali ada alasan khusus */}
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
                    </div>
                    <button type="button" class="remove-candidate-btn" onClick={() => handleRemoveCandidate(index())}>
                      <img src={removeIcon} alt="Remove Candidate" style={{width: "20px", height: "20px"}}/>
                    </button>
                  </div>
                )}
              </For>
              
              <div class="buttons-form-actions">
                <button type="button" onClick={handleAddCandidate} class="add-candidate-btn">
                  <img src={addIcon} alt="Add Candidate" style={{width: "20px", height: "20px", "margin-right": "5px"}}/> Add Candidate Field
                </button>
                {message() && <p class="message-feedback">{message()}</p>}
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
        <Show when={!isLoading() && !error() && !originalCategory()}>
            <p>Kategori tidak ditemukan atau gagal dimuat.</p>
        </Show>
      </div>
    </div>
  );
}