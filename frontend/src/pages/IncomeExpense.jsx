import { useCallback, useState } from "react";
import TrsForm from "../components/TrsForm";
import TrsList from "../components/TrsList";
import MonthSelector from "../components/MonthSelector";
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useEffect } from 'react';

const IncomeExpense = () => {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return {
            value: today.getMonth()+1,
            label: "",
        };
    });
    const [selectedTx, setSelectedTx] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const { user } = useAuth();

    const fetchTransactions = useCallback(async () => {
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

    return (
        <div>
            <div className="px-6 py-6">
                <h1 className="text-2xl font-semibold mb-4 text-gray-500">Manage Your Transactions</h1>
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <TrsForm selectedTransaction={selectedTx} setSelectedTx={setSelectedTx} refreshTransactions={fetchTransactions} />
                    <div className="lg:w-1/2 space-y-6">
                        <div className="">
                            <MonthSelector selectedMonth={selectedMonth}
                                setSelectedMonth={setSelectedMonth} />
                        </div>
                        <div className="overflow-auto max-h-[500px]">
                        <TrsList transactions={transactions} setSelectedTx={setSelectedTx} selectedTx={selectedTx} refreshTransactions={fetchTransactions} />
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomeExpense;
