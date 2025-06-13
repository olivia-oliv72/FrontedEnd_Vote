import NavbarGuest from "../../../components/Navbar";
import TeaserCandidates from "./TeaserCandidates";
import Banner from "../../../components/banner"
import Footer from "../../../components/footer"
import CountdownTimer from "../../../components/timer";

export default function Home() {
  const voting_end_time = "2025-06-13T23:59:59"
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
      <CountdownTimer deadline={voting_end_time}/>

      {/* Categories */}
      <TeaserCandidates/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
