// import hook dan komponen dari solid-js dan router
import { createSignal, onMount, For, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

// import komponen dan asset
import Navbar from "../../components/Navbar";
import "../../assets/css/admin/dashboard.css";
import "../../assets/css/admin/addCategory.css";
import remove from "../../assets/img/remove.png";
import addIcon from "../../assets/img/add.png";

export default function EditCategory() {
  const params = useParams(); // ambil parameter dari url (categoryId)
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

    // validasi jika tidak ada id di url
    if (!categoryIdToEdit) {
      setError("ID Kategori tidak valid atau tidak ditemukan di URL.");
      setIsLoading(false);
      return;
    }

    try {
      // ambil semua kategori
      const response = await fetch('http://localhost:8080/api/categories');
      if (!response.ok) {
        throw new Error(`Gagal mengambil data. Status: ${response.status}`);
      }
      const allCategories = await response.json();

      // cari kategori yang akan diedit berdasarkan id
      const categoryToEdit = allCategories.find(c => c.id === categoryIdToEdit);

      if (categoryToEdit) {
        setOriginalCategoryName(categoryToEdit.name);
        setCategoryName(categoryToEdit.name);
        setCandidates(
          categoryToEdit.candidates?.length > 0
            ? JSON.parse(JSON.stringify(categoryToEdit.candidates))
            : [{ name: "", photo: "" }]
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

  // handler saat user mengubah data kandidat
  const handleCandidateChange = (index, field, value) => {
    const updated = [...candidates()];
    updated[index] = { ...updated[index], [field]: value };
    setCandidates(updated);
  };

  // tambahkan field kandidat baru
  const handleAddCandidate = () => {
    setCandidates([...candidates(), { name: "", photo: "" }]);
  };

  // hapus kandidat dari daftar, hanya dari ui
  const handleRemoveCandidate = (indexToRemove) => {
    const candidateToRemove = candidates()[indexToRemove];

    // jika belum disimpan, hapus langsung
    if (!candidateToRemove.id) {
      if (candidates().length > 1) {
        setCandidates(candidates().filter((_, index) => index !== indexToRemove));
      } else {
        handleCandidateChange(indexToRemove, "name", "");
        handleCandidateChange(indexToRemove, "photo", "");
      }
      return;
    }

    // jika punya id, konfirmasi sebelum hapus
    if (!confirm(`Apakah Anda yakin ingin menghapus kandidat: "${candidateToRemove.name}"?`)) {
      return;
    }

    setCandidates(candidates().filter((_, index) => index !== indexToRemove));
  };

  // simpan file foto untuk SEMENTARA ke dalam kandidat
  const handlePhotoUpload = (index, file) => {
    const updatedCandidates = candidates().map((candidate, i) => {
      if (i === index) {
        return {
          ...candidate,
          photo: file.name,
          photoFile: file
        };
      }
      return candidate;
    });
    setCandidates(updatedCandidates);
  };

  //  simpan perubahan kategori dan kandidat ke backend
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
      id: categoryIdToEdit,
      name: categoryName(),
      candidates: validCandidates.map(c => ({
        id: c.id || (c.name.toLowerCase().replace(/\s+/g, '-')),
        name: c.name,
        photo: c.photo || 'placeholder.png',
      })),
    };

    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(updatedCategoryData));
      candidates().forEach((candidate) => {
        if (candidate.photoFile) {
          formData.append('photos', candidate.photoFile);
        }
      });

      const response = await fetch(`http://localhost:8080/api/categories/${categoryIdToEdit}`, {
        method: 'PUT',
        body: formData,
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
        navigate("/admin");
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

  // jika tombol cancel ditekan, ambil data yang tidak terubah di backend
  const cancelEdit = () => {
    fetch('http://localhost:8080/api/categories')
      .then(res => res.json())
      .then(allCategories => {
        const categoryToEdit = allCategories.find(c => c.id === categoryIdToEdit);
        if (categoryToEdit) {
          setCandidates(
            categoryToEdit.candidates?.length > 0
              ? JSON.parse(JSON.stringify(categoryToEdit.candidates))
              : [{ name: "", photo: "" }]
          );
          setCategoryName(categoryToEdit.name);
          setMessage("");
          setError(null);
          navigate("/admin");
        } else {
          setError(`Kategori dengan ID "${categoryIdToEdit}" tidak ditemukan.`);
        }
      })
      .catch(err => {
        console.error("Error saat memuat ulang data kategori:", err);
        setError("Gagal memuat ulang data kategori.");
      });
  };

  // ui render
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
                  onChange={(e) => setCategoryName(e.currentTarget.value)}
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
                        onChange={e => handleCandidateChange(index(), "name", e.currentTarget.value)}
                      />
                      <img src={remove} class="delete-btn" onClick={() => handleRemoveCandidate(index())} alt="Remove" />
                    </div>
                    <div class="foto">
                      <p>{candidate.photo || "No file chosen"}</p>
                      <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.currentTarget.files[0];
                          if (file) {
                            handlePhotoUpload(index(), file);
                          }
                        }}
                      />
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
