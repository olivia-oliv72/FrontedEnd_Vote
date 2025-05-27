import { loadHistory } from "../../utils/localStorage";
import { For } from "solid-js";
import "../../assets/css/voter/History.css";
import { getUser } from "../../utils/authentication";

export default function History(){
    const user = getUser();
    const history = loadHistory();
    
    const userHistory = history.find(h => h.email === user.email);
    const votes = userHistory ? userHistory.vote : [];
    
    return(
        <>
            <div class="container-main">
                <For each={votes}>
                    {(vote) => (
                        <div class="container-history">
                            <div class="container-photo">
                                <img class="artist-photo" src={`/photo-candidates/${vote.photo}`} alt={vote.name}></img>
                            </div>
                            <div class="container-info">
                                <h1 class="name">{vote.category}</h1>
                                <p class="artist">{vote.name}</p>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </>
    )
}