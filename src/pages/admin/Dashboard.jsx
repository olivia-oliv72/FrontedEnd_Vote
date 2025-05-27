import Navbar from "../../components/Navbar";
import "../../assets/css/admin/dashboard.css";

import AwardsTable from "./AwardsTable"

export default function Home() {
    return (
        <div >
            {/* Header */}
            <Navbar />
            <div className="page-container">
                {/* Title */}
                <h1 class="title">
                    Dashboard
                </h1>
                <div class="button-table">
                    <button class="add-category-button">Add New Category</button>
                    <AwardsTable />
                </div>
            </div>


        </div>


    );
}
