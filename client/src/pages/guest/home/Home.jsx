import NavbarGuest from "../../../components/Navbar";
import "../../../assets/css/guest/Home.css"
import TeaserCandidates from "./TeaserCandidates";
import Banner from "../../../components/banner"
import Footer from "../../../components/footer"

export default function Home() {
  return (
    <div>
      {/* Header */}
      <NavbarGuest/>

      {/* Banner */}
      <Banner/>
      <p id="banner-p">Voting platform for Artist Award 2025! Discover the nominees and vote for your favorite artist.</p>


      {/* Countdown Time*/}
      <div class="container-timer">
        <h1>Remaining Time:</h1>
        <h1>00:00:00</h1>
      </div>

      {/* Categories */}
      <TeaserCandidates/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
