import { createSignal, onMount, For, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import Navbar from "../../components/Navbar";
import "../../assets/css/admin/dashboard.css";
import "../../assets/css/admin/addCategory.css";
import remove from "../../assets/img/remove.png";
import addIcon from "../../assets/img/add.png";

export default function EditCategory() {
  const params = useParams();
  const navigate = useNavigate();
  const categoryIdToEdit = params.categoryId;

  const [categoryName, setCategoryName] = createSignal("");
  const [candidates, setCandidates] = createSignal([]);
  const [originalCategoryName, setOriginalCategoryName] = createSignal("");

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

      const categoryToEdit = allCategories.find(c => c.id === categoryIdToEdit);

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

  const handleRemoveCandidate = async (indexToRemove) => {
    const candidateToRemove = candidates()[indexToRemove];

    // Jika kandidat tidak punya ID, ini adalah field baru yang belum disimpan.
    // Cukup hapus dari UI saja tanpa memanggil API.
    if (!candidateToRemove.id) {
        if (candidates().length > 1) {
            setCandidates(candidates().filter((_, index) => index !== indexToRemove));
        } else {
            // Jika hanya satu, kosongkan fieldnya
            handleCandidateChange(indexToRemove, "name", "");
            handleCandidateChange(indexToRemove, "photo", "");
        }
        return; // Hentikan fungsi di sini
    }

    // Jika kandidat punya ID, konfirmasi sebelum hapus dari server.
    if (!confirm(`Apakah Anda yakin ingin menghapus kandidat: "${candidateToRemove.name}"?`)) {
        return; // Hentikan jika pengguna klik "Cancel"
    }

    try {
        const response = await fetch(`http://localhost:8080/api/categories/${categoryIdToEdit}/candidates/${candidateToRemove.id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        // PERBAIKAN PENTING: Cek apakah respons dari server OK (status 200-299)
        if (response.ok && result.success) {
            // HANYA JIKA BERHASIL DI SERVER, baru update UI
            setCandidates(candidates().filter(c => c.id !== candidateToRemove.id));
            setMessage(result.message || 'Kandidat berhasil dihapus.');
        } else {
            // Jika gagal, tampilkan pesan error dari server
            setError(result.message || 'Gagal menghapus kandidat dari server.');
        }
        
        // Hilangkan pesan setelah beberapa detik
        setTimeout(() => {
            setMessage("");
            setError(null);
        }, 3000);

    } catch (err) {
        console.error("Error saat menghapus kandidat:", err);
        setError("Tidak dapat terhubung ke server untuk menghapus kandidat.");
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

    const validCandidates = candidates().filter(c => c.name && c.name.trim() !== "");

    const updatedCategoryData = {
      name: categoryName(),
      candidates: validCandidates.map(c => ({
        id: c.id || (c.name.toLowerCase().replace(/\s+/g, '-')),
        name: c.name,
        photo: c.photo || 'placeholder.png',
      })),
    };

    try {
      const response = await fetch(`http://localhost:8080/api/categories/${categoryIdToEdit}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategoryData),
      });

      let result;
      try {
        result = await response.json();
      } catch (e) {
        result = { message: response.statusText || (response.ok ? "Operasi berhasil" : "Operasi gagal") };
      }

      if (response.ok) {
        setMessage(result.message || "Category saved!");
        setOriginalCategoryName(categoryName());
        setTimeout(() => { navigate("/admin"); }, 1500);
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
          <h1 class="title">Edit Category</h1>
        </div>

        <Show when={isLoading()}>
          <p>Memuat data kategori...</p>
        </Show>
        <Show when={error() && !isLoading()}>
          <p style={{ color: "red" }}>Error: {error()}</p>
        </Show>

        <Show when={!isLoading() && !error() && originalCategoryName()}>
          <form onSubmit={e => { e.preventDefault(); handleUpdateForm(); }}>
            <div class="container-form">
              <div class="category-container">
                <label for="categoryNameInput" class="name">Category: </label>
                <input id="categoryNameInput"
                  type="text" class="input-category" placeholder="Category Name"
                  value={categoryName()}
                  onInput={(e) => setCategoryName(e.currentTarget.value)}
                  required
                />
              </div>
              <For each={candidates()}>
                {(candidate, index) => (
                  <div class="candidate-input-group">
                    <div class="candidate-name-input">
                      <label for={`candidateName-${index()}`} class="name">Artist{index() + 1}:</label>
                      <input id={`candidateName-${index()}`}
                        class="input-category" type="text" placeholder="Artist Name"
                        value={candidate.name}
                        onInput={e => handleCandidateChange(index(), "name", e.currentTarget.value)}
                      />
                      <img src={remove} class="delete-btn" onClick={() => handleRemoveCandidate(index())} alt="Remove" />

                    </div>
                    <div class="foto">
                      <p>{candidate.photo}</p>
                      <button type="button" class="upload-photo">Upload photo</button>
                    </div>


                  </div>
                )}
              </For>
              <div class="buttons-form-actions">
                <button type="button" onClick={handleAddCandidate} class="add-candidate-btn">
                  <img src={addIcon} alt="Add Candidate" style={{ width: "20px", height: "20px", "margin-right": "5px" }} /> Add Candidate Field
                </button>
                {message() &&
                  <p class="message-feedback"
                    style={{ color: message().toLowerCase().includes("berhasil") ? "green" : "red" }}>
                    {message()}
                  </p>
                }
                <div class="cancel-save-btn">
                  <button type="button" onClick={cancelEdit} disabled={isSaving()}>Cancel</button>
                  <button type="submit" disabled={isSaving()}>
                    {isSaving() ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Show>
      </div>
    </div>
  );
}