import { createSignal, For, onMount } from "solid-js"; // onMount tidak wajib di sini, tapi For iya
import { useNavigate } from "@solidjs/router";
import Navbar from "../../components/Navbar"; // Pastikan path Navbar benar
import "../../assets/css/admin/dashboard.css"; // Pastikan path CSS benar
import "../../assets/css/admin/addCategory.css"; // Pastikan path CSS benar
import removeIcon from "../../assets/img/remove.png"; // Ganti nama variabel agar lebih jelas
import addIcon from "../../assets/img/add.png";   // Ganti nama variabel

export default function AddCategory() {
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = createSignal("");
  // Inisialisasi kandidat dengan satu field kosong
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
    // Untuk sekarang, kita hanya simpan nama file sebagai placeholder
    // Logika upload file sebenarnya lebih kompleks
    if (event.target.files && event.target.files[0]) {
      const fileName = event.target.files[0].name;
      handleCandidateChange(index, "photo", fileName);
      // Di aplikasi nyata, Anda akan mengunggah file ke server dan mendapatkan URL/path kembali
      console.log(`File dipilih untuk kandidat ${index}: ${fileName}`);
    }
  };


  async function handleSaveForm() {
    setIsLoading(true);
    setMessage("");

    // Validasi dasar: Nama kategori tidak boleh kosong
    if (!categoryName().trim()) {
      setMessage("Nama kategori tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    // Filter kandidat yang namanya tidak kosong
    const validCandidates = candidates().filter(c => c.name.trim() !== "");
    if (validCandidates.length === 0) {
        setMessage("Minimal harus ada satu kandidat dengan nama yang valid.");
        setIsLoading(false);
        return;
    }


    // Membuat ID kategori sederhana (untuk contoh, server Anda mungkin punya cara lebih baik)
    // Server Anda (berdasarkan contoh sebelumnya) mengharapkan ID dari client
    const categoryId = categoryName().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    const newCategoryData = {
      id: categoryId,
      name: categoryName(),
      candidates: validCandidates.map(c => ({ 
        id: c.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 5), // Buat ID kandidat sementara
        name: c.name, 
        photo: c.photo || 'placeholder.png' // Jika foto kosong, beri placeholder
      })),
    };

    try {
      const response = await fetch('http://localhost:8080/api/categories', { // Sesuaikan port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategoryData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Kategori berhasil ditambahkan! Mengarahkan ke admin...");
        // Beri sedikit waktu untuk membaca pesan sebelum navigasi
        setTimeout(() => {
          navigate("/admin/awardstable"); // Arahkan ke tabel penghargaan atau halaman admin utama
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

  const cancelSave = () => { // Ganti nama fungsi agar lebih jelas
    navigate("/admin/awardstable"); // Arahkan ke tabel penghargaan atau halaman admin utama
  };

  return (
    <div>
      <Navbar />
      <div class="edit-container"> {/* Mungkin lebih baik "add-category-container" */}
        <div class="title-container">
          <h1 class="title">Add New Category</h1>
        </div>
        {/* Ganti className ke class untuk konsistensi SolidJS jika tidak ada alasan khusus */}
        <form onSubmit={e => { e.preventDefault(); handleSaveForm(); }}>
          <div class="container-form">
            <div class="category-container">
              <label for="categoryNameInput" class="name">Category Name: </label>
              <input id="categoryNameInput" // Beri ID unik
                type="text" class="input-category" placeholder="Category Name"
                value={categoryName()}
                onInput={(e) => setCategoryName(e.currentTarget.value)} // Gunakan onInput untuk SolidJS
                required
              />
            </div>

            <h3>Candidates:</h3>
            <For each={candidates()}>
              {(candidate, index) => (
                <div class="candidate-input-group"> {/* Class untuk styling group */}
                  <div class="candidate-name-input">
                    <label for={`candidateName-${index()}`} class="name">Artist name #{index() + 1}:</label>
                    <input id={`candidateName-${index()}`}
                      class="input-category"
                      type="text"
                      placeholder="Artist Name"
                      value={candidate.name}
                      onInput={e => handleCandidateChange(index(), "name", e.currentTarget.value)}
                    />
                  </div>
                  <div class="candidate-photo-input">
                     <label for={`candidatePhoto-${index()}`} class="name">Photo Filename:</label>
                     <input id={`candidatePhoto-${index()}`}
                      class="input-category"
                      type="text" // Untuk sementara input nama file foto
                      placeholder="e.g., artist.png"
                      value={candidate.photo}
                      onInput={e => handleCandidateChange(index(), "photo", e.currentTarget.value)}
                    />
                    {/* Tombol upload foto placeholder, logika upload sebenarnya kompleks */}
                    {/* <input type="file" onChange={(e) => handlePhotoUploadPlaceholder(index(), e)} /> */}
                  </div>
                  <Show when={candidates().length > 1}>
                    <button 
                      type="button" 
                      class="remove-candidate-btn" 
                      onClick={() => handleRemoveCandidate(index())}
                    >
                      <img src={removeIcon} alt="Remove Candidate" style={{width: "20px", height: "20px"}}/>
                    </button>
                  </Show>
                </div>
              )}
            </For>
            
            <div class="buttons-form-actions"> {/* Class untuk styling group tombol */}
              <button type="button" onClick={handleAddCandidate} class="add-candidate-btn">
                <img src={addIcon} alt="Add Candidate" style={{width: "20px", height: "20px", "margin-right": "5px"}} />
                Add Candidate Field
              </button>
              {message() && <p class="message-feedback">{message()}</p>}
              <div class="cancel-save-btn">
                <button type="button" onClick={cancelSave} disabled={isLoading()}>Cancel</button>
                <button type="submit" disabled={isLoading()}>
                  {isLoading() ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}