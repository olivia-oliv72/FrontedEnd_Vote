import NavbarGuest from "../../components/Navbar.jsx";
import "../../assets/css/voter/Profile.css";
import History from "../voter/History.jsx";
import { getUser } from "../../utils/authentication";
import edit from "../../assets/img/edit.png";
import checked from "../../assets/img/checked.png";
import { createSignal } from "solid-js";
import Footer from "../../components/footer.jsx";

function Profile() {
    const user = getUser();
    const [editing, setEditing] = createSignal(false);
    const [newUsername, setNewUsername] = createSignal(user.username);

    function changeUsername() {
        const updatedUser = { ...user, username: newUsername() };
        localStorage.setItem("logged_user", JSON.stringify(updatedUser));
        setEditing(false);
        location.reload();
    }

    return (
        <div class="page-profile-container">
            <NavbarGuest />
            {/* Profile */}
            <div class="container-profile">
                <div class="pfp">
                    <ProfilePicture />
                </div>
                <div class="container-info">
                    {
                        editing() ? (
                            <div class="container-edit-usn">
                                <input type="text" class="input-username" value={newUsername()} onInput={(e) => setNewUsername(e.target.value)}></input>
                                <img src={checked} class="icon-confirm" onClick={changeUsername}></img>
                            </div>
                        ) : (
                            <h2 class="username">{user.username}
                                <img src={edit} alt="Edit Username" class="icon-edit" onClick={() => setEditing(true)}></img>
                            </h2>
                        )
                    }
                    <p class="email">{user.email}</p>
                    <a class="logout" href="/logout">Logout</a>
                </div>
            </div>
            <div class="container-title">
                <h2>Vote History</h2>
            </div>
            <History />

            <Footer/>
        </div>
    )
}

function ProfilePicture() {
    const user = getUser();
    const initial = user.username.charAt(0).toUpperCase();
    return (
        <>
            <div class="initial">
                {initial}
            </div>
        </>
    )
}

export default Profile;