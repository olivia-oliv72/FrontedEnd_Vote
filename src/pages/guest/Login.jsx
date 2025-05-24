import { createSignal, Match, Switch } from "solid-js"
import "../../assets/css/guest/Login.css"
import logo from "../../assets/img/AALogo.png"

function Login() {
    const [isLogin, setIsLogin ] = createSignal(true);

    return (
        <div class="page">
            <img src={logo} alt="Artist-Awards-Logo" class="logo"/>

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
                                <p>Email Address</p>
                                <input type="text" placeholder="email address" />
                            </div>
                            <div class="form-group">
                                <p>Password</p>
                                <input type="password" placeholder="password" />
                            </div>
                            <button class="submit-button">Login</button>
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
                            <button class="submit-button">Login</button>
                        </div>
                    </Match>
                </Switch>          
            </div>
        </div>
    )
}

export default Login;