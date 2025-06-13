import Navbar from "../../components/Navbar";

import AwardsTable from "./AwardsTable"
import { useNavigate } from "@solidjs/router";


export default function Home() {
    const navigate = useNavigate();

    const handleAddNewCategory = () => {
        navigate(`/add-category/newcategory`);
    };
    return (
        <div >
            {/* Header */}
            <Navbar />
            <div className="page-container m-[2vh]">
                {/* Title */}
                <h1 class="title-dashboard pl-[3%]">
                    Dashboard
                </h1>
                <div class="button-table flex flex-col w-[100%] items-center justify-center">
                    <button
                        class="add-category-button w-fit h-auto[40px] p-[10px] bg-[#e3c365] rounded-[5px] text-[18px] font-bold items-center justify-center"
                        onClick={handleAddNewCategory}>
                        Add New Category
                    </button>
                    <AwardsTable />
                </div>
            </div>


        </div>


    );
}
