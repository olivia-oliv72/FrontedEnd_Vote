import Navbar from "../../components/Navbar";
import "../../assets/css/admin/dashboard.css";

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
            <div className="page-container">
                {/* Title */}
                <h1 class="title-dashboard">
                    Dashboard
                </h1>
                <div class="button-table">
                    <button class="add-category-button" onClick={handleAddNewCategory}>Add New Category</button>
                    <AwardsTable />
                </div>
            </div>


        </div>


    );
}
