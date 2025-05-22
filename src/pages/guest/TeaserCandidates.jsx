import { loadCategories } from "../../utils/localStorage";
import { For } from "solid-js";
import "../../assets/css/guest/TeaserCandidates.css"

export default function TeaserCandidates() {
  const categories = loadCategories();

  return (
    <div class="container-candidates">
        <For each={categories}>
            {(category) => (
            <div class="container-name-candidates">
                <h3>{category.name}</h3>
                <div class="photo-candidates">

                    <For each={category.candidates.slice(0, 3)}>
                        {(candidate) => (
                        <div class="per-candidate">
                            <div class='box'>
                                <img src={`/photo-candidates/${candidate.photo}`} alt={candidate.name}/>
                                <p>{candidate.name}</p>
                            </div>
                        </div>
                        )}
                    </For>
                    
                </div>
            </div>
            )}
        </For>
    </div>
  );
}