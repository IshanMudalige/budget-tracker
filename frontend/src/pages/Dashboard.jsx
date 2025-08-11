import { useState, useCallback } from "react";
import TrsList from "../components/TrsList";
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useEffect } from 'react';
import PieChartComponent from '../components/PieChartComponent';

const Dashboard = () => {
    const { user } = useAuth();
    const [selectedMonth] = useState(() => {
        const today = new Date();
        return {
            value: today.getMonth() + 1,
            label: "",
        };
    });
    const [budget, setBudget] = useState(user?.budget || 2000);
    const [transactions, setTransactions] = useState([]);

    const currentMonthName = new Date().toLocaleString("en-US", { month: "long" });

    const fetchTransactions = useCallback(async () => {
        const month = selectedMonth.value;
        const year = 2025

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
        setBudget(user?.budget || 2000);
        fetchTransactions();
    }, [fetchTransactions, user?.budget]);

    // cal summary
    const totalIncome = transactions
        .filter(tx => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpense = transactions
        .filter(tx => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const balance = totalIncome - totalExpense;

    const remaining = budget - totalExpense;
    const progress = Math.min(((totalExpense / budget) * 100).toFixed(0), 100);

    // recent trans
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    const chartData = [
        {
            name: "Income",
            value: transactions
                .filter(trx => trx.type === "income")
                .reduce((sum, trx) => sum + trx.amount, 0),
            color: "#89dd8bff"
        },
        {
            name: "Expense",
            value: transactions
                .filter(trx => trx.type === "expense")
                .reduce((sum, trx) => sum + trx.amount, 0),
            color: "#f79494ff"
        }
    ];

    return (
        <div>
            <div className="px-6 py-6">
                <h1 className="text-2xl font-semibold mb-4 text-gray-500">{currentMonthName} Overview</h1>
                <h3 className="font-semibold mb-3 text-gray-600">Summary</h3>
                <div className="w-full space-y-6">
                    <div className="flex flex-col lg:flex-row gap-6">

                        <div className="flex-1 bg-white p-4 rounded-xl shadow flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-money-bill fa-xl" style={{ color: "#89dd8bff" }} />
                                <p className="text-sm font-medium text-gray-500">Total Income</p>
                            </div>
                            <p className="font-semibold text-2xl">${totalIncome.toFixed(2)}</p>
                        </div>

                        <div className="flex-1 bg-white p-4 rounded-xl shadow flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <i class="fas fa-money-bill fa-xl" style={{ color: "#f79494ff" }} />
                                <p className="text-sm font-medium text-gray-500">Total Expense</p>           
                            </div>
                            <p className="font-semibold text-2xl">${totalExpense.toFixed(2)}</p>
                        </div>

                        <div className="flex-1 bg-white p-4 rounded-xl shadow flex flex-col gap-2">            
                            <div className="flex items-center gap-2">
                                <i class="fas fa-wallet fa-xl" style={{ color: "#7CD6F2" }} />
                                <p className="text-sm font-medium text-gray-500">Balance</p>     
                            </div>
                            <p className="font-semibold text-2xl">${balance.toFixed(2)}</p>
                        </div>

                    </div>
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
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-gray-600">Recent Transactions</h3>
                                {recentTransactions.length > 0 && (
                                    <button onClick={() => window.location.href = "/income-expense"} className="text-blue-500 hover:text-blue-600 mr-2">View All</button>
                                )}
                            </div>
                            <TrsList transactions={recentTransactions} />
                        </div>
                        <div className="w-full lg:w-2/5 mt-6 lg:mt-0">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-gray-600" >Income vs Expense</h3>
                                {transactions.length > 0 && (
                                    <button onClick={() => window.location.href = "/reports"} className="text-blue-500 hover:text-blue-600 mr-2">View All</button>
                                )}
                            </div>
                            {transactions.length > 0 ? (
                                <div className="bg-white rounded-xl shadow p-4 text-gray-400 flex items-center justify-center">
                                    <PieChartComponent data={chartData} height={230} width={200} outerRadius={70} innerRadius={30} />
                                </div>
                            ) : (
                                <div className="text-gray-400 flex items-center justify-center mt-36">
                                    <p>No data available!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;