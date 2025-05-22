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
                        <div>
                            <p>Email Address</p>
                            <input type="text" placeholder="email address" />
                        </div>
                        <div>
                            <p>Password</p>
                            <input type="password" placeholder="password" />
                        </div>
                        <button>Login</button>
                    </div>
                </Match>
                <Match when={!isLogin()}>
                    <div>
                        <h2>Register Form</h2>
                        <div>
                            <p>Username</p>
                            <input type="text" placeholder="Username" />
                        </div>
                        <div>
                            <p>Email Address</p>
                            <input type="text" placeholder="email address" />
                        </div>
                        <div>
                            <p>Password</p>
                            <input type="password" placeholder="password" />
                        </div>
                        <button>Login</button>
                    </div>
                </Match>
            </Switch>
        </div>
    )
}

export default Login;