import NavbarGuest from "../../../components/Navbar";
import "../../../assets/css/guest/Home.css"
import bannerImg from "../../../assets/img/banner.png"
import TeaserCandidates from "./TeaserCandidates";

export default function Home() {
  return (
    <div>
      {/* Header */}
      <NavbarGuest/>

      {/* Banner */}
      <div class="container-banner">
        <img src={bannerImg} alt="" />
        <p>Voting platform for Artist Award 2025! Discover the nominees and vote for your favorite artist.</p>
      </div>

      {/* Countdown Time*/}
      <div class="container-timer">
        <h1>Remaining Time:</h1>
        <h1>00:00:00</h1>
      </div>

      {/* Categories */}
      <TeaserCandidates/>

      {/* Footer */}
      <div class="footer">
        Thank you for supporting your favorite artists. © 2025 Artist Award.
      </div>
    </div>
  );
}
