import { createSignal, onMount, For, Show } from "solid-js";
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
      if (!response.ok) {
        throw new Error(`Failed to fetch category. Status: ${response.status}`);
      }
      const serverData = await response.json();
      setCategories(serverData);

    } catch (err) {
      console.error("Error fetching categories for awards table:", err);
      setError(err.message || "Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div class="container-candidates">
      <Show when={isLoading()}>
        <p>Loading awards data...</p>
      </Show>
      <Show when={error()}>
        <p style={{ color: 'red' }}>Error: {error()}</p>
      </Show>
      <Show when={!isLoading() && !error() && categories().length > 0}>
        <For each={categories()}>
          {(category) => (
            <table class="category-table w-full max-w-[90vw] bg-white m-[2rem]">
              <thead>
                <tr class="items-center">
                  <th colspan={2} class="category-header sticky top-0 z-1 p-[1rem] text-[1.5rem] text-center bg-[#fff]">
                    
                    <div class="header-content relative text-center">
                      <span>{category.name}</span>
                      <button
                        class="edit-button absolute right-0 top-[50%] translate-y-[-50%] cursor-pointer text-[0.9rem] hover:underline"
                        onClick={() => navigate(`/admin/edit-category/${category.id}`)} benar>
                        <img class="size-[20px]" src={editButton} alt="Edit" />
                      </button>
                    </div>
                    
                  </th>
                </tr>
              </thead>
              <tbody class="category-candidates">

                <For each={category.candidates || []}>
                  {(candidate) => (
                    <tr class="candidate-row">
                
                      <td class="candidate-photo py-[0.1rem]">
                        <img
                          class="size-[150px] rounded-[5px] p-[0.5rem]"
                          src={`/server/photo-candidates/${candidate.photo}`}
                          alt={candidate.name}
                        />
                      </td>
                      
                      <td class="candidate-name text-[20px] font-bold align-middle">{candidate.name}</td>
                    </tr>
                  )}
                </For>
                <Show when={!category.candidates || category.candidates.length === 0}>
                  <tr>
                    <td colspan={2} class="text-center p-[10px]">
                      Tidak ada kandidat dalam kategori ini.
                    </td>
                  </tr>
                </Show>
              </tbody>
            </table>
          )}
        </For>
      </Show>
    </div>
  );
}