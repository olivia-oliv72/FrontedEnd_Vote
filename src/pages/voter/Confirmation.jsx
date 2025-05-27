import NavbarGuest from "../../components/Navbar.jsx";
import bannerImg from "../../assets/img/banner.png";
import candidatePict from "../../assets/img/iu.png"
import initialCategories from "../../assets/data/category_candidate.js"
import { useNavigate, useParams } from "@solidjs/router";
import "../../assets/css/voter/confirmation.css";

function Confirmation() {
    const params = useParams();
    const categoryId = params.categoryId;

    const category = initialCategories.find((category) => category.id === categoryId);
    const navigate = useNavigate();

    function backToHome() {
        navigate("/")
    }

    return (
        <div class="page-voting-container">
            <NavbarGuest />

            <div class="banner-container">
                <img src={bannerImg} alt="Banner" class="bannerImg" />
            </div>

            <div class="confirmation-container">
                <h1>Voting Complete!</h1>
                <img src={candidatePict}></img>
                <div class="text">
                    <h2>{category.name}</h2>
                    <h3>{category.candidates[0].name}</h3>
                </div>

                <button onClick={backToHome}>Back To Homepage</button>
            </div>

            <div class="footer">
                Thank you for supporting your favorite artists. © 2025 Artist Award.
            </div>
        </div>
    )
}

export default Confirmation;