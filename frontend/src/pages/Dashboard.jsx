import { useState } from "react";
import TrsList from "../components/TrsList";
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useEffect } from 'react';

const Dashboard = () => {
    const [selectedMonth] = useState(() => {
        const today = new Date();
        return {
            value: today.getMonth() + 1,
            label: "",
        };
    });
    const [transactions, setTransactions] = useState([]);
    const { user } = useAuth();

    const fetchTransactions = async () => {
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
    };

    useEffect(() => {
        fetchTransactions();
    }, [user, selectedMonth]);

    // 🔹 Calculate Summary values
    const totalIncome = transactions
        .filter(tx => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpense = transactions
        .filter(tx => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const balance = totalIncome - totalExpense;

    // 🔹 Example budget calculation (replace with actual logic)
    const budget = 2000;
    const remaining = budget - totalExpense;
    const progress = Math.min(((totalExpense / budget) * 100).toFixed(0), 100);

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // sort latest first
        .slice(0, 3); // take first 3

    return (
        <div>
            {/* <Topbar onToggleSidebar={onToggleSidebar} /> */}
            <div className="px-6 py-6">
                {/* <h1 className="text-2xl font-semibold mb-4 text-gray-600">Dashboard</h1> */}
                <h3 className="font-semibold mb-3 text-gray-600">Summary</h3>
                <div className="w-full space-y-6">
                    {/* Summary Section */}

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 bg-white p-4 rounded-xl shadow flex items-center gap-4">
                            <i class="fas fa-money-bill fa-xl" style={{ color: "#89dd8bff" }} />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Income</p>
                                <p className="font-bold text-lg">${totalIncome.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-xl shadow flex items-center gap-4">
                            <i class="fas fa-money-bill fa-xl" style={{ color: "#f79494ff" }} />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Expense</p>
                                <p className="font-bold text-lg">${totalExpense.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-xl shadow flex items-center gap-4">
                            <i class="fas fa-wallet fa-xl" style={{ color: "#7CD6F2" }} />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Balance</p>
                                <p className="font-bold text-lg">${balance.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Budget Goal */}
                    <div>
                        <h3 className="font-semibold mb-2 text-gray-600">Budget Goal</h3>
                        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
                            <i class="fas fa-trophy fa-xl" style={{ color: "orange" }} />
                            <div className="w-full">
                                <div className="flex justify-between items-center">
                                    <p className="mb-2"><span className="font-semibold">${remaining.toFixed(2)}</span> remains of <span className="font-semibold">${budget.toFixed(2)}</span></p>
                                    <span className="font-semibold font-medium text-gray-600 w-12 text-right">{progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* Recent Transactions & Progress */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Recent Transactions */}

                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-gray-600">Recent Transactions</h3>
                                <button className="text-blue-500 hover:text-blue-600 mr-2">View All</button>
                            </div>
                            <TrsList transactions={recentTransactions} />
                        </div>

                        {/* Progress Placeholder */}
                        <div className="w-full lg:w-2/5 mt-6 lg:mt-0">
                            <h3 className="font-semibold mb-3 text-gray-600" >Progress</h3>
                            <div className="bg-white h-full rounded-xl shadow p-4 text-gray-400 flex items-center justify-center">
                                (Chart/Graph Placeholder)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;