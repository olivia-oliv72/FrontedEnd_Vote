import NavbarGuest from "../../components/Navbar.jsx";
import candidatePict from "../../assets/img/iu.png";
import { useNavigate, useParams } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import Footer from "../../components/footer.jsx";
import Banner from "../../components/banner.jsx";

function Confirmation() {
  const params = useParams();
  const categoryId = params.categoryId;
  const candidateId = params.candidateId;
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
        throw new Error(`Failed to fetch categories. Status: ${response.status}`);
      }

      const serverCategories = await response.json();

      const foundCategory = serverCategories.find(cat => cat.id === categoryId);
      setCategory(foundCategory);


      if (foundCategory) {
        setCategory(foundCategory);
        const foundCandidate = foundCategory.candidates.find(c => c.id === candidateId);

        if (foundCandidate) {
          setVotedCandidate(foundCandidate);
        } else {
          setError(`Kandidat dengan ID "${params.candidateId}" tidak ditemukan.`);
        }
      } else {
        setError(`Kategori dengan ID "${categoryId}" tidak ditemukan.`);
      }
    } catch (err) {
      console.error("Error fetching category for confirmation:", err);
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

      <div class="confirmation-container relative flex-1 flex-col items-center justify-center p-4 text-center">
        <Show when={isLoading()}>
          <p>Memuat konfirmasi...</p>
        </Show>
        <Show when={error()}>
          <p style={{ color: 'red' }}>Error: {error()}</p>
        </Show>
        <Show when={!isLoading() && !error() && category() && votedCandidate()}>
          <h1>Voting Complete!</h1>
          <div class="relative inline-block">
              <img src={votedCandidate() ? `/server/photo-candidates/${votedCandidate().photo}` : candidatePict}
                alt={votedCandidate()?.name || "Candidate"} 
                class="size-[200px] rounded-[5px] mx-auto z-0 relative"
              />
            <div class="absolute bottom-0 left-0 w-full h-[60px] bg-gradient-to-t from-black to-transparent"></div>
          </div>
          <div class="text flex flex-col gap-y-[5px] items-center text-[#fff]">
            <h3 class="mb-0">{category()?.name}</h3>
            <h1 class="mt-0 text-2xl font-bold">{votedCandidate()?.name}</h1>
          </div>
          <button class="w-[200px] h-[30px] m-[10px] rounded-[5px] cursor-pointer bg-[#e3c365] font-bold" onClick={backToHome}>Back To Homepage</button>
        </Show>
      </div>

      <Footer />
    </div>
  );
}

export default Confirmation;