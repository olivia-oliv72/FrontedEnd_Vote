import { createSignal, onMount, For, Show } from 'solid-js';
import { getUser } from "../../utils/authentication";


export default function History() {
  const [userVotes, setUserVotes] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [currentUser, setCurrentUser] = createSignal(null);

  onMount(async () => {
    const user = getUser();

    setCurrentUser(user);
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8080/api/history/${user.email}`, {
        headers: {
          Authorization: token,
        }
      });

      if (!response.ok) {
        setUserVotes([]);
      } else {
        const dataFromServer = await response.json();
        setUserVotes(dataFromServer.history.vote);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch history.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <div class="container-main-history p-[25px]">

        <Show when={isLoading()}>
          <p>Loading history...</p>
        </Show>

        <Show when={error()}>
          <p style={{ color: "red" }}>Error: {error()}</p>
        </Show>

        <Show when={!isLoading() && !error() && userVotes().length > 0}>
          <For each={userVotes()}>
            {(vote) => (
              <div class="container-history flex p-[10px] pl-[90px] gap-x-[30px] w-fit items-center">
                <div class="container-photo relative inline-block">
                  <img class="artist-photo flex size-[200px] rounded-[5px] area-pfp items-center" src={`/server/photo-candidates/${vote.photo}`} alt={vote.name} />
                  <div class="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-black to-transparent"></div>
                </div>
                <div class="container-info area-info justify-center">
                  <h1 class="name-category flex m-[10px] text-xl text-[#fff]">{vote.category}</h1>
                  <p class="artist flex m-[10px] text-[30px] text-[#e3c365] font-bold hover:scale-[1.2] transition duration-1000">{vote.name}</p>
                </div>
              </div>
            )}
          </For>
        </Show>

        <Show when={!isLoading() && !error() && userVotes().length === 0 && currentUser()}>
          <p>Belum ada history voting.</p>
        </Show>

      </div>
    </>
  );
}