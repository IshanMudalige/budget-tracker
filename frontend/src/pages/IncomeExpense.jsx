import { useState } from "react";
import TrsForm from "../components/TrsForm";

const IncomeExpense = () => {
    const [activeTab, setActiveTab] = useState("income");

    return (
        <div>
            <div className="px-6 py-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Left Form */}
                    <TrsForm/>

                    {/* TODO list view and month selector */}
                    <div className="lg:w-3/5 space-y-6">
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomeExpense;
