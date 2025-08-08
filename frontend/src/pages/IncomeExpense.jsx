import { useState } from "react";
import TrsForm from "../components/TrsForm";
import TrsList from "../components/TrsList";
import MonthSelector from "../components/MonthSelector";

const IncomeExpense = () => {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    });
    const [selectedTx, setSelectedTx] = useState(null);

    return (
        <div>
            <div className="px-6 py-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <TrsForm selectedTransaction={selectedTx} setSelectedTx={setSelectedTx} />
                    <div className="lg:w-1/2 space-y-6">
                        <div className="">
                            <MonthSelector selectedMonth={selectedMonth}
                                setSelectedMonth={setSelectedMonth} />
                        </div>
                        <TrsList setSelectedTx={setSelectedTx} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomeExpense;
