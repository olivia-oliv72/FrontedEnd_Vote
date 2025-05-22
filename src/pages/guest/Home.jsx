import { For } from "solid-js";
import NavbarGuest from "../../components/navbarGuest";
import "../../assets/guest/Home.css"
import bannerImg from "../../assets/banner/banner.png"

export default function Home() {
  return (
    <div class="font-sans text-center">
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


      {/* Footer */}
      <div class="footer">
        Thank you for supporting your favorite artists. © 2025 Artist Award.
      </div>
    </div>
  );
}
