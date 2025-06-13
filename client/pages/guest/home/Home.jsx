import NavbarGuest from "../../../components/Navbar";
import "../../../assets/css/guest/Home.css"
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
      <p id="banner-p">Voting platform for Artist Award 2025! Discover the nominees and vote for your favorite artist.</p>

      {/* Countdown Time*/}
      <CountdownTimer deadline={voting_end_time}/>

      {/* Categories */}
      <TeaserCandidates/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
