// client/src/pages/voter/History.jsx (sesuaikan path jika perlu)
import { createSignal, onMount, For, Show } from 'solid-js';
// HAPUS: import { loadHistory } from "../../utils/localStorage";
import "../../assets/css/voter/History.css";
import { getUser } from "../../utils/authentication"; // Pastikan path ini benar

// Opsional: Jika Anda mengimplementasikan caching di localStorage.js
// import { getCachedUserHistory, cacheUserHistory } from '../../utils/localStorage';

export default function History() {
  const [userVotes, setUserVotes] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [currentUser, setCurrentUser] = createSignal(null); // Untuk menampilkan nama/email user

  onMount(async () => {
    const user = getUser(); // Mendapatkan informasi pengguna yang sedang login
    
    if (user && user.email) {
      setCurrentUser(user); // Simpan info user untuk ditampilkan jika perlu
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
            // Jika server merespons 404, berarti pengguna belum punya riwayat
            setUserVotes([]); // Set riwayat menjadi array kosong
            console.log("Tidak ada riwayat voting untuk pengguna:", user.email);
          } else {
            // Untuk error server lainnya
            throw new Error(`Gagal mengambil riwayat. Status: ${response.status}`);
          }
        } else {
          const dataFromServer = await response.json();
          if (dataFromServer.success && dataFromServer.history && dataFromServer.history.vote) {
            setUserVotes(dataFromServer.history.vote);
            // Opsional: Simpan ke cache
            // cacheUserHistory(user.email, dataFromServer.history);
          } else if (dataFromServer.success && (!dataFromServer.history || !dataFromServer.history.vote)) {
            // Server merespons sukses tapi tidak ada data vote (misalnya, pengguna baru)
            setUserVotes([]);
          } else {
            // Jika format respons tidak sesuai harapan meskipun sukses
            console.warn("Format data riwayat dari server tidak sesuai:", dataFromServer);
            setUserVotes([]); // Tampilkan sebagai tidak ada riwayat
            // Anda bisa juga setError("Format data riwayat tidak valid.")
          }
        }
      } catch (err) {
        console.error("Error fetching history:", err);
        // setError(err.message || "Terjadi kesalahan saat mengambil riwayat.");
        // Jika fetch gagal dan tidak ada cache, tampilkan error
        // if (!cachedHistory || !cachedHistory.vote ) setError(err.message || "Terjadi kesalahan.");
         setError(err.message || "Terjadi kesalahan saat mengambil riwayat.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Jika tidak ada pengguna yang login atau email tidak ditemukan
      setError("Silakan login untuk melihat riwayat voting Anda.");
      setIsLoading(false);
    }
  });

  return (
    <>
      {/* Anda mungkin punya Navbar atau komponen header lain di sini */}
      <div class="container-main-history"> {/* Ganti nama class jika perlu agar unik */}
        <h2>
          Riwayat Voting 
          <Show when={currentUser()?.username}>
            <span> untuk {currentUser().username}</span>
          </Show>
          <Show when={!currentUser()?.username && currentUser()?.email}>
             <span> untuk {currentUser().email}</span>
          </Show>
        </h2>

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
                  {/* Pastikan path gambar benar */}
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
          {/* Tampil jika sudah login tapi tidak ada riwayat */}
          <p>Anda belum memiliki riwayat voting.</p>
        </Show>

        {/* Pesan jika belum login sudah ditangani oleh setError di onMount */}
      </div>
      {/* Anda mungkin punya Footer atau komponen lain di sini */}
    </>
  );
}