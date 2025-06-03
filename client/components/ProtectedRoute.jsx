import { createEffect, createSignal } from "solid-js";
import { decode } from "../utils/decode";
import { useNavigate } from "@solidjs/router";

export default function ProtectedRoute(props) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = createSignal(false);

  createEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const user = decode(token);
    const allowedRoles = props.allowedRoles || [];

    if (user && allowedRoles.includes(user.role)) {
      setIsAuthorized(true);
    } else {
      localStorage.removeItem("auth_token");
      navigate("/login", { replace: true });
    }
  });

  return <Show when={isAuthorized()}>{props.children}</Show>;
}