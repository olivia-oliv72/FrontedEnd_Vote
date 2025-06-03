import NavbarGuest from "../../components/Navbar.jsx";
import candidatePict from "../../assets/img/iu.png";
import { useNavigate, useParams } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import "../../assets/css/voter/confirmation.css";
import Footer from "../../components/footer.jsx";
import Banner from "../../components/banner.jsx";

function Confirmation() {
  const params = useParams();
  const categoryId = params.categoryId;

  const navigate = useNavigate();

  const [category, setCategory] = createSignal(null);
  const [votedCandidate, setVotedCandidate] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  onMount(async () => {
    setIsLoading(true);
    setError(null);

    
    try {
      const response = await fetch('http://localhost:8080/api/categories'); 

      if (!response.ok) {
        throw new Error(`Gagal mengambil data kategori. Status: ${response.status}`);
      }

      const serverCategories = await response.json();
      
      const foundCategory = serverCategories.find(cat => cat.id === categoryId);
      setCategory(foundCategory);

      //Belum bisa tampilin pilih kandidat yang dipilih 
      if (foundCategory) {
        if (foundCategory.candidates && foundCategory.candidates.length > 0) {
          setVotedCandidate(foundCategory.candidates[0]); //Masih pakai candidates[0]
        }
      } else {
        setError(`Kategori dengan ID "${categoryId}" tidak ditemukan.`);
      }
    } catch (err) {
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
          <img src={votedCandidate() ? `/photo-candidates/${votedCandidate().photo}` : candidatePict} alt={votedCandidate()?.name || "Candidate"} />
          <div class="text">
            <h2>{category()?.name}</h2>
            <h3>{votedCandidate()?.name}</h3>
          </div>
          <button onClick={backToHome}>Back To Homepage</button>
        </Show>
        
      </div>

      <Footer />
    </div>
  );
}

export default Confirmation;