import { loadCategories } from "../../utils/localStorage";
import { For } from "solid-js";
import "../../assets/css/admin/awardtable.css"
import { useNavigate } from "@solidjs/router";
import editButton from "../../assets/img/edit.png";
export default function TeaserCandidates() {
    const categories = loadCategories();
    const navigate = useNavigate();

    return (
        <div class="container-candidates">
            <For each={categories}>
                {(category) => (
                    <table class="category-table">
                        <thead>
                            <tr>
                                <th colspan={2} class="category-header">
                                    <div class="header-content">
                                        <span>{category.name}</span>
                                        <button
                                            class="edit-button"
                                            onClick={() => navigate(`/edit-category/${category.id}`)}
                                        >
                                            <img src={editButton} />
                                        </button>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="category-candidates">

                            <For each={category.candidates}>
                                {(candidate) => (
                                    <tr class="candidate-row">
                                        <td class="candidate-photo">
                                            <img
                                                src={`/photo-candidates/${candidate.photo}`}
                                                alt={candidate.name}
                                            />
                                        </td>
                                        <td class="candidate-name">
                                            {candidate.name}
                                        </td>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </table>
                )}
            </For>
        </div >
    );
}