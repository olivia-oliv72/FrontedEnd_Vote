import { createSignal, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Navbar from "../../components/Navbar";
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
      setMessage("Category name cannot be empty.");
      setIsLoading(false);
      return;
    }
    const validCandidates = candidates().filter(c => c.name.trim() !== "");
    if (validCandidates.length === 0) {
      setMessage("Make sure there is a valid candidate.");
      setIsLoading(false);
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
        setMessage("Success adding category!");
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
      <div class="edit-container flex flex-col p-[20px] items-center mt-[10vh]">
        <div class="title-container flex justify-start w-[65vh]">
          <h1 class="title text-[25px] text-[#fff] font-bold mb-[20px]">Add New Category</h1>
        </div>
        {/* formulir */}
        <form onSubmit={e => { e.preventDefault(); handleSaveForm(); }}>
          <div class="container-form bg-[#fff] p-[30px] rounded-[5px] w-fit">
            <div class="category-container">
              <label
                for="categoryNameInput"
                class="name inline-block w-[140px] mb-[10px] text-[16px] font-bold">
                Category:
              </label>
              <input id="categoryNameInput"
                class="input-category w-[250px] h-[40px] rounded-[5px] border border-black px-[10px] font-bold text-[14px] mb-[10px]"
                type="text"
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
                    <label for={`candidateName-${index()}`} class="name inline-block w-[140px] mb-[10px] text-[16px] font-bold">Artist{index() + 1}:</label>
                    <input id={`candidateName-${index()}`}
                      class="input-category w-[250px] h-[40px] rounded-[5px] border border-black px-[10px] font-bold text-[14px] mb-[10px]"
                      type="text"
                      placeholder="Artist Name"
                      value={candidate.name}
                      onChange={e => handleCandidateChange(index(), "name", e.currentTarget.value)}
                    />
                    <Show when={candidates().length > 1}>
                      <button
                        type="button"
                        class="remove-candidate-btn"
                        onClick={() => handleRemoveCandidate(index())}
                      >
                        <img
                          src={removeIcon}
                          alt="Remove Candidate"
                          class="size-[30px] ml-[10px] p-[4px] align-middle cursor-pointer"
                        />
                      </button>
                    </Show>
                  </div>
                  <div class="flex justify-end w-full">
                    <button
                      type="button"
                      class="upload-photo bg-[#e3c365] border-none rounded-[5px] p-[5px] text-[16px] cursor-pointer w-[50%]">
                      Upload photo
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
            <div class="buttons-form-actions flex flex-col self-end">
              <button
                type="button"
                onClick={handleAddCandidate}
                class="add-candidate-btn flex items-center justify-center">
                <img
                  src={addIcon}
                  alt="Add Candidate"
                  class="size-[20px] mr-[5px]"
                />
              </button>
              {message() && <p class="message-feedback">{message()}</p>}
              <div class="cancel-save-btn flex gap-[20px] mt-[20px]">
                <button
                  type="button"
                  class="w-[100px] h-[40%] bg-[#ccc] p-[5px] border-none rounded-[5px] font-bold text-[16px] cursor-pointer"
                  onClick={cancelSave}
                  disabled={isLoading()}>
                  Cancel
                </button>
                <button
                  type="submit"
                  class="bg-[#e3c365] w-[100px] h-[40%] p-[5px] border-none rounded-[5px] font-bold text-[16px] cursor-pointer"
                  disabled={isLoading()}>
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