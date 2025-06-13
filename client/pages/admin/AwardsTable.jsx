import { createSignal, onMount, For, Show } from "solid-js"; // Impor Show untuk loading/error
import "../../assets/css/admin/awardtable.css";
import { useNavigate } from "@solidjs/router";
import editButton from "../../assets/img/edit.png";

export default function AwardsTable() {
  const navigate = useNavigate();

  //State
  const [categories, setCategories] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  onMount(async () => {
    setIsLoading(true);
    setError(null);

    try {
      //ambil dari endpoint 
      const response = await fetch('http://localhost:8080/api/categories');
      
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
        <p>Loading...</p>
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
              </tbody>
            </table>
          )}
        </For>
      </Show>
    </div>
  );
}