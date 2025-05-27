import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

export default function Logout(){
    const navigate = useNavigate();
    
    onMount(() => {
        localStorage.removeItem("logged_user");
        navigate("/", {replace: true});
    });
}