import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useEffect, useState } from 'react';

const TrsList = ({ transactions, setSelectedTx, selectedTx }) => {
    const { user } = useAuth();

    return (
        <div className="space-y-4">
            {transactions.length === 0 && <p className="text-center text-gray-500 mt-36">No transactions found!</p>}
            {transactions.map((tx) => {
                const { _id, date, amount, type, category, note } = tx;
                const color = type === 'income' ? "#89dd8bff" : "#f79494ff";

                return (
                    <div key={_id} onClick={() => setSelectedTx(tx)} className={`flex justify-between items-center p-4 bg-white rounded-xl shadow border-l-8 ${selectedTx?._id === _id ? 'bg-purple-500/15' : 'bg-white'}`} style={{ borderColor: color, cursor: 'pointer' }}>
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
                                <p className="text-xs text-gray-500 mt-1">{note}</p>
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
