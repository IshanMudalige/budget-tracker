
import PieChartComponent from '../components/PieChartComponent';
import { useState, useCallback } from "react";
import TrsList from "../components/TrsList";
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useEffect } from 'react';
import MonthSelector from "../components/MonthSelector";

const Reports = () => {
    const [activeTab, setActiveTab] = useState("expense");
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return {
            value: today.getMonth() + 1,
            label: "",
        };
    });
    const [transactions, setTransactions] = useState([]);
    const { user } = useAuth();

    const fetchTransactions = useCallback( async () => {
        const month = selectedMonth.value;
        const year = 2025 //selectedMonth.getFullYear();

        try {
            const res = await axiosInstance.get(`/api/transactions`, {
                headers: { Authorization: `Bearer ${user.token}` },
                params: { month, year }
            });
            setTransactions(res.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }, [selectedMonth.value, user.token]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);


    const chartData = Object.values(
        transactions
        .filter(trx => trx.type === activeTab)
        .reduce((acc, trx) => {
            const catId = trx.category?._id || "uncategorized";
            if (!acc[catId]) {
                acc[catId] = {
                    name: trx.category?.name || "Uncategorized",
                    value: 0,
                    color: trx.category?.color || "#9CA3AF"
                };
            }
            acc[catId].value += trx.amount;
            return acc;
        }, {})
    );

    return (
        <div>
            <div className="px-6 py-6">
                <h1 className="text-2xl font-semibold mb-4 text-gray-500">Reports</h1>
                <div className='flex flex-col lg:flex-row justify-between gap-6 mb-8' >
                    <div className=' w-full lg:w-1/3'>
                    </div>
                    <div className=' w-full lg:w-2/3'>
                        <MonthSelector selectedMonth={selectedMonth}
                            setSelectedMonth={setSelectedMonth} />
                    </div>
                    <div className=' w-full lg:w-1/3'>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="bg-white w-full lg:w-1/2 p-6 rounded-xl shadow self-start">
                        <div className="flex mb-6">
                             <button
                                type="button"
                                className={`flex-1 py-2 rounded-l-lg border ${activeTab === "expense" ? "bg-expense text-white" : "bg-gray-100"}`}
                                onClick={() => setActiveTab("expense")}
                            >
                                Expense
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-r-lg border ${activeTab === "income" ? "bg-income text-white" : "bg-gray-100"}`}
                                onClick={() => setActiveTab("income")}
                            >
                                Income
                            </button>
                        </div>
                        {transactions.length === 0 ? (
                            <div className="text-gray-400 flex items-center justify-center mt-36 mb-36">
                                <p>No data available!</p>
                            </div>
                        ) : (
                            <PieChartComponent data={chartData} />
                        ) } 
                    </div>

                    <div className="lg:w-1/2 space-y-6 overflow-auto max-h-[500px]">
                        <TrsList transactions={transactions.filter(trx => trx.type === activeTab)} />
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Reports;
