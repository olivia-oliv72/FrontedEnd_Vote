// client/src/pages/admin/AwardsTable.jsx (sesuaikan path jika perlu)
import { createSignal, onMount, For, Show } from "solid-js"; // Impor Show untuk loading/error
import "../../assets/css/admin/awardtable.css"; // Pastikan path CSS benar
import { useNavigate } from "@solidjs/router";
import editButton from "../../assets/img/edit.png"; // Pastikan path gambar benar

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
    <div class="container-candidates"> {/* Anda mungkin ingin class yang lebih sesuai, misal "awards-table-container" */}
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
                        onClick={() => navigate(`/admin/edit-category/${category.id}`)} // Pastikan path navigasi benar
                      >
                        <img src={editButton} alt="Edit" /> {/* Tambahkan alt text */}
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="category-candidates">
                {/* Pastikan category.candidates ada sebelum di-For */}
                <For each={category.candidates || []}> 
                  {(candidate) => (
                    <tr class="candidate-row">
                      <td class="candidate-photo">
                        <img
                          src={`/photo-candidates/${candidate.photo}`} // Pastikan path gambar kandidat benar
                          alt={candidate.name}
                        />
                      </td>
                      <td class="candidate-name">{candidate.name}</td>
                    </tr>
                  )}
                </For>
                <Show when={!category.candidates || category.candidates.length === 0}>
                  <tr>
                    <td colspan={2} style={{"text-align": "center", "padding": "10px"}}>
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