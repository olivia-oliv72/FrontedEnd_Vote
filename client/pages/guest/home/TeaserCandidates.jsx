import { createSignal, onMount, For, Show } from "solid-js";
import "../../../assets/css/guest/TeaserCandidates.css";
import arrow from "../../../assets/img/arrow.png";
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
      const serverData = await response.json();

      setCategories(serverData);

    } catch (err) {
      setError(err.message);
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
        <p>Loading...</p>
      </Show>
      <Show when={!isLoading() && !error() && categories().length > 0}>
        <For each={categories()}>
          {(category) => (
            <div class="container-name-candidates">
              <a onClick={() => redirectToVoting(category.id)} style={{ cursor: 'pointer' }}>
                <h3>{category.name}</h3>
              </a>
              <div class="photo-candidates">
                <For each={category.candidates?.slice(0, 3) || []}>
                  {(candidate) => {
                    return (
                      <div class="per-candidate" onClick={() => redirectToVoting(category.id)}>
                        <div class='box-more-candidates'>
                          <img src={`/server/photo-candidates/${candidate.photo}`} alt={candidate.name} />
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
    </div>
  );
}