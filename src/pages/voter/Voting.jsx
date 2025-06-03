import NavbarGuest from "../../components/Navbar.jsx"
import arrow from "../../assets/img/arrow.png";
import "../../assets/css/voter/Voting.css";
import { For, createSignal, onMount, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import Banner from "../../components/banner.jsx";
import Footer from "../../components/footer.jsx";

function Voting() {
  const params = useParams();
  const categoryId = params.categoryId;
  const navigate = useNavigate();

  const [category, setCategory] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [selectedCandidate, setSelectedCandidate] = createSignal(null);

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

    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data.");
    } finally {
      setIsLoading(false);
    }
  });

  function handleCandidateClick(candidate) {
    setSelectedCandidate(candidate);
    console.log("Selected candidate:", candidate);
  };

  function handleVote() {
    navigate(`/confirmation/${categoryId}/${selectedCandidate().id}`);
  }

  return (
    <div class="page-voting-container">
      <NavbarGuest />
      <Banner />

      <Show when={isLoading()}>
        <div class="voting-container">
          <p>Memuat kategori...</p>
        </div>
      </Show>

      <Show when={error()}>
        <div class="voting-container">
          <p style={{ color: 'red' }}>Error: {error()}</p>
        </div>
      </Show>

      <Show when={!isLoading() && !error() && category()}>
        <div class="voting-container">
          <div class="voting-header">
            <div class="categoryHeader">
              <p>{category()?.name}</p>
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
                  <For each={category()?.candidates?.slice(0, 3) || []}>
                    {(candidate) => (
                      <div class="candidate-group" onClick={() => handleCandidateClick(candidate)}>
                        <img src={`/photo-candidates/${candidate.photo}`} alt={candidate.name} />
                        <p>{candidate.name}</p>
                      </div>
                    )}
                  </For>
                </div>
                <div class="candidates-row2">
                  <For each={category()?.candidates?.slice(3, 5) || []}>
                    {(candidate) => (
                      <div class="candidate-group" onClick={() => handleCandidateClick(candidate)}>
                        <img src={`/photo-candidates/${candidate.photo}`} alt={candidate.name} />
                        <p>{candidate.name}</p>
                      </div>
                    )}
                  </For>
                </div>
              </div>
              <div class="rightArrow"><img src={arrow} alt="Kanan" /></div>
            </div>
            <Show when={selectedCandidate()}>
              <div class="voteButton" onClick={handleVote}>
                <button>Vote</button>
              </div>
            </Show>
          </div>
        </div>
      </Show>

      <Footer />
    </div>
  );
}

export default Voting;