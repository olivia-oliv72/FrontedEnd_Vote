import { createEffect, createSignal } from "solid-js";
import { decode } from "../utils/decode";
import { useNavigate } from "@solidjs/router";

export default function ProtectedRoute(props) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = createSignal(false);

  createEffect(() => {
    const token = localStorage.getItem("auth_token");
    const allowedRoles = props.allowedRoles || [];
    const disallowedRoles = props.disallowedRoles || [];
    
    if (!token) {
      if(allowedRoles.length === 0){
        setIsAuthorized(true)
      } else {
        navigate("/login", { replace: true });
      }
      return;
    }

    const user = decode(token);

    if (user) {
      if(disallowedRoles.includes(user.role)) {
        if(user.role === "admin") {
          navigate("/admin", {replace: true })
        } else {
          localStorage.removeItem("auth_token");
          navigate("/login", { replace: true });
        }
        return;
      }

      if(allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
        setIsAuthorized(true);
      } else {
        localStorage.removeItem("auth_token");
        navigate("/login", { replace: true });
      }
    } else {
      localStorage.removeItem("auth_token");
      navigate("/login", { replace: true });
    }
  });

  return <Show when={isAuthorized()}>{props.children}</Show>;
}