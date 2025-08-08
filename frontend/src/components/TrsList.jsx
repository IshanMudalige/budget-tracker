import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useEffect, useState } from 'react';

const TrsList = ({ selectedMonth, setSelectedTx }) => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                if (!user) return;
                const res = await axiosInstance.get(`/api/transactions`, { headers: { Authorization: `Bearer ${user.token}` } });
                setTransactions(res.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [user, selectedMonth]);

    return (
        <div className="space-y-4">
            {transactions.map((tx) => {
                const { _id, date, amount, type, category } = tx;
                const color = type === 'income' ? "#89dd8bff" : "#f79494ff";

                return (
                    <div key={_id} onClick={() => setSelectedTx(tx)} className="flex justify-between items-center p-4 bg-white rounded-xl shadow border-l-8" style={{ borderColor: color, cursor: 'pointer' }}>
                        <div className="flex items-center gap-4">
                            <div className="text-2xl">
                                <i className={`fas ${category.icon}`} style={{ color: category.color }}></i>
                            </div>
                            <div>
                                <p className="font-medium">{category.name} <span className="text-xs text-gray-500"> | {new Date(tx.date).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}</span></p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className="font-semibold">${amount.toFixed(2)}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default TrsList;
