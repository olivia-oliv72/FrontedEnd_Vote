import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

export default function Logout(){
    const navigate = useNavigate();
    
    onMount(() => {
        localStorage.removeItem("logged_user");
        localStorage.removeItem("auth_token");
        navigate("/", {replace: true});
    });
}