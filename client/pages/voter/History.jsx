import { createSignal, onMount, For, Show } from 'solid-js';
import "../../assets/css/voter/History.css";
import { getUser } from "../../utils/authentication";

export default function History() {
  const [userVotes, setUserVotes] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [currentUser, setCurrentUser] = createSignal(null);

  onMount(() => {
    const user = getUser();
    setCurrentUser(user);

    setIsLoading(true);
    setError(null);

    try {
      const history = JSON.parse(localStorage.getItem(`history_${user.email}`)) || [];
      setUserVotes(history);
    } catch (err) {
      setError("Gagal memuat riwayat voting.");
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
                  <img class="artist-photo" src={`/server/photo-candidates/${vote.photo}`} alt={vote.name} />
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