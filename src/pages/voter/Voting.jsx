import NavbarGuest from "../../components/Navbar.jsx";
import bannerImg from "../../assets/img/banner.png";
import arrow from "../../assets/img/arrow.png"
import "../../assets/css/voter/Voting.css";
import { For } from "solid-js";
import initialCategories from "../../assets/data/category_candidate.js"
import { useParams } from "@solidjs/router";
import { useNavigate } from "@solidjs/router";


function Voting() {
    const params = useParams();
    const categoryId = params.categoryId;
    const navigate = useNavigate();

    const category = initialCategories.find((category) => category.id === categoryId);

    if (!category) {
        return (
            <>
                <NavbarGuest />
                <div class="banner-container">
                    <img src={bannerImg} alt="Banner" class="bannerImg" />
                </div>
                <h1>Category not found</h1>
            </>
        );
    }

    function handleVote() {
        navigate(`/confirmation/${categoryId}`);
    }


    return (
        <div class="page-container">
            {/* Header */}
            <NavbarGuest />

            <div class="banner-container">
                <img src={bannerImg} alt="Banner" class="bannerImg" />
            </div>

            <div class="voting-container">
                <div class="voting-header">
                    <div class="categoryHeader">
                        <p>{category.name}</p>
                    </div>
                    <div class="searchBar">
                        <input type="text" placeholder="Search Artist..." class="search-input" />
                    </div>
                </div>

                <div class="candidates-button-container">
                    <div class="candidates-list">
                        <div class="leftArrow">
                            <img src={arrow}></img>
                        </div>
                        <div class="candidates">
                            <div class="candidates-row1">
                                <For each={category.candidates.slice(0, 4)}>
                                    {(candidate) => (
                                        <div class="candidate-group">
                                            <img src={`/photo-candidates/${candidate.photo}`} alt={candidate.name} />
                                            <p>{candidate.name}</p>
                                        </div>
                                    )}
                                </For>
                            </div>

                            <div class="candidates-row2">
                                <For each={category.candidates.slice(4, 8)}>
                                    {(candidate) => (
                                        <div class="candidate-group">
                                            <p>{candidate.name}</p>
                                            <img src={`/photo-candidates/${candidate.photo}`} alt={candidate.name} />

                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                        <div class="rightArrow">
                            <img src={arrow}></img>
                        </div>
                    </div>

                    <div class="voteButton" onclick={handleVote}>
                        <button>Vote</button>
                    </div>
                </div>






            </div>

            <div class="footer">
                Thank you for supporting your favorite artists. © 2025 Artist Award.
            </div>


        </div >
    );

}

export default Voting;