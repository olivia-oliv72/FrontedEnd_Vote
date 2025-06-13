import NavbarGuest from "../../../components/Navbar";
import TeaserCandidates from "./TeaserCandidates";
import Banner from "../../../components/banner"
import Footer from "../../../components/footer"
import '../../../index.css';

export default function Home() {
  return (
    <div>
      {/* Header */}
      <NavbarGuest/>

      {/* Banner */}
      <Banner/>
      <p class="bg-[#000] p-[5px] pl-[15px] m-0 text-[20px] text-[#e3c365] text-center" id="banner-p">
        Voting platform for Artist Award 2025! Discover the nominees and vote for your favorite artist.
      </p>

      {/* Countdown Time*/}
      <div class="container-timer flex flex-col p-[15px] items-center justify-center">
        <h2 class="m-0 text-[#fff] text-[20px]">Remaining Time:</h2>
        <h1 class="font-bold text-[#fff] text-[50px]">00:00:00</h1>
      </div>

      {/* Categories */}
      <TeaserCandidates/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
