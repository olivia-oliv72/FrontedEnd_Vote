import NavbarGuest from "../../components/Navbar.jsx";
import bannerImg from "../../assets/img/banner.png";
import candidatePict from "../../assets/img/iu.png"
import initialCategories from "../../assets/data/category_candidate.js"
import { useNavigate, useParams } from "@solidjs/router";
import "../../assets/css/voter/confirmation.css";
import Footer from "../../components/footer.jsx";
import Banner from "../../components/banner.jsx";

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

            <Banner/>

            <div class="confirmation-container">
                <h1>Voting Complete!</h1>
                <img src={candidatePict}></img>
                <div class="text">
                    <h2>{category.name}</h2>
                    <h3>{category.candidates[0].name}</h3>
                </div>

                <button onClick={backToHome}>Back To Homepage</button>
            </div>

            <Footer/>
        </div>
    )
}

export default Confirmation;