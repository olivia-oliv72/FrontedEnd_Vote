import { createSignal, For, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Navbar from "../../components/Navbar";
import "../../assets/css/admin/dashboard.css";
import "../../assets/css/admin/addCategory.css";
import removeIcon from "../../assets/img/remove.png";
import addIcon from "../../assets/img/add.png";

export default function AddCategory() {
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = createSignal("");
  const [candidates, setCandidates] = createSignal([{ name: "", photo: "" }]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [message, setMessage] = createSignal("");

  const handleAddCandidate = () => {
    setCandidates([...candidates(), { name: "", photo: "" }]);
  };

  const handleRemoveCandidate = (indexToRemove) => {
    setCandidates(candidates().filter((_, index) => index !== indexToRemove));
  };

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = candidates().map((candidate, i) => {
      if (i === index) {
        return { ...candidate, [field]: value };
      }
      return candidate;
    });
    setCandidates(updatedCandidates);
  };

  const handlePhotoUploadPlaceholder = (index, event) => {
    if (event.target.files && event.target.files[0]) {
      const fileName = event.target.files[0].name;
      handleCandidateChange(index, "photo", fileName);
      console.log(`File dipilih untuk kandidat ${index}: ${fileName}`);
    }
  };


  async function handleSaveForm() {
    setIsLoading(true);
    setMessage("");

    if (!categoryName().trim()) {
      setMessage("Nama kategori tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    const validCandidates = candidates().filter(c => c.name.trim() !== "");
    if (validCandidates.length === 0) {
      setMessage("Minimal harus ada satu kandidat dengan nama yang valid.");
      setIsLoading(false);
      return;
    }

    const categoryId = categoryName().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    const newCategoryData = {
      id: categoryId,
      name: categoryName(),
      candidates: validCandidates.map(c => ({
        id: c.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 5),
        name: c.name,
        photo: c.photo || 'placeholder.png'
      })),
    };

    try {
      const response = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategoryData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Kategori berhasil ditambahkan! Mengarahkan ke admin...");
        setTimeout(() => {
          navigate("/admin/awardstable");
        }, 1500);
      } else {
        setMessage(result.message || "Gagal menyimpan kategori. Coba lagi.");
      }
    } catch (error) {
      console.error("Error saat menyimpan kategori:", error);
      setMessage("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  }

  const cancelSave = () => {
    navigate("/admin");
  };

  return (
    <div>
      <Navbar />
      <div class="edit-container">
        <div class="title-container">
          <h1 class="title">Add New Category</h1>
        </div>
        <form onSubmit={e => { e.preventDefault(); handleSaveForm(); }}>
          <div class="container-form">
            <div class="category-container">
              <label for="categoryNameInput" class="name">Category : </label>
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
                      class="input-category"
                      type="text"
                      placeholder="Artist Name"
                      value={candidate.name}
                      onInput={e => handleCandidateChange(index(), "name", e.currentTarget.value)}
                    />
                  </div>
                  <button type="button" class="upload-photo">Upload photo</button>

                  <Show when={candidates().length > 1}>
                    <button
                      type="button"
                      class="remove-candidate-btn"
                      onClick={() => handleRemoveCandidate(index())}
                    >
                      <img src={removeIcon} alt="Remove Candidate" style={{ width: "20px", height: "20px" }} />
                    </button>
                  </Show>
                </div>
              )}
            </For>

            <div class="buttons-form-actions">
              <button type="button" onClick={handleAddCandidate} class="add-candidate-btn">
                <img src={addIcon} alt="Add Candidate" style={{ width: "20px", height: "20px", "margin-right": "5px" }} />
              </button>
              {message() && <p class="message-feedback">{message()}</p>}
              <div class="cancel-save-btn">
                <button type="button" onClick={cancelSave} disabled={isLoading()}>Cancel</button>
                <button type="submit" disabled={isLoading()}>
                  {isLoading() ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}