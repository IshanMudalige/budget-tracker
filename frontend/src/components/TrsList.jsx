const TrsList = ({ transactions, setSelectedTx, selectedTx }) => {

    return (
        <div className="space-y-4">
            {transactions.length === 0 && <p className="text-gray-400 flex items-center justify-center mt-36">No transactions found!</p>}
            {transactions.map((tx) => {
                const { _id, date, amount, type, category, note } = tx;
                const color = type === 'income' ? "#89dd8bff" : "#f79494ff";

                return (
                    <div key={_id} onClick={() => setSelectedTx(tx)} className={`flex justify-between items-center p-4 bg-white rounded-xl shadow  ${selectedTx?._id === _id ? 'border-purple-500 border-2 border-l-8' : 'border-l-8'}`} style={{ cursor: 'pointer', borderColor: selectedTx?._id === _id ? '#A855F7' : color }}>
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
