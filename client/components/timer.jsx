import { createSignal, onMount, onCleanup } from 'solid-js';

//format angka tambah 0 , kalau < 10
function formatNumber(num) {
  return num.toString().padStart(2, '0');
}

export default function CountdownTimer(props) {
  const [timeLeft, setTimeLeft] = createSignal("00:00:00");
  
  let timerInterval;

  const updateCountdown = () => {
    const deadlineTime = new Date(props.deadline).getTime();
    const now = new Date().getTime();
    const difference = deadlineTime - now;

    //waktu habis --->  00:00:00
    if (difference <= 0) {
      setTimeLeft("00:00:00");
      clearInterval(timerInterval);
      return;
    }

    //sisa waktu
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    const totalHours = days * 24 + hours;
    
    //buat string waktu
    const formattedTime = `${formatNumber(totalHours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    setTimeLeft(formattedTime);
  };

  onMount(() => {
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000); //ulangi setiap detik
  });

  return (
    <div class="container-timer">
      <h1>Remaining Time</h1>
      <h1>{timeLeft()}</h1>
    </div>
  );
}