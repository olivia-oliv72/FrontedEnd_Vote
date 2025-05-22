import { createSignal, Match, Switch } from "solid-js"

function Login() {
    const [isLogin, setIsLogin ] = createSignal(true);

    return (
        <div>
            <label>
                <input
                    type="radio"
                    name="loginRegister"
                    checked={isLogin()}
                    onChange={() => setIsLogin(true)}
                />
                Login
            </label>
            <label>
                <input
                    type="radio"
                    name="loginRegister"
                    checked={!isLogin()}
                    onChange={() => setIsLogin(false)}
                />
                Register
            </label>

            <Switch fallback={<p>Page Error : No Condition</p>}>
                <Match when={isLogin()}>
                    <div>
                        <h2>Login Form</h2>
                        <input type="text" placeholder="email address" />
                        <br />
                        <input type="password" placeholder="password" />
                        <br />
                        <button>Login</button>
                    </div>
                </Match>
                <Match when={!isLogin()}>
                    <div>
                        <h2>Register Form</h2>
                        <input type="text" placeholder="username" />
                        <br />
                        <input type="text" placeholder="email address" />
                        <br />
                        <input type="password" placeholder="password" />
                        <br />
                        <button>Login</button>
                    </div>
                </Match>
            </Switch>
        </div>
    )
}

export default Login;