import { createSignal, onMount, For, Show } from 'solid-js';
import "../../assets/css/voter/History.css";
import { getUser } from "../../utils/authentication";


export default function History() {
  const [userVotes, setUserVotes] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [currentUser, setCurrentUser] = createSignal(null); 

  onMount(async () => {
    const user = getUser(); 
    
    setCurrentUser(user);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/history/${user.email}`); 

      if (!response.ok) {
        setUserVotes([]); 
      } else {
        const dataFromServer = await response.json();
        setUserVotes(dataFromServer.history.vote);
      }
    } catch (err) {
        setError(err.message || "Terjadi kesalahan saat mengambil history vote.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <div class="container-main-history">

        <Show when={isLoading()}>
          <p>Memuat history...</p>
        </Show>

        <Show when={error()}>
          <p style={{ color: "red" }}>Error: {error()}</p>
        </Show>

        <Show when={!isLoading() && !error() && userVotes().length > 0}>
          <For each={userVotes()}>
            {(vote) => (
              <div class="container-history">
                <div class="container-photo">
                  <img class="artist-photo" src={`/photo-candidates/${vote.photo}`} alt={vote.name} />
                </div>
                <div class="container-info">
                  <h1 class="name-category">{vote.category}</h1>
                  <p class="artist">{vote.name}</p>
                </div>
              </div>
            )}
          </For>
        </Show>

        <Show when={!isLoading() && !error() && userVotes().length === 0 && currentUser()}>
          <p>Belum ada history voting.</p>
        </Show>

      </div>
    </>
  );
}