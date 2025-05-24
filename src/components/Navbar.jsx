import "../assets/css/navbar.css";
import { getUser, getUserRole } from "../utils/authentication";
import { Switch, Match } from "solid-js";
import img_user from "../assets/img/logo_user.png"

export default function NavbarGuest() {
  const user = getUser(); // null kalau belum login
  const role = getUserRole();     // "admin", "user", atau null (guest)
  
  return (

    <nav class="navigation">
      <div class="container">
        <h1 id="header">Artist Awards 2025</h1>

        <Switch>
          <Match when={!user}>
            {/* Guest */}
            <a href="/Login">Login/Register</a>
          </Match>

          <Match when={user?.role === "user"}>
            {/* User */}
            <div class="container-nav-user">
              <a href="">Home</a>
              <a href="">History</a>
              <div class="user">
                <span>Welcome, {user.username}!</span>
                <img src={img_user} alt="image_user" />
              </div>
            </div>
          </Match>

          <Match when={user?.role === "admin"}>
            {/* Admin */}
            
          </Match>
        </Switch>

      </div>
    </nav>

  );
}