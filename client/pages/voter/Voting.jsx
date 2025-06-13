import NavbarGuest from "../../components/Navbar.jsx"
import arrow from "../../assets/img/arrow.png";
import { For, createSignal, onMount, Show, createEffect } from "solid-js";
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
        throw new Error(`Failed to fetch categories. Status: ${response.status}`);
      }
      const serverCategories = await response.json();

      const foundCategory = serverCategories.find(cat => cat.id === categoryId);
      setCategory(foundCategory);
      if (foundCategory && foundCategory.candidates) {
        setAllCandidates(foundCategory.candidates);
        setDisplayCandidates(foundCategory.candidates)
      }

    } catch (err) {
      setError(err.message || "Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  });

  createEffect(() => {
    const query = searchQuery().toLowerCase();
    if(allCandidates()) {
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
    navigate(`/confirmation/${categoryId}/${selectedCandidate().id}`);
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
          <p>Loading categories...</p>
        </div>
      </Show>

      <Show when={error()}>
        <div class="voting-container">
          <p style={{ color: 'red' }}>Error: {error()}</p>
        </div>
      </Show>

      <Show when={!isLoading() && !error() && category()}>
        <div class="voting-container">
          <div class="voting-header flex items-center justify-between p-[5px]">
            <div class="categoryHeader w-[75%] h-[10%]">
              <p class="p-[10px] pl-[90px] font-bold text-[30px] text-[#fff]">{category()?.name}</p>
            </div>
            <div class="searchBar pr-[90px]">
              <input 
                type="text" 
                placeholder="Search Artist..." 
                class="search-input w-[230px] h-[40px] rounded-[20px] p-[20px] bg-[#fff]" 
                value={searchQuery()}
                onInput={handleSearchChange}
              />
            </div>
          </div>

          <div class="candidates-button-container flex flex-col items-center mt-[25px] mr-0 mb-[25px] ml-0">
            <div class="candidates-list flex items-center column-x-[50px]">
              <Show when={displayCandidates().length > 5}>
                <div class="leftArrow h-[60px] w-[70px] cursor-pointer scale-x-[-1]" onClick={handlePagination}><img src={arrow} alt="Kiri" /></div>
              </Show>
              <div class="candidates flex flex-col items-center w-[100%]">
                <div class="candidates-row1 flex">
                  <For each={
                    displayCandidates().slice(currentPage() * 5, currentPage() * 5 + 3)
                  }>
                    {(candidate) => (
                      <div class="candidate-group relative inline-block size-[200px] m-[10px] gap-x-[10px] hover:scale-[1.2] transition duration-1000" onClick={() => handleCandidateClick(candidate)}>
                        <img
                          src={`/server/photo-candidates/${candidate.photo}`}
                          alt={candidate.name}
                          class={selectedCandidate()?.id === candidate.id ? "candidate-img selected" : "candidate-img rounded-[5px]"}
                        />
                        <div class="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-black to-transparent"></div>
                        <p class="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[170px] text-[20px] text-[#e3c365] text-center font-medium tracking-[-1px]">{candidate.name}</p>
                      </div>
                    )}
                  </For>
                </div>

                <div class="candidates-row2 flex">
                  <For each={
                    displayCandidates().slice(currentPage() * 5 + 3, currentPage() * 5 + 5)
                  }>
                    {(candidate) => (
                      <div class="candidate-group relative inline-block size-[200px] m-[10px] gap-x-[10px] hover:scale-[1.2] transition duration-1000" onClick={() => handleCandidateClick(candidate)}>
                        <img
                          src={`/server/photo-candidates/${candidate.photo}`}
                          alt={candidate.name}
                          class={selectedCandidate()?.id === candidate.id ? "candidate-img selected size-[200px] rounded-[5px]" : "candidate-img size-[200px] rounded-[5px]"}
                        />
                        <div class="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-black to-transparent"></div>
                        <p class="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[170px] text-[20px] text-[#e3c365] text-center font-medium tracking-[-1px]">{candidate.name}</p>
                      </div>
                    )}
                  </For>
                </div>
              </div>
              <Show when={displayCandidates().length > 5}>
                <div class="rightArrow h-[60px] w-[70px] cursor-pointer" onClick={handlePagination}><img src={arrow} alt="Kanan" /></div>
              </Show>
            </div>
            <Show when={selectedCandidate()}>
              <p class="selected-name font-larger text-[#fff]">Your Pick: <strong>{selectedCandidate().name}</strong></p>
              <div class="voteButton" onClick={handleVoteClick}>
                <button class="w-[150px] h-[40px] m-[10px] rounded-[10px] cursor-pointer bg-[#e3c365] font-bold">Vote</button>
              </div>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={showOverlay()}>
        <div class="overlay flex fixed top-0 left-0 size-[100%] items-center justify-center z-999">
          <div class="overlay-content bg-[#fff] p-[1.5rem] rounded-sm text-center shadow-xl">
            <p class="text-[20px]">Are you sure you want to vote for <strong>{selectedCandidate().name}</strong>?</p>
            <div class="overlay-buttons flex mt-[1rem] gap-[1rem] justify-center">
              <button class="px-4 py-1.5 rounded-md bg-[#e3c365]" onClick={confirmVote}>OK</button>
              <button class="px-4 py-1.5 rounded-md bg-[#ccc]" onClick={() => setShowOverlay(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </Show>


      <Footer />
    </div>
  );
}

export default Voting;