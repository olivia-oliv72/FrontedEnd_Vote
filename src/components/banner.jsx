import bannerImg from "../assets/img/banner.png"
import "../assets/css/guest/Home.css"

export default function banner () {
    return (
        <div class="container-banner">
            <img src={bannerImg} alt="" />
        </div>
    )
}