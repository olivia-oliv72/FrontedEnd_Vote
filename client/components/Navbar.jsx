import "../assets/css/navbar.css";
import { getUser, getUserRole } from "../utils/authentication";
import { Switch, Match } from "solid-js";
import img_user from "../assets/img/logo_user.png"
import { useNavigate } from "@solidjs/router";
import logout from "../assets/img/logout.png";

export default function NavbarGuest() {
  const user = getUser(); // null kalau belum login
  const role = getUserRole();
  const navigate = useNavigate();   // "admin", "user", atau null (guest)

  function handleHome() {
    navigate('/')
  }
  return (

    <nav class="navigation">
      <div class="container">
        <h1 id="header">Artist Awards 2025</h1>

        <Switch>
          <Match when={!user}>
            {/* Guest */}
            <a href="/login">Login/Register</a>
          </Match>

          <Match when={user?.role === "user"}>
            {/* User */}
            <div class="container-nav-user">
              <a onClick={handleHome}>Home</a>
              <a href="/History">History</a>
              <div class="user">
                <span>Welcome, {user.username}!</span>
                <a href="/History"><img src={img_user} alt="image_user" /></a>
              </div>
            </div>
          </Match>

          <Match when={user?.role === "admin"}>
            {/* Admin */}
            <div class="user">

              <span>Welcome, {user.username}!</span>
              <a class="logout-admin" href="/logout"><img src={logout}></img></a>

            </div>
          </Match>
        </Switch>

      </div>
    </nav>

  );
}