// client/src/pages/guest/home/TeaserCandidates.jsx (sesuaikan path jika berbeda)
import { createSignal, onMount, For, Show } from "solid-js";
import "../../../assets/css/guest/TeaserCandidates.css"; // Pastikan path CSS benar
import arrow from "../../../assets/img/arrow.png"; // Pastikan path gambar benar
import { useNavigate } from "@solidjs/router";

export default function TeaserCandidates() {
  const [categories, setCategories] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const navigate = useNavigate();

  onMount(async () => {
    setIsLoading(true);
    setError(null);
    setCategories([]);

    try {
      const response = await fetch('http://localhost:8080/api/categories');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("TeaserCandidates.jsx - HTTP Error Response:", errorText);
        throw new Error(`Gagal mengambil data. Status: ${response.status}. Pesan: ${errorText || response.statusText}`);
      }

      const serverData = await response.json();
      console.log('TeaserCandidates.jsx - Data mentah dari server /api/categories:', serverData);

      if (Array.isArray(serverData)) {
        setCategories(serverData);
      } else {
        console.error("TeaserCandidates.jsx - Data dari server BUKAN array:", serverData);
        setCategories([]);
        setError("Format data kategori dari server tidak sesuai. Harusnya array.");
      }
    } catch (err) {
      console.error("TeaserCandidates.jsx - Error saat fetch atau proses data:", err);
      setError(err.message || "Terjadi kesalahan saat mengambil data kategori.");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  });

  function redirectToVoting(categoryId) {
    navigate(`/voting/${categoryId}`);
  }

  return (
    <div class="container-candidates">
      <Show when={isLoading()}>
        <p>Memuat kandidat...</p>
      </Show>
      <Show when={error()}>
        <p style={{ color: 'red' }}>Error: {error()}</p>
      </Show>
      <Show when={!isLoading() && !error() && categories().length > 0}>
        <For each={categories()}>
          {(category) => (
            <div class="container-name-candidates">
              <a onClick={() => redirectToVoting(category.id)} style={{cursor: 'pointer'}}>
                <h3>{category.name}</h3>
              </a>
              <div class="photo-candidates">
                <For each={category.candidates?.slice(0, 3) || []}>
                  {(candidate) => {
                    // === TAMBAHKAN CONSOLE.LOG DI SINI UNTUK DEBUG GAMBAR ===
                    console.log(`TeaserCandidates.jsx - Data kandidat untuk kategori "${category.name}":`, candidate);
                    // Periksa nilai candidate.photo di sini
                    // =======================================================
                    return (
                      <div class="per-candidate" onClick={() => redirectToVoting(category.id)}>
                        <div class='box-more-candidates'>
                          {/* Pastikan path gambar ini benar */}
                          <img src={`/photo-candidates/${candidate.photo}`} alt={candidate.name} />
                          <p>{candidate.name}</p>
                        </div>
                      </div>
                    );
                  }}
                </For>
                <div class="more-candidates" onClick={() => redirectToVoting(category.id)}>
                  <span>View more</span>
                  <span>candidates</span>
                  <img src={arrow} alt="arrow" />
                </div>
              </div>
            </div>
          )}
        </For>
      </Show>
      <Show when={!isLoading() && !error() && categories().length === 0}>
        <p>Tidak ada kategori kandidat yang ditampilkan saat ini.</p>
      </Show>
    </div>
  );
}