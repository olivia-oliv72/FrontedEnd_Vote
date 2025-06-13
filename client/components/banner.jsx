import bannerImg from "../assets/img/banner.png"
import '../index.css';

export default function banner () {
    return (
        <div class="container-banner flex flex-col bg-[#000] relative w-[100%] [h-365px] overflow-hidden">
            <img class="size-[100%] object-cover" src={bannerImg} alt="" />
        </div>
    )
}