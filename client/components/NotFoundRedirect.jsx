import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";
import { decode } from "../utils/decode";

export default function NotFoundRedirect() {
    const navigate = useNavigate();

    createEffect(() => {
        const token = localStorage.getItem("auth_token");

        if(token) {
            const user = decode(token)

            if(user && user.role === "admin"){
                navigate("/admin", { replace: true });
            } else if(user && user.role === "user") {
                navigate("/", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        } else {
            navigate("/", { replace: true });
        }
    });

    return (
    <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2em' }}>
      Redirecting...
    </div>
  );
}