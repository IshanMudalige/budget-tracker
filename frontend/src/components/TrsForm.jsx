import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import Alert from "./Alert";

const TrsForm = ({ selectedTransaction, setSelectedTx, refreshTransactions }) => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("expense");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Recurring transaction states
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [interval, setInterval] = useState(1);
  const [endDate, setEndDate] = useState("");

  // load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // set data for edit
  useEffect(() => {
    if (selectedTransaction) {
      setActiveTab(selectedTransaction.type);
      setAmount(selectedTransaction.amount);
      setNote(selectedTransaction.note || "");
      setDate(selectedTransaction.date?.split('T')[0] || "");
      setCategory(selectedTransaction.category?._id || "");

      // recurring values
      setIsRecurring(selectedTransaction.isRecurring || false);
      setFrequency(selectedTransaction.recurrenceRule?.frequency || "monthly");
      setInterval(selectedTransaction.recurrenceRule?.interval || 1);
      setEndDate(selectedTransaction.recurrenceRule?.endDate?.split('T')[0] || "");
    } else {
      setAmount("");
      setNote("");
      setDate("");
      setCategory("");
      setActiveTab("expense");

      // reset recurring
      setIsRecurring(false);
      setFrequency("monthly");
      setInterval(1);
      setEndDate("");
    }
  }, [selectedTransaction]);

  const resetForm = () => {
    setActiveTab("expense");
    setDate("");
    setCategory("");
    setNote("");
    setAmount("");
    setSelectedTx(null);

    // reset recurring
    setIsRecurring(false);
    setFrequency("monthly");
    setInterval(1);
    setEndDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transactionData = {
      type: activeTab,
      amount,
      note,
      date,
      category,
      isRecurring,
      recurrenceRule: isRecurring
        ? {
            frequency,
            interval,
            endDate,
            nextRun: date
          }
        : null
    };

    try {
      if (selectedTransaction) {
        await axiosInstance.put(`/api/transactions/${selectedTransaction._id}`, transactionData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } else {
        await axiosInstance.post("/api/transactions", transactionData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setAlert({ type: "success", message: selectedTransaction ? "Updated successfully!" : "Added successfully!" });
      refreshTransactions();
      resetForm();
    } catch (error) {
      console.error("Failed to save transaction:", error);
      setAlert({ type: "error", message: "Failed to save transaction." });
    }
  };

  const handleDelete = async (transactionId) => {
    try {
      await axiosInstance.delete(`/api/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      refreshTransactions();
      resetForm();
      setAlert({ type: "success", message: "Transaction deleted successfully!" });
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      setAlert({ type: "error", message: "Failed to delete transaction." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white w-full lg:w-1/2 p-6 rounded-xl shadow self-start">
      <h2 className="text-xl font-semibold mb-6">
        {selectedTransaction ? "Update Transaction" : "Add Transaction"}
      </h2>

      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
          duration={3000}
        />
      )}

      {/* Transaction type tabs */}
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

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-lg"
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-lg"
        required
      >
        <option value="">Select Category</option>
        {categories.filter(cat => cat.type === activeTab).map(cat => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note"
        className="w-full mb-4 px-4 py-2 border rounded-lg resize-none"
        rows="2"
      />

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-full mb-6 px-4 py-2 border rounded-lg"
        required
      />

      {/* recurring trs section */}
      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          <span>Make this a recurring transaction</span>
        </label>

        {isRecurring && (
          <div className="mt-4 space-y-4 border p-4 rounded-lg bg-gray-50">
            <div>
              <label className="block mb-1 font-medium">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Interval</label>
              <input
                type="number"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
              <small className="text-gray-500">Example: 1 = every {frequency}, 2 = every 2 {frequency}s</small>
            </div>

            <div>
              <label className="block mb-1 font-medium">End Date (optional)</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <div className={selectedTransaction ? "flex justify-between gap-2" : ''}>
        {selectedTransaction && (
          <button
            type="button"
            className="border border-grey-500 text-grey-500 bg-white py-2 rounded-lg w-full font-semibold hover:bg-grey-50"
            onClick={resetForm}
          >
            Clear
          </button>
        )}
        {selectedTransaction && (
          <button
            type="button"
            className="border border-red-500 text-red-500 bg-white py-2 rounded-lg w-full font-semibold hover:bg-red-50"
            onClick={() => handleDelete(selectedTransaction._id)}
          >
            Delete
          </button>
        )}
        <button className="bg-gradient-to-r from-blue-400 to-purple-500 text-white py-2 rounded-lg w-full font-semibold">
          {selectedTransaction ? "UPDATE" : "ADD"}
        </button>
      </div>
    </form>
  );
};

export default TrsForm;
