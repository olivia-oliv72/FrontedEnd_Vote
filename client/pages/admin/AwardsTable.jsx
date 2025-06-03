
import { createSignal, onMount, For, Show } from "solid-js"; // Impor Show untuk loading/error
import "../../assets/css/admin/awardtable.css";
import { useNavigate } from "@solidjs/router";
import editButton from "../../assets/img/edit.png";

export default function AwardsTable() {
  const [categories, setCategories] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const navigate = useNavigate();

  onMount(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/categories');
      if (!response.ok) {
        throw new Error(`Gagal mengambil data kategori. Status: ${response.status}`);
      }
      const serverData = await response.json();
      setCategories(serverData);
    } catch (err) {
      console.error("Error fetching categories for awards table:", err);
      setError(err.message || "Terjadi kesalahan saat mengambil data.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div class="container-candidates">
      <Show when={isLoading()}>
        <p>Memuat data penghargaan...</p>
      </Show>
      <Show when={error()}>
        <p style={{ color: 'red' }}>Error: {error()}</p>
      </Show>
      <Show when={!isLoading() && !error() && categories().length > 0}>
        <For each={categories()}>
          {(category) => (
            <table class="category-table">
              <thead>
                <tr>
                  <th colspan={2} class="category-header">
                    <div class="header-content">
                      <span>{category.name}</span>
                      <button
                        class="edit-button"
                        onClick={() => navigate(`/admin/edit-category/${category.id}`)} benar
                      >
                        <img src={editButton} alt="Edit" />
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="category-candidates">

                <For each={category.candidates || []}>
                  {(candidate) => (
                    <tr class="candidate-row">
                      <td class="candidate-photo">
                        <img
                          src={`/server/photo-candidates/${candidate.photo}`}
                          alt={candidate.name}
                        />
                      </td>
                      <td class="candidate-name">{candidate.name}</td>
                    </tr>
                  )}
                </For>
                <Show when={!category.candidates || category.candidates.length === 0}>
                  <tr>
                    <td colspan={2} style={{ "text-align": "center", "padding": "10px" }}>
                      Tidak ada kandidat dalam kategori ini.
                    </td>
                  </tr>
                </Show>
              </tbody>
            </table>
          )}
        </For>
      </Show>
      <Show when={!isLoading() && !error() && categories().length === 0}>
        <p>Tidak ada data penghargaan yang tersedia.</p>
      </Show>
    </div>
  );
}