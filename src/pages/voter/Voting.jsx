// client/src/pages/voter/Voting.jsx (sesuaikan path jika perlu)
import NavbarGuest from "../../components/Navbar.jsx"; // Asumsi ini Navbar yang benar
import bannerImg from "../../assets/img/banner.png";
import arrow from "../../assets/img/arrow.png";
import "../../assets/css/voter/Voting.css";
import { For, createSignal, onMount, Show } from "solid-js";
// HAPUS: import initialCategories from "../../assets/data/category_candidate.js";
import { useParams, useNavigate } from "@solidjs/router";
import Banner from "../../components/banner.jsx";
import Footer from "../../components/footer.jsx";

// Opsional: Jika Anda ingin menggunakan cache dari localStorage
// import { getCachedCategories, cacheCategories } from '../../utils/localStorage';

function Voting() {
  const params = useParams();
  const categoryId = params.categoryId; // ID kategori dari URL
  const navigate = useNavigate();

  const [category, setCategory] = createSignal(null); // Untuk menyimpan detail kategori yang ditemukan
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  onMount(async () => {
    setIsLoading(true);
    setError(null);

    // Opsional: Coba dari cache dulu
    // let allCategories = getCachedCategories();
    // if (allCategories) {
    //   const foundCategory = allCategories.find(cat => cat.id === categoryId);
    //   if (foundCategory) {
    //     setCategory(foundCategory);
    //     // Anda bisa set isLoading(false) di sini jika ingin tampilan cepat,
    //     // tapi tetap fetch dari server untuk update.
    //   }
    // }

    try {
      // Ambil SEMUA kategori dari API server Anda
      const response = await fetch('http://localhost:8080/api/categories'); // Sesuaikan port jika berbeda
      if (!response.ok) {
        throw new Error(`Gagal mengambil data kategori. Status: ${response.status}`);
      }
      const serverCategories = await response.json();

      // Opsional: Simpan semua kategori ke cache
      // cacheCategories(serverCategories);

      // Cari kategori yang sesuai berdasarkan categoryId dari URL
      const foundCategory = serverCategories.find(cat => cat.id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
      } else {
        setError(`Kategori dengan ID "${categoryId}" tidak ditemukan di server.`);
      }
    } catch (err) {
      console.error("Error fetching category details:", err);
      // Jika fetch gagal dan tidak ada cache yang cocok, tampilkan error
      // if (!category()) setError(err.message || "Terjadi kesalahan.");
      setError(err.message || "Terjadi kesalahan saat mengambil data.");
    } finally {
      setIsLoading(false);
    }
  });

  function handleVote() {
    // Sebelum navigasi, Anda mungkin ingin menyimpan pilihan vote pengguna
    // (misalnya ke state atau localStorage sementara) jika belum dilakukan di halaman ini.
    // Navigasi ke halaman konfirmasi dengan membawa ID kategori.
    navigate(`/confirmation/${categoryId}`);
  }

  return (
    <div class="page-voting-container">
      <NavbarGuest />
      <Banner />

      <Show when={isLoading()}>
        <div class="voting-container">
            <p>Memuat detail kategori...</p>
        </div>
      </Show>

      <Show when={error()}>
         <div class="voting-container">
            <p style={{ color: 'red' }}>Error: {error()}</p>
        </div>
      </Show>

      <Show when={!isLoading() && !error() && category()}>
        {/* Konten voting hanya ditampilkan jika kategori berhasil dimuat */}
        <div class="voting-container">
          <div class="voting-header">
            <div class="categoryHeader">
              <p>{category()?.name}</p> {/* Gunakan optional chaining ?. */}
            </div>
            <div class="searchBar">
              <input type="text" placeholder="Search Artist..." class="search-input" />
            </div>
          </div>

          <div class="candidates-button-container">
            <div class="candidates-list">
              <div class="leftArrow"><img src={arrow} alt="Kiri" /></div>
              <div class="candidates">
                <div class="candidates-row1">
                  {/* Pastikan category().candidates ada sebelum di-slice */}
                  <For each={category()?.candidates?.slice(0, 4) || []}>
                    {(candidate) => (
                      <div class="candidate-group">
                        <img src={`/photo-candidates/${candidate.photo}`} alt={candidate.name} />
                        <p>{candidate.name}</p>
                      </div>
                    )}
                  </For>
                </div>
                <div class="candidates-row2">
                  <For each={category()?.candidates?.slice(4, 8) || []}>
                    {(candidate) => (
                      <div class="candidate-group">
                        {/* Urutan mungkin terbalik di desain Anda, sesuaikan jika perlu */}
                        <p>{candidate.name}</p> 
                        <img src={`/photo-candidates/${candidate.photo}`} alt={candidate.name} />
                      </div>
                    )}
                  </For>
                </div>
              </div>
              <div class="rightArrow"><img src={arrow} alt="Kanan" /></div>
            </div>
            <div class="voteButton" onClick={handleVote}>
              <button>Vote</button>
            </div>
          </div>
        </div>
      </Show>

      <Show when={!isLoading() && !error() && !category()}>
        {/* Ini bisa terjadi jika kategori tidak ditemukan setelah loading selesai tanpa error fetch utama */}
        <div class="voting-container">
            <h1>Kategori tidak ditemukan.</h1>
        </div>
      </Show>

      <Footer />
    </div>
  );
}

export default Voting;