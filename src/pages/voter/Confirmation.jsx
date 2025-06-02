// client/src/pages/voter/Confirmation.jsx (sesuaikan path jika perlu)
import NavbarGuest from "../../components/Navbar.jsx";
// import bannerImg from "../../assets/img/banner.png"; // Tidak terpakai di JSX, bisa dihapus jika banner.jsx sudah include
import candidatePict from "../../assets/img/iu.png"; // Ini masih hardcoded, perlu dipertimbangkan
// HAPUS: import initialCategories from "../../assets/data/category_candidate.js";
import { useNavigate, useParams } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js"; // Impor yang diperlukan
import "../../assets/css/voter/confirmation.css";
import Footer from "../../components/footer.jsx";
import Banner from "../../components/banner.jsx";

// Opsional: Jika Anda ingin menggunakan cache dari localStorage
// import { getCachedCategories } from '../../utils/localStorage';


function Confirmation() {
  const params = useParams();
  const categoryId = params.categoryId; // ID kategori dari URL
  // TODO: Anda juga perlu ID kandidat yang dipilih, mungkin dari params atau state router
  // const votedCandidateId = params.candidateId; // Contoh jika ada di URL

  const navigate = useNavigate();

  const [category, setCategory] = createSignal(null);
  const [votedCandidate, setVotedCandidate] = createSignal(null); // Untuk menyimpan kandidat yg di-vote
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
    //     // Jika Anda tahu ID kandidat, cari juga di sini
    //     // const foundCandidate = foundCategory.candidates.find(c => c.id === votedCandidateId);
    //     // if (foundCandidate) setVotedCandidate(foundCandidate);
    //   }
    // }
    
    try {
      const response = await fetch('http://localhost:8080/api/categories'); // Sesuaikan port
      if (!response.ok) {
        throw new Error(`Gagal mengambil data kategori. Status: ${response.status}`);
      }
      const serverCategories = await response.json();
      
      const foundCategory = serverCategories.find(cat => cat.id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
        // Untuk sekarang, kita tetap tampilkan kandidat pertama atau gambar placeholder
        // Idealnya, Anda akan mencari kandidat spesifik yang di-vote
        if (foundCategory.candidates && foundCategory.candidates.length > 0) {
          // Jika Anda punya votedCandidateId:
          // const foundCand = foundCategory.candidates.find(c => c.id === votedCandidateId);
          // setVotedCandidate(foundCand || foundCategory.candidates[0]); // Fallback ke yg pertama jika tdk ketemu
          setVotedCandidate(foundCategory.candidates[0]); // Sementara pakai yg pertama
        }
      } else {
        setError(`Kategori dengan ID "${categoryId}" tidak ditemukan.`);
      }
    } catch (err) {
      console.error("Error fetching category for confirmation:", err);
      // if (!category()) setError(err.message || "Terjadi kesalahan.");
      setError(err.message || "Terjadi kesalahan saat mengambil data.");
    } finally {
      setIsLoading(false);
    }
  });

  function backToHome() {
    navigate("/");
  }

  return (
    <div class="page-voting-container">
      <NavbarGuest />
      <Banner />

      <div class="confirmation-container">
        <Show when={isLoading()}>
          <p>Memuat konfirmasi...</p>
        </Show>
        <Show when={error()}>
          <p style={{ color: 'red' }}>Error: {error()}</p>
        </Show>
        <Show when={!isLoading() && !error() && category() && votedCandidate()}>
          <h1>Voting Complete!</h1>
          {/* Ganti candidatePict dengan foto kandidat yang di-vote jika sudah dinamis */}
          <img src={votedCandidate() ? `/photo-candidates/${votedCandidate().photo}` : candidatePict} alt={votedCandidate()?.name || "Candidate"} />
          <div class="text">
            <h2>{category()?.name}</h2>
            <h3>{votedCandidate()?.name}</h3>
          </div>
          <button onClick={backToHome}>Back To Homepage</button>
        </Show>
        <Show when={!isLoading() && !error() && (!category() || !votedCandidate()) && !error()}>
          {/* Ini ditampilkan jika kategori atau kandidat tidak ditemukan setelah loading selesai */}
          <h1>Informasi vote tidak lengkap.</h1>
          <button onClick={backToHome}>Back To Homepage</button>
        </Show>
      </div>

      <Footer />
    </div>
  );
}

export default Confirmation;