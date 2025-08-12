import { useState, useCallback } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useEffect } from 'react';
import Alert from "../components/Alert";

const Goals = () => {
    const { user, setUser } = useAuth();

    const [selectedMonth] = useState(() => {
        const today = new Date();
        return {
            value: today.getMonth() + 1,
            label: "",
        };
    });
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [budget, setBudget] = useState(user?.budget || 2000);
    const [newBudget, setNewBudget] = useState(user?.budget || 2000);
    const [spent, setSpent] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = useCallback(async () => {
        const month = selectedMonth.value;
        const year = 2025 //selectedMonth.getFullYear();
        if (!user?.token) return;
        try {
            const res = await axiosInstance.get(`/api/transactions`, {
                headers: { Authorization: `Bearer ${user.token}` },
                params: { month, year }
            });
            setTransactions(res.data);
            const totalSpent = res.data
                .filter(tx => tx.type === 'expense')
                .reduce((sum, tx) => sum + tx.amount, 0);
            setSpent(totalSpent);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }, [selectedMonth.value, user.token]);

    useEffect(() => {
        setBudget(user?.budget || 2000);
        fetchTransactions();
    }, [fetchTransactions, user.budget]);


    const remaining = budget - spent;
    const progress = Math.min(((spent / budget) * 100).toFixed(0), 100);

    // budget update
    const updateBudget = async () => {
        try {
            const res = await axiosInstance.put(
                `/api/auth/updateBudget`,
                { budget: newBudget },
                {
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            );
            const updatedBudget = res.data.budget;
            setBudget(updatedBudget);
            setIsEditing(false);
            setUser((prev) => {
                const updatedUser = { ...prev, budget: updatedBudget };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                return updatedUser;
            });
            setAlert({ type: "success", message: "Updated successfully!"});
        } catch (err) {
            setAlert({ type: "error", message: "Failed to update budget" });
            console.error("Error updating budget:", err);
        }
    };

    return (
        <div>
            <div className="px-6 py-6">
                <h1 className="text-2xl font-semibold mb-4 text-gray-500">Budget Goal</h1>
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="lg:w-2/3 space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
                            <i class="fas fa-trophy fa-xl" style={{ color: "orange" }} />
                            <div className="w-full">
                                <div className="flex justify-between items-center">
                                    <p className="mb-2"><span className="font-semibold">${remaining.toFixed(2)}</span> remains of <span className="font-semibold">${budget.toFixed(2)}</span></p>
                                    <span className="font-semibold font-medium text-gray-600 w-12 text-right">{progress}%</span>
                                </div>
                                <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <h3 className="font-semibold mb-2 text-gray-600">Expense Breakdown</h3>
                        <div className="space-y-4 overflow-auto max-h-[480px]">
                            {transactions.length === 0 && <p className="text-gray-400 flex items-center justify-center mt-36">No transactions found!</p>}
                            {transactions.filter(tx => tx.type === 'expense').map((tx) => {
                                const { _id, date, amount, category } = tx;

                                const percent = ((amount / budget) * 100).toFixed(1);

                                return (
                                    <div key={_id} className={`flex justify-between items-center p-4 bg-white rounded-xl shadow`}>
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl">
                                                <i className={`fas ${category.icon}`} style={{ color: category.color }}></i>
                                            </div>
                                            <div>
                                                <p className="font-medium">{category.name} <span className="text-xs text-gray-500"> | {new Date(date).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}</span></p>
                                                <span className="font-semibold text-gray-600">${amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full w-full rounded-full"
                                                    style={{
                                                        width: `${percent}%`,
                                                        backgroundColor: category.color,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{percent}% of total</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="lg:w-1/3 space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-6">
                                    Monthly Budget
                                </h2>
                                {alert.message && (
                                                <Alert
                                                    type={alert.type}
                                                    message={alert.message}
                                                    onClose={() => setAlert({ type: "", message: "" })}
                                                    duration={3000} // Auto-hide after 3 seconds
                                                />
                                            )}
                                <div className="items-center">
                                    <p className="my-2 text-center text-2xl font-semibold mb-2">

                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={newBudget}
                                                onChange={(e) => setNewBudget(Number(e.target.value))}
                                                className="border rounded px-2 py-1 w-24 w-full text-center"
                                            />
                                        ) : (
                                            <span className="font-semibold">${budget.toFixed(2)}</span>
                                        )}
                                    </p>
                                </div>
                                {isEditing ? (
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={updateBudget}
                                            className="bg-gradient-to-r from-blue-400 to-purple-500 text-white py-2 rounded-lg w-full font-semibold"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setNewBudget(budget);
                                            }}
                                            className="border border-grey-500 text-grey-500 bg-white py-2 rounded-lg w-full font-semibold hover:bg-grey-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-gradient-to-r from-blue-400 to-purple-500 text-white py-2 rounded-lg w-full font-semibold mt-4"
                                    >
                                        Edit Budget
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Goals;
