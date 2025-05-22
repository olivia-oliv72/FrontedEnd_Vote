import { For } from "solid-js";
import NavbarGuest from "../../components/navbarGuest";

export default function Home() {
  return (
    <div class="font-sans text-center">
      {/* Header */}
      <NavbarGuest/>

      {/* Banner */}
      <div class="bg-black text-white py-8">
        <h2 class="text-xl mb-2">Voting platform for Artist Award 2025!</h2>
        <p>Discover the nominees and vote for your favorite artist.</p>
      </div>

      {/* Countdown Time*/}
      <div class="my-6">
        <h2 class="text-lg font-bold">Remaining Time:</h2>
        <p class="text-2xl font-mono">00:00:00</p>
      </div>

      {/* Categories */}


      {/* Footer */}
      <div class="mt-10 bg-gray-200 text-sm py-2">
        Thank you for supporting your favorite artists. © 2025 Artist Award.
      </div>
    </div>
  );
}
