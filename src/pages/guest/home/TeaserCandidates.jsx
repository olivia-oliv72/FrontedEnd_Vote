import { loadCategories } from "../../../utils/localStorage";
import { For } from "solid-js";
import "../../../assets/css/guest/TeaserCandidates.css"
import arrow from "../../../assets/img/arrow.png"
import { useNavigate } from "@solidjs/router";

export default function TeaserCandidates() {
    const categories = loadCategories();
    const navigate = useNavigate();

    function redirectToVoting(categoryId) {
        navigate(`/voting/${categoryId}`);
    }

    return (
        <div class="container-candidates">
            <For each={categories}>
                {(category) => (
                    <div class="container-name-candidates">
                        <a href=""><h3>{category.name}</h3></a>
                        <div class="photo-candidates">

                            <For each={category.candidates.slice(0, 3)}>
                                {(candidate) => (
                                    <div class="per-candidate" onClick={() => redirectToVoting(category.id)}>
                                        
                                            <div class='box-more-candidates'>
                                                <img src={`/photo-candidates/${candidate.photo}`} alt={candidate.name} />
                                                <p>{candidate.name}</p>
                                            </div>
                                        
                                    </div>
                                )}
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
        </div>
    );
}