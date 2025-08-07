import { useState } from "react";

const IncomeExpense = () => {
    const [activeTab, setActiveTab] = useState("income");

    return (
        <div>
            <div className="px-6 py-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Left Form */}
                    <div className="bg-white w-full lg:w-2/5 p-6 rounded-xl shadow">
                        <h2 className="text-xl font-semibold mb-6">Add Transaction</h2>
                        <div className="flex mb-6">
                            <button
                                className={`flex-1 py-2 rounded-l-lg border ${activeTab === "income" ? "bg-green-400 text-white" : "bg-gray-100"}`}
                                onClick={() => setActiveTab("income")}
                            >
                                Income
                            </button>
                            <button
                                className={`flex-1 py-2 rounded-r-lg border ${activeTab === "expense" ? "bg-red-400 text-white" : "bg-gray-100"}`}
                                onClick={() => setActiveTab("expense")}
                            >
                                Expense
                            </button>
                        </div>

                        <input
                            type="date"
                            placeholder="Date"
                            className="w-full mb-4 px-4 py-2 border rounded-lg"
                        />
                        <input
                            type="select"
                            placeholder="Category"
                            className="w-full mb-4 px-4 py-2 border rounded-lg"
                        />
                        <textarea
                            placeholder="Note"
                            className="w-full mb-4 px-4 py-2 border rounded-lg resize-none"
                            rows="2"
                        />
                        <input
                            type="text"
                            placeholder="Amount"
                            className="w-full mb-6 px-4 py-2 border rounded-lg"
                        />
                        <button className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-2 rounded-lg w-full font-semibold">
                            ADD
                        </button>
                    </div>

                    {/* TODO list view and month selector */}
                    <div className="lg:w-3/5 space-y-6">
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomeExpense;
