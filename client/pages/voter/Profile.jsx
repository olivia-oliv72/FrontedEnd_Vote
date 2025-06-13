import NavbarGuest from "../../components/Navbar.jsx";
import Footer from "../../components/footer.jsx";
import History from "../voter/History.jsx";
import edit from "../../assets/img/edit.png";
import checked from "../../assets/img/checked.png";
import { getUser } from "../../utils/authentication";
import { createSignal } from "solid-js";

function Profile() {
    const user = getUser();
    const [editing, setEditing] = createSignal(false);
    const [newUsername, setNewUsername] = createSignal(user.username);

    async function changeUsername() {
        const updatedUser = { ...user, username: newUsername() };

        const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: newUsername() }),
        });

        if (response.ok) {
            localStorage.setItem("logged_user", JSON.stringify(updatedUser));
            setEditing(false);
            location.reload();
        } else {
            alert("Gagal memperbarui username di server");
        }
    }

    return (
        <>
            <div className="page-profile-container flex flex-col min-h-[100vh]">
                <NavbarGuest />
                <div className="container-profile flex p-[20px] gap-x-[30px] items-center justify-center">
                    <div className="pfp area-pfp size-[90px] rounded-full bg-[#333] flex items-center justify-center">
                        <ProfilePicture />
                    </div>
                    <div className="container-info area-info justify-center">
                        {
                            editing() ? (
                                <div className="container-edit-usn flex">
                                    <input type="text" className="input-username outline-none border-[0 0 2px]" value={newUsername()} onInput={(e) => setNewUsername(e.target.value)}></input>
                                    <img src={checked} className="icon-confirm max-w-[25px] max-h-[25px]" onClick={changeUsername}></img>
                                </div>
                            ) : (
                                <h1 className="username flex m-[10px] mb-0 gap-x-[20px] font-bold text-[23px] text-[#fff]">{user.username}
                                    <img src={edit} alt="Edit Username" className="icon-edit max-w-[25px] max-h-[25px]" onClick={() => setEditing(true)}></img>
                                </h1>
                            )
                        }
                        <p className="email flex m-[10px] mt-0 text-[#fff]">{user.email}</p>
                        <a className="logout flex font-bold no-underline w-[100px] h-[25px] m-[10px] rounded-[5px] cursor-pointer bg-[#e3c365] items-center justify-center" href="/logout">Logout</a>
                    </div>
                </div>
                <div className="container-title">
                    <h1 className="pl-[110px] font-bold text-[30px] text-[#fff]">Vote History</h1>
                </div>
                <History />

                <Footer />
            </div>
        </>

    )
}

function ProfilePicture() {
    const user = getUser();
    const initial = user.username.charAt(0).toUpperCase();
    return (
        <>
            <div className="initial text-white text-[45px] font-bold">
                {initial}
            </div>
        </>
    )
}

export default Profile;