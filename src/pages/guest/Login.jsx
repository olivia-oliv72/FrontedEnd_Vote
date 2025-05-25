import { createSignal, Match, Switch } from "solid-js";
import { useNavigate } from "@solidjs/router";
import roleUsers from "../../assets/data/role_user";
import { saveUser } from "../../utils/authentication";
import "../../assets/css/guest/Login.css";
import logo from "../../assets/img/AALogo.png";

function Login() {
  const [isLogin, setIsLogin] = createSignal(true);
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const navigate = useNavigate();

  function handleLogin() {
    const user = roleUsers.find(
      (u) => u.username === username() && u.password === password()
    );

    if (user) {
      saveUser(user); // simpan ke localStorage
      navigate("/");  // redirect ke homepage
    } else {
      alert("Username atau password salah");
    }
  }

  return (
    <div class="page">
      <img src={logo} alt="Artist-Awards-Logo" class="logo" />

      <div class="box">
        <div class="toggle">
          <label class="option">
            <input
              type="radio"
              name="loginRegister"
              checked={isLogin()}
              onChange={() => setIsLogin(true)}
            />
            Login
          </label>
          <label class="option">
            <input
              type="radio"
              name="loginRegister"
              checked={!isLogin()}
              onChange={() => setIsLogin(false)}
            />
            Register
          </label>
        </div>

        <Switch fallback={<p>Page Error : No Condition</p>}>
          <Match when={isLogin()}>
            <div class="form">
              <div class="form-group">
                <p>Username</p>
                <input
                  type="text"
                  placeholder="Username"
                  value={username()}
                  onInput={(e) => setUsername(e.target.value)}
                />
              </div>
              <div class="form-group">
                <p>Password</p>
                <input
                  type="password"
                  placeholder="password"
                  value={password()}
                  onInput={(e) => setPassword(e.target.value)}
                />
              </div>
              <button class="submit-button" onClick={handleLogin}>
                Login
              </button>
            </div>
          </Match>
          <Match when={!isLogin()}>
            <div class="form">
              <div class="form-group">
                <p>Username</p>
                <input type="text" placeholder="Username" />
              </div>
              <div class="form-group">
                <p>Email Address</p>
                <input type="text" placeholder="email address" />
              </div>
              <div class="form-group">
                <p>Password</p>
                <input type="password" placeholder="password" />
              </div>
              <button class="submit-button">Register</button>
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  );
}

export default Login;