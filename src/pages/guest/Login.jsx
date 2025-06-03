import { createSignal, Match, Switch } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { saveUser } from "../../utils/authentication";
import "../../assets/css/guest/Login.css";
import logo from "../../assets/img/AALogo.png";

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
        setLoginMessage("Login berhasil!");
        saveUser(dataFromServer.user);
        
        // Navigasi berdasarkan peran dari server
        if (dataFromServer.user.role === "admin") {
          navigate("/admin");
        } else if (dataFromServer.user.role === "user") {
          navigate("/");
        } else {
          // Fallback jika peran tidak dikenali, atau bisa juga navigasi ke halaman umum
          navigate("/"); 
        }
      } else {
        setLoginMessage(dataFromServer.message || "Username atau password salah");
      }
    } catch (error) {
      console.error("Error saat login:", error);
      setLoginMessage("Tidak dapat terhubung ke server. Coba lagi nanti.");
    } finally {
      setIsLoadingLogin(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setIsLoadingRegister(true);
    setRegisterMessage("");

    // TODO: Implementasi logika untuk mengirim data registrasi ke API server
    // Misalnya ke POST /api/auth/register
    // Body akan berisi: username, email, password
    console.log("Data registrasi:", {
      username: registerUsername(),
      email: registerEmail(),
      password: registerPassword(),
    });
    setRegisterMessage("Fitur registrasi belum diimplementasikan sepenuhnya di client.");
    // Contoh fetch (sesuaikan dengan endpoint registrasi Anda di server):
    /*
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerUsername(),
          email: registerEmail(),
          password: registerPassword(),
          // role: 'user' // Anda bisa set default role di server atau kirim dari client
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setRegisterMessage("Registrasi berhasil! Silakan login.");
        setIsLogin(true); // Arahkan ke form login setelah registrasi berhasil
      } else {
        setRegisterMessage(data.message || "Registrasi gagal.");
      }
    } catch (error) {
      setRegisterMessage("Gagal terhubung ke server untuk registrasi.");
    } finally {
      setIsLoadingRegister(false);
    }
    */
   setIsLoadingRegister(false); // Hapus ini jika sudah implementasi fetch di atas
  }


  return (
    <div class="page">
      <img src={logo} alt="Artist-Awards-Logo" class="logo" />
      <div class="box">
        <div class="toggle">
          <label class="option">
            <input
              type="radio" name="loginRegister"
              checked={isLogin()} onChange={() => setIsLogin(true)}
            /> Login
          </label>
          <label class="option">
            <input
              type="radio" name="loginRegister"
              checked={!isLogin()} onChange={() => setIsLogin(false)}
            /> Register
          </label>
        </div>

        <Switch fallback={<p>Page Error : No Condition</p>}>
          <Match when={isLogin()}>
            <form class="form" onSubmit={handleLoginSubmit}> {/* Ganti ke form dan onSubmit */}
              <div class="form-group">
                <p>Username</p>
                <input
                  type="text" placeholder="Username"
                  value={loginUsername()}
                  onInput={(e) => setLoginUsername(e.currentTarget.value)}
                  required
                />
              </div>
              <div class="form-group">
                <p>Password</p>
                <input
                  type="password" placeholder="password"
                  value={loginPassword()}
                  onInput={(e) => setLoginPassword(e.currentTarget.value)}
                  required
                />
              </div>
              {loginMessage() && <p class="message">{loginMessage()}</p>}
              <button type="submit" class="submit-button" disabled={isLoadingLogin()}>
                {isLoadingLogin() ? 'Memproses...' : 'Login'}
              </button>
            </form>
          </Match>
          <Match when={!isLogin()}>
            <form class="form" onSubmit={handleRegisterSubmit}> {/* Ganti ke form dan onSubmit */}
              <div class="form-group">
                <p>Username</p>
                <input
                  type="text" placeholder="Username"
                  value={registerUsername()}
                  onInput={(e) => setRegisterUsername(e.currentTarget.value)}
                  required
                />
              </div>
              <div class="form-group">
                <p>Email Address</p>
                <input
                  type="email" placeholder="email address" // Ubah ke type="email"
                  value={registerEmail()}
                  onInput={(e) => setRegisterEmail(e.currentTarget.value)}
                  required
                />
              </div>
              <div class="form-group">
                <p>Password</p>
                <input
                  type="password" placeholder="password"
                  value={registerPassword()}
                  onInput={(e) => setRegisterPassword(e.currentTarget.value)}
                  required
                />
              </div>
              {registerMessage() && <p class="message">{registerMessage()}</p>}
              <button type="submit" class="submit-button" disabled={isLoadingRegister()}>
                {isLoadingRegister() ? 'Memproses...' : 'Register'}
              </button>
            </form>
          </Match>
        </Switch>
      </div>
    </div>
  );
}

export default Login;