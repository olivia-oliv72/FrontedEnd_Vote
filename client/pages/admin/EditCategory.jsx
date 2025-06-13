import { createSignal, onMount, For, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import Navbar from "../../components/Navbar";
import remove from "../../assets/img/remove.png";
import addIcon from "../../assets/img/add.png";

export default function EditCategory() {
  const params = useParams();
  const navigate = useNavigate();
  const categoryIdToEdit = params.categoryId;

  //State
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

    //validasi
    if (!categoryIdToEdit) {
      setError("Category ID is invalid or is not found.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/categories');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data. Status: ${response.status}. Pesan: ${errorText || response.statusText}`);
      }
      const allCategories = await response.json();
      
      if (!Array.isArray(allCategories)) {
        throw new Error("Category data format is not compatible. (Not an array)");
      }

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
        setError(`Category "${categoryIdToEdit}" is not fond.`);
      }
    } catch (err) {
      console.error("EditCategory.jsx - Error while fetching category:", err);
      setError(err.message || "Failed to fetch category.");
    } finally {
      setIsLoading(false);
    }
  });

  //handler mengubah data kandidat
  const handleCandidateChange = (index, field, value) => {
    const updated = [...candidates()];
    updated[index] = { ...updated[index], [field]: value };
    setCandidates(updated);
  };
  const handleAddCandidate = () => {
    setCandidates([...candidates(), { name: "", photo: "" }]);
  };
  const handleRemoveCandidate = (indexToRemove) => {
    const candidateToRemove = candidates()[indexToRemove];
    if (!candidateToRemove.id) {
      if (candidates().length > 1) {
        setCandidates(candidates().filter((_, index) => index !== indexToRemove));
      } else {
        handleCandidateChange(indexToRemove, "name", "");
        handleCandidateChange(indexToRemove, "photo", "");
      }
      return;
    }
    if (!confirm(`Are you sure to delete this candidate: "${candidateToRemove.name}"?`)) {
      return;
    }
    setCandidates(candidates().filter((_, index) => index !== indexToRemove));
  };
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

  //Summission
  async function handleUpdateForm() {
    setIsSaving(true);
    setMessage("");
    setError(null);

    if (!categoryName().trim()) {
      setMessage("Category name cannot be empty");
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

  //cancel edit
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

  return (
    <div>
      <Navbar />
      <div class="edit-container flex flex-col p-[20px] items-center mt-[10vh]">
        <div class="title-container flex justify-start w-[65vh]">
          <h1 class="title text-[25px] text-[#fff] font-bold mb-[20px]">Edit Category</h1>
        </div>

        <Show when={isLoading()}>
          <p>Loading...</p>
        </Show>
        <Show when={error() && !isLoading()}>
          <p style={{ color: "red" }}>Error: {error()}</p>
        </Show>

        <Show when={!isLoading() && !error() && originalCategoryName()}>
          <form onSubmit={e => { e.preventDefault(); handleUpdateForm(); }}>
            <div class="container-form bg-[#fff] p-[30px] rounded-[5px] w-fit">
              <div class="category-container">
                <label 
                  for="categoryNameInput"
                  class="name inline-block w-[140px] mb-[10px] text-[16px] font-bold">
                  Category:
                </label>
                <input id="categoryNameInput"
                  type="text"
                  class="input-category w-[250px] h-[40px] rounded-[5px] border border-black px-[10px] font-bold text-[14px] mb-[10px]"
                  placeholder="Category Name"
                  value={categoryName()}
                  onChange={(e) => setCategoryName(e.currentTarget.value)}
                  required
                />
              </div>
              <For each={candidates()}>
                {(candidate, index) => (
                  <div class="candidate-input-group mb-[20px]">
                    <div class="candidate-name-input pl-0">
                      <label
                        for={`candidateName-${index()}`}
                        class="name inline-block w-[140px] mb-[10px] text-[16px] font-bold">
                        Artist{index() + 1}:
                      </label>
                      <input id={`candidateName-${index()}`}
                        class="input-category w-[250px] h-[40px] rounded-[5px] border border-black px-[10px] font-bold text-[14px] mb-[10px]"
                        type="text" 
                        placeholder="Artist Name"
                        value={candidate.name}
                        onChange={e => handleCandidateChange(index(), "name", e.currentTarget.value)}
                      />
                      <img
                        src={remove}
                        alt="Remove"
                        class="delete-btn size-[30px] p-[4px] cursor-pointer"
                        onClick={() => handleRemoveCandidate(index())}
                      />
                    </div>
                    <div class="foto justify-end w-full">
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
                       <button
                        type="button"
                        class="upload-photo bg-[#e3c365] border-none rounded-[5px] p-[5px] text-[16px] cursor-pointer w-[30%]">
                        Upload photo
                       </button>
                    </div>
                  </div>
                )}
              </For>
              <div class="buttons-form-actions flex flex-col self-end">
                <button
                  type="button"
                  onClick={handleAddCandidate}
                  class="add-candidate-btn flex items-center justify-center">
                  <img
                    src={addIcon}
                    alt="Add Candidate"
                    class="size-[20px] mr-[5px]"/>
                    Add Candidate Field
                </button>
                {message() &&
                  <p class="message-feedback"
                    style={{ color: message().toLowerCase().includes("berhasil") ? "green" : "red" }}>
                    {message()}
                  </p>
                }
                <div class="cancel-save-btn flex gap-[20px] mt-[20px]">
                  <button
                    type="button"
                    class="w-[100px] h-[40%] bg-[#ccc] p-[5px] border-none rounded-[5px] font-bold text-[16px] cursor-pointer"
                    onClick={cancelEdit}
                    disabled={isSaving()}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="bg-[#e3c365] w-[100px] h-[40%] p-[5px] border-none rounded-[5px] font-bold text-[16px] cursor-pointer"
                    disabled={isSaving()}>
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