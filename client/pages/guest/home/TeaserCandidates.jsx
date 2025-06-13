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
    <div class="container-candidates flex flex-col">
      <Show when={isLoading()}>
        <p>Loading candidates...</p>
      </Show>
      <Show when={error()}>
        <p style={{ color: 'red' }}>Error: {error()}</p>
      </Show>
      <Show when={!isLoading() && !error() && categories().length > 0}>
        <For each={categories()}>
          {(category) => (
            <div class="container-name-candidates flex flex-col pt-0 pr-[15px] pb-[30px] pl-0">
              <a onClick={() => redirectToVoting(category.id)} class="no-underline text-[#000] cursor-pointer">
                <h3 class="p-[10px] pl-[90px] font-bold text-[30px] text-[#fff]">{category.name}</h3>
              </a>
              <div class="photo-candidates flex justify-evenly">
                <For each={category.candidates?.slice(0, 3) || []}>
                  {(candidate) => {
                    return (
                      <div class="per-candidate cursor-pointer" onClick={() => redirectToVoting(category.id)}>
                        <div class="box-more-candidates relative inline-block hover:scale-[1.2] transition duration-1000">
                          <img src={`/server/photo-candidates/${candidate.photo}`} alt={candidate.name} class="size-[200px] rounded-[5px]" />
                          <div class="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-black to-transparent"></div>
                          <p class="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[170px] text-[20px] text-[#e3c365] text-center font-medium tracking-[-1px]">{candidate.name}</p>
                        </div>
                      </div>
                    );
                  }}
                </For>
                <div class="more-candidates flex flex-col size-[200px] items-center justify-center cursor-pointer rounded-[5px]" onClick={() => redirectToVoting(category.id)}>
                  <span class="text-[20px] text-[#e3c365] text-center font-bold leading-[1]">View more candidates</span>
                  <img class="h-[60px] w-[70px]" src={arrow} alt="arrow" />
                </div>
              </div>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}