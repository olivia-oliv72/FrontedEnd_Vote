import { createSignal, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Navbar from "../../components/Navbar";
import "../../assets/css/admin/dashboard.css";
import "../../assets/css/admin/addCategory.css";
import removeIcon from "../../assets/img/remove.png";
import addIcon from "../../assets/img/add.png";

export default function AddCategory() {
  const navigate = useNavigate();

  //State
  const [categoryName, setCategoryName] = createSignal("");
  const [candidates, setCandidates] = createSignal([{ name: "", photo: "" }]);
  const [isSaving, setIsSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");
  
  //Handler
  const handleAddCandidate = () => {
    setCandidates([...candidates(), { name: "", photo: "" }]);
  };
  const handleRemoveCandidate = (indexToRemove) => {
    setCandidates(candidates().filter((_, index) => index !== indexToRemove));
  };
  const handleCandidateChange = (index, field, value) => {
    const updated = [...candidates()];
    updated[index] = { ...updated[index], [field]: value };
    setCandidates(updated);
  };
  const handlePhotoUpload = (index, file) => {
    const updatedCandidates = candidates().map((candidate, i) => {
      if (i === index) {
        return {
          ...candidate,
          photo: file.name, //nama file
          photoFile: file //objek file asli
        };
      }
      return candidate;
    });
    setCandidates(updatedCandidates);
  };

  //Submission (seudah klik save)
  async function handleSaveForm() {
    setIsSaving(true);
    setMessage("");

    //Validasi
    if (!categoryName().trim()) {
      setMessage("Cannot be empty");
      return;
    }
    const validCandidates = candidates().filter(c => c.name.trim() !== "");
    if (validCandidates.length === 0) {
      setMessage("At least have 1 candidate");
      return;
    }

    const categoryId = categoryName().toLowerCase().replace(/\s+/g, '-');
    const newCategoryData = {
      id: categoryId,
      name: categoryName(),
      candidates: validCandidates.map(c => ({
        id: c.name.toLowerCase().replace(/\s+/g, '-'),
        name: c.name,
        photo: c.photo || 'placeholder.png'
      })),
    };

    try {
      //FormData untuk mengirim JSON dan file
      const formData = new FormData();
      formData.append('data', JSON.stringify(newCategoryData)); //teks (JSON)
      candidates().forEach((candidate) => {
        if (candidate.photoFile) {
          formData.append('photos', candidate.photoFile); //file gambar
        }
      });

      //kirim formData ke server
      const response = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Category saved!");
        navigate("/admin");
      } else {
        setMessage(result.message || "Gagal menyimpan kategori. Coba lagi.");
      }
    } catch (error) {
      console.error("Error saat menyimpan kategori:", error);
      setMessage("Tidak dapat terhubung ke server.");
    } finally {
      setIsSaving(false)
    }
  }

  //Batal melakukan perubahan
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
        {/* formulir */}
        <form onSubmit={e => { e.preventDefault(); handleSaveForm(); }}>
          <div class="container-form">
            <div class="category-container">
              <label for="categoryNameInput" class="name">Category : </label>
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
                      class="input-category"
                      type="text"
                      placeholder="Artist Name"
                      value={candidate.name}
                      onChange={e => handleCandidateChange(index(), "name", e.currentTarget.value)}
                    />

                    <button
                      type="button"
                      class="remove-candidate-btn"
                      onClick={() => handleRemoveCandidate(index())}
                    >
                      <img src={removeIcon} alt="Remove Candidate" style={{ width: "20px", height: "20px" }} />
                    </button>
                  </div>
                  <div class="foto">
                    <p>{candidate.photo || "No file chosen"}</p>
                    <input
                      type="file"
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
                <img src={addIcon} alt="Add Candidate" style={{ width: "20px", height: "20px", "margin-right": "5px" }} />
              </button>
              {message() && <p class="message-feedback">{message()}</p>}
              <div class="cancel-save-btn">
                <button type="button" onClick={cancelSave} disabled={isSaving()}>Cancel</button>
                <button type="submit" disabled={isSaving()}>
                  {isSaving() ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}