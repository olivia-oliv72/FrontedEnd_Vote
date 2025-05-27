import { createSignal, onMount, For } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { loadCategories, saveCategories } from "../../utils/localStorage";
import Navbar from "../../components/Navbar";
import "../../assets/css/admin/dashboard.css";
import "../../assets/css/admin/addCategory.css"
import remove from "../../assets/img/remove.png"
import add from "../../assets/img/add.png"


export default function AddCategory() {
    const params = useParams();
    const navigate = useNavigate();

    const [categoryName, setCategoryName] = createSignal("");
    const [candidates, setCandidates] = createSignal([{ name: "", photo: "" }]);

    const handleAddCandidate = () => {
        setCandidates([...candidates(), { name: "", photo: "" }]);
    };

    const handleSave = () => {

        navigate("/admin");
    };
    const cancel = () => {
        navigate("/admin");
    };
    return (
        <div>
            {/* Header */}
            <Navbar />
            <div class="edit-container">
                <div class="title-container">
                    <h1 class="title">Add New Category</h1>
                </div>
                <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    <div className="container-form">
                        <div class="category-container">
                            <label for="category" className="name">Category Name: </label>
                            <input id="category"
                                type="text" class="input-category" placeholder="Category Name"
                                value={categoryName()}
                            />
                        </div>
                        <For each={candidates()}>
                            {(candidate, index) => (
                                <div class="candidate">
                                    <div class="candidate-name-input">
                                        <label for="name" class="name">Artist name:</label>
                                        <input id="name"
                                            class="input-category"
                                            type="text"
                                            placeholder="Artist Name"
                                            value={candidate.name}
                                            onChange={e => handleCandidateChange(index(), "name", e.target.value)} />
                                        <img src={remove} class="delete-btn" />
                                    </div>

                                    <button type="button" class="upload-photo">Upload photo</button>
                                </div>
                            )}
                        </For>
                        <div className="buttons">
                            <img onClick={handleAddCandidate} src={add}></img>
                            <div className="cancel-save-btn">
                                <button type="button" onclick={cancel}>Cancel</button>
                                <button type="submit">Save</button>
                            </div>
                        </div>
                    </div >
                </form >
            </div >
        </div >
    );
}