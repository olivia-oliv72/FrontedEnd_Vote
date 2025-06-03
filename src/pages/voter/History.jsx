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
    
    if (user && user.email) {
      setCurrentUser(user);
      setIsLoading(true);
      setError(null);

      // Opsional: Coba ambil dari cache dulu
      // const cachedHistory = getCachedUserHistory(user.email);
      // if (cachedHistory && cachedHistory.vote) {
      //   setUserVotes(cachedHistory.vote);
      //   // Anda bisa set isLoading(false) di sini, tapi tetap fetch untuk update
      // }

      try {
        // Ambil data riwayat spesifik untuk pengguna yang login dari API server
        // Pastikan port (8080) dan endpoint sudah benar
        const response = await fetch(`http://localhost:8080/api/history/${user.email}`); 
        
        if (!response.ok) {
          if (response.status === 404) {
            setUserVotes([]); 
            console.log("Tidak ada riwayat voting untuk pengguna:", user.email);
          } else {
            throw new Error(`Gagal mengambil riwayat. Status: ${response.status}`);
          }
        } else {
          const dataFromServer = await response.json();
          if (dataFromServer.success && dataFromServer.history && dataFromServer.history.vote) {
            setUserVotes(dataFromServer.history.vote);
          } else if (dataFromServer.success && (!dataFromServer.history || !dataFromServer.history.vote)) {
            setUserVotes([]);
          } else {
            console.warn("Format data riwayat dari server tidak sesuai:", dataFromServer);
            setUserVotes([]); 
          }
        }
      } catch (err) {
        console.error("Error fetching history:", err);
         setError(err.message || "Terjadi kesalahan saat mengambil riwayat.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Silakan login untuk melihat riwayat voting Anda.");
      setIsLoading(false);
    }
  });

  return (
    <>
      <div class="container-main-history">

        <Show when={isLoading()}>
          <p>Memuat riwayat...</p>
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
          <p>Anda belum memiliki riwayat voting.</p>
        </Show>

      </div>
    </>
  );
}