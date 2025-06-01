import { createEffect, createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { getUserRole, logoutUser } from "../utils/authentication";

export default function ProtectedRoute(props) {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = createSignal(false);

    createEffect(() => {
        const userRole = getUserRole()
        const allowedRoles = props.allowedRoles;
        
        if (userRole && props.allowedRoles.includes(userRole)) {
            setIsAuthorized(true);
        } else {
            logoutUser();
            setIsAuthorized(false);
            navigate('/login', { replace: true });
        }
    });

    return (
    <Show when={isAuthorized()}>
      {props.children}
    </Show>
  );
}