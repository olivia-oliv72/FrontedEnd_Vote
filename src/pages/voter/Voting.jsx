import NavbarGuest from "../../components/Navbar.jsx";
import bannerImg from "../../assets/img/banner.png";
import arrow from "../../assets/img/arrow.png"

function Voting() {

    return (
        <div class="container">
            {/* Header */}
            <NavbarGuest />

            <div class="banner-container">
                <img src={bannerImg} alt="Banner" />
            </div>

            <div class="voting-container">
                <div class="voting-header">
                    <div class="categoryHeader">
                        <p>Category Name</p>
                    </div>
                    <div class="searchBar">
                        <input type="text" placeholder="Search Artist..." />
                    </div>
                </div>

                <div class="candidates-list">
                    <div class="leftArrow">
                        <img src={arrow}></img>
                    </div>
                    <div class="candidates">
                        <div class="candidates-row1"></div>
                        <div class="candidates-row2"></div>
                    </div>
                    <div class="rightArrow">
                        <img src={arrow}></img>
                    </div>
                </div>

                <div class="voteButton">
                    <button>Vote</button>
                </div>




            </div>

            <div class="footer">
                Thank you for supporting your favorite artists. © 2025 Artist Award.
            </div>


        </div >
    );

}

export default Voting;