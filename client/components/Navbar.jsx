import { getUser, getUserRole } from "../utils/authentication";
import { Switch, Match } from "solid-js";
import img_user from "../assets/img/logo_user.png"
import { useNavigate } from "@solidjs/router";
import logout from "../assets/img/logout.png";

export default function NavbarGuest() {
  const user = getUser(); //null kalau belum login
  const role = getUserRole();
  const navigate = useNavigate(); 

  function handleHome() {
    navigate('/')
  }
  return (
    <nav class="navigation sticky z-10 top-0">
      <div class="container flex justify-between p-[10px] bg-gradient-to-b from-black to-transparent">
        <h1 class="m-0 text-[30px] text-[#e3c365] font-bold" id="header">Artist Awards 2025</h1>

        <Switch>
          {/*Navbar guest */}
          <Match when={!user}>
            {/* Guest */}
            <a class="no-underline cursor-pointer text-[20px] text-[#fff] hover:text-[#e3c365]" href="/login">Login/Register</a>
          </Match>

          {/*Navbar user */}
          <Match when={user?.role === "user"}>
            {/* User */}
            <div class="container-nav-user flex justify-between items-center w-[400px]">
              <a class="no-underline cursor-pointer text-[20px] text-[#fff] hover:text-[#e3c365]" onClick={handleHome}>Home</a>
              <a class="no-underline cursor-pointer text-[20px] text-[#fff] hover:text-[#e3c365]" href="/History">History</a>
              <div class="user flex items-center justify-between size-fit gap-x-[10px]">
                <span class="text-[20px] text-[#fff]">Welcome, {user.username}!</span>
                <a class="no-underline cursor-pointer text-[20px] text-[#fff]" href="/History"><img src={img_user} alt="image_user" class="size-[25px]" /></a>
              </div>
            </div>
          </Match>

          {/*Navbar admin */}
          <Match when={user?.role === "admin"}>
            {/* Admin */}
            <div class="user flex items-center justify-between size-fit gap-x-[10px]">

              <span class="text-[20px] text-[#fff]">Welcome, {user.username}!</span>
              <a class="logout-admin h-[20px] underline cursor-pointer ml-[1vh]" href="/logout"><img src={logout} class="h-[20px] w-[25px]"></img></a>
            </div>
          </Match>
        </Switch>
      </div>
    </nav>
  );
}