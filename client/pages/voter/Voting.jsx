import NavbarGuest from "../../components/Navbar.jsx"
import arrow from "../../assets/img/arrow.png";
import "../../assets/css/voter/Voting.css";
import { For, createSignal, onMount, Show, createEffect } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import Banner from "../../components/banner.jsx";
import Footer from "../../components/footer.jsx";
import { getUser } from "../../utils/authentication.js";

function Voting() {
  const params = useParams();
  const categoryId = params.categoryId;
  const navigate = useNavigate();

  const [category, setCategory] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [selectedCandidate, setSelectedCandidate] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal(0);
  const [showOverlay, setShowOverlay] = createSignal(false);
  const [allCandidates, setAllCandidates] = createSignal([]);
  const [displayCandidates, setDisplayCandidates] = createSignal([]);
  const [searchQuery, setSearchQuery] = createSignal("");

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
      if (foundCategory && foundCategory.candidates) {
        setAllCandidates(foundCategory.candidates);
        setDisplayCandidates(foundCategory.candidates)
      }

    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data.");
    } finally {
      setIsLoading(false);
    }
  });

  createEffect(() => {
    const query = searchQuery().toLowerCase();
    if (allCandidates()) {
      const filtered = allCandidates().filter(candidate =>
        candidate.name.toLowerCase().includes(query)
      );
      setDisplayCandidates(filtered);
      setCurrentPage(0);
    }
  });

  function handleCandidateClick(candidate) {
    setSelectedCandidate(candidate);
    console.log("Selected candidate:", candidate);
  };

  function handleVoteClick() {
    setShowOverlay(true);
  }

  function confirmVote() {
    const user = getUser();
    if (!user) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    const storageKey = `history_${user.email}`;
    const previousVotes = JSON.parse(localStorage.getItem(storageKey)) || [];

    const alreadyVoted = previousVotes.some(vote => vote.category === category().name);
    if (alreadyVoted) {
      alert(`Kamu sudah melakukan voting untuk kategori "${category().name}".`);
      setShowOverlay(false); //sembunyikan overlay
      return;
    }

    const voteData = {
      category: category().name,
      candidateId: selectedCandidate().id,
      name: selectedCandidate().name,
      photo: selectedCandidate().photo,
    };

    const updatedVotes = [...previousVotes, voteData];
    localStorage.setItem(storageKey, JSON.stringify(updatedVotes));

    navigate(`/confirmation/${categoryId}/${selectedCandidate().id}`);
  }


  function hasAlreadyVoted() {
    const user = getUser();
    const storageKey = `history_${user?.email}`;
    const previousVotes = JSON.parse(localStorage.getItem(storageKey)) || [];
    return previousVotes.some(v => v.category === category().name);
  }


  function handlePagination() {
    const totalPages = Math.ceil(displayCandidates().length / 5);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
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
              <input
                type="text"
                placeholder="Search Artist..."
                class="search-input"
                value={searchQuery()}
                onInput={handleSearchChange}
              />
            </div>
          </div>

          <div class="candidates-button-container">
            <div class="candidates-list">
              <Show when={displayCandidates().length > 5}>
                <div class="leftArrow" onClick={handlePagination}><img src={arrow} alt="Kiri" /></div>
              </Show>
              <div class="candidates">
                <div class="candidates-row1">
                  <For each={
                    displayCandidates().slice(currentPage() * 5, currentPage() * 5 + 3)
                  }>
                    {(candidate) => (
                      <div class="candidate-group" onClick={() => handleCandidateClick(candidate)}>
                        <img
                          src={`/server/photo-candidates/${candidate.photo}`}
                          alt={candidate.name}
                          class={selectedCandidate()?.id === candidate.id ? "candidate-img selected" : "candidate-img"}
                        />
                        <p>{candidate.name}</p>
                      </div>
                    )}
                  </For>
                </div>

                <div class="candidates-row2">
                  <For each={
                    displayCandidates().slice(currentPage() * 5 + 3, currentPage() * 5 + 5)
                  }>
                    {(candidate) => (
                      <div class="candidate-group" onClick={() => handleCandidateClick(candidate)}>
                        <img
                          src={`/server/photo-candidates/${candidate.photo}`}
                          alt={candidate.name}
                          class={selectedCandidate()?.id === candidate.id ? "candidate-img selected" : "candidate-img"}
                        />
                        <p>{candidate.name}</p>
                      </div>
                    )}
                  </For>
                </div>
              </div>
              <Show when={displayCandidates().length > 5}>
                <div class="rightArrow" onClick={handlePagination}><img src={arrow} alt="Kanan" /></div>
              </Show>
            </div>
            <Show when={selectedCandidate() && !hasAlreadyVoted()}>
              <p class="selected-name">Your Pick: <strong>{selectedCandidate().name}</strong></p>
              <div class="voteButton" onClick={handleVoteClick}>
                <button>Vote</button>
              </div>


            </Show>

            <Show when={hasAlreadyVoted()}>
              <p class="already-voted">You have already voted for this category</p>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={showOverlay()}>
        <div class="overlay">
          <div class="overlay-content">
            <p>Are you sure you want to vote for <strong>{selectedCandidate().name}</strong>?</p>
            <div class="overlay-buttons">
              <button onClick={confirmVote}>OK</button>
              <button onClick={() => setShowOverlay(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </Show>


      <Footer />
    </div>
  );
}

export default Voting;