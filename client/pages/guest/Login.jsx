import { createSignal, Match, Switch } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { saveUser } from "../../utils/authentication";
import logo from "../../assets/img/AALogo.png";
import { decode } from "../../utils/decode";

function Login() {
  const [isLogin, setIsLogin] = createSignal(true);

  const [loginUsername, setLoginUsername] = createSignal("");
  const [loginPassword, setLoginPassword] = createSignal("");
  const [loginMessage, setLoginMessage] = createSignal("");
  const [isLoadingLogin, setIsLoadingLogin] = createSignal(false);

  const [registerUsername, setRegisterUsername] = createSignal("");
  const [registerEmail, setRegisterEmail] = createSignal("");
  const [registerPassword, setRegisterPassword] = createSignal("");
  const [registerMessage, setRegisterMessage] = createSignal("");
  const [isLoadingRegister, setIsLoadingRegister] = createSignal(false);

  const navigate = useNavigate();

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setIsLoadingLogin(true);
    setLoginMessage("");

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginUsername(),
          password: loginPassword(),
        }),
      });

      const dataFromServer = await response.json();

      if (response.ok && dataFromServer.success) {
        setLoginMessage("Login success!");
        localStorage.setItem('auth_token', dataFromServer.token);
        const user = decode(dataFromServer.token);

        if (!user) {
          console.error("Failed to decode token.");
          setLoginMessage("Token is invalid.");
          return;
        }

        saveUser(user)

        // Navigasi berdasarkan peran dari server
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "user") {
          navigate("/");
        } else {

          navigate("/");
        }
      } else {
        setLoginMessage(dataFromServer.message || "Wrong username or password!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginMessage("Can't connect to the server. Try again later.");
    } finally {
      setIsLoadingLogin(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setIsLoadingRegister(true);
    setRegisterMessage("");

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerUsername(),
          email: registerEmail(),
          password: registerPassword(),
          role: 'user'
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setRegisterMessage("Registration succeed! Please login.");
        setIsLogin(true);
      } else {
        setRegisterMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      setRegisterMessage("Can't connect to the server for registration.");
    } finally {
      setIsLoadingRegister(false);
    }

  }

  return (
    <div class="page flex flex-col items-center justify-center h-[100vh] gap-[24px]">
      <img src={logo} alt="Artist-Awards-Logo" class="logo max-w-[200px] h-auto" />
      <div class="box w-[400px] bg-white rounded-[5px] shadow-xl overflow-hidden p-[12px]">
        <div class="toggle flex bg-[#e3c36550] rounded-[5px] m-[12px]">
          <label
            class={`option flex-1 p-[12px] cursor-pointer font-bold text-center ${
            isLogin()
              ? 'bg-[#e3c365] text-black rounded-l-[5px]'
              : 'text-black'
            }`}>
            <input
              type="radio"
              name="loginRegister"
              checked={isLogin()}
              onChange={() => setIsLogin(true)}
              class="hidden"
            />
            Login
          </label>

          <label
            class={`option flex-1 p-[12px] cursor-pointer font-bold text-center ${
              !isLogin()
                ? 'bg-[#e3c365] text-black rounded-r-[5px]'
                : 'text-black'
            }`}
          >
            <input
              type="radio"
              name="loginRegister"
              checked={!isLogin()}
              onChange={() => setIsLogin(false)}
              class="hidden"
            />
            Register
          </label>
        </div>

        <Switch fallback={<p>Page Error : No Condition</p>}>
          <Match when={isLogin()}>
            <form class="form p-[24px]" onSubmit={handleLoginSubmit}>
              <div class="form-group mb-[16px]">
                <p class="mt-0 mr-0 mb-[4px] font-bold">Username</p>
                <input
                  class="w-[100%] p-[12px] bg-[#bfbfbf30] rounded-[5px] box-border"
                  type="text" placeholder="Username"
                  value={loginUsername()}
                  onInput={(e) => setLoginUsername(e.currentTarget.value)}
                  required
                />
              </div>
              <div class="form-group mb-[16px]">
                <p class="mt-0 mr-0 mb-[4px] font-bold">Password</p>
                <input
                  class="w-[100%] p-[12px] bg-[#bfbfbf30] rounded-[5px] box-border"
                  type="password" placeholder="Password"
                  value={loginPassword()}
                  onInput={(e) => setLoginPassword(e.currentTarget.value)}
                  required
                />
              </div>
              {loginMessage() && <p class="message">{loginMessage()}</p>}
              <button
                type="submit"
                class="submit-button w-[100%] p-[12px] bg-[#e3c365] shadow-sm border-none rounded-[5px] text-[16px] font-bold cursor-pointer"
                disabled={isLoadingLogin()}>
                {isLoadingLogin() ? 'Processing...' : 'Login'}
              </button>
            </form>
          </Match>
          <Match when={!isLogin()}>
            <form class="form p-[24px]" onSubmit={handleRegisterSubmit}>
              <div class="form-group mb-[16px]">
                <p class="mt-0 mr-0 mb-[4px] font-bold">Username</p>
                <input
                  class="w-[100%] p-[12px] bg-[#bfbfbf30] rounded-[5px] box-border"
                  type="text" placeholder="Username"
                  value={registerUsername()}
                  onInput={(e) => setRegisterUsername(e.currentTarget.value)}
                  required
                />
              </div>
              <div class="form-group mb-[16px]">
                <p class="mt-0 mr-0 mb-[4px] font-bold">Email Address</p>
                <input
                  class="w-[100%] p-[12px] bg-[#bfbfbf30] rounded-[5px] box-border"
                  type="email" placeholder="Email Address"
                  value={registerEmail()}
                  onInput={(e) => setRegisterEmail(e.currentTarget.value)}
                  required
                />
              </div>
              <div class="form-group mb-[16px]">
                <p class="mt-0 mr-0 mb-[4px] font-bold">Password</p>
                <input
                  class="w-[100%] p-[12px] bg-[#bfbfbf30] rounded-[5px] box-border"
                  type="password" placeholder="Password"
                  value={registerPassword()}
                  onInput={(e) => setRegisterPassword(e.currentTarget.value)}
                  required
                />
              </div>
              {registerMessage() && <p class="message">{registerMessage()}</p>}
              <button type="submit" class="submit-button w-[100%] p-[12px] bg-[#e3c365] shadow-sm border-none rounded-[5px] text-[16px] font-bold cursor-pointer" disabled={isLoadingRegister()}>
                {isLoadingRegister() ? 'Processing...' : 'Register'}
              </button>
            </form>
          </Match>
        </Switch>
      </div>
    </div>
  );
}

export default Login;