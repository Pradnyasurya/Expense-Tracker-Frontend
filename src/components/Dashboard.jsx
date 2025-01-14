import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

const Dashboard = ({ userId }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newExpense, setNewExpense] = useState({
        amount: '',
        merchant: '',
        currency: 'INR',
        created_at: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchExpenses();
    }, [userId]);

    const fetchExpenses = async () => {
        try {
            const response = await fetch(`http://localhost:9820/expense/v1/getExpense?user_id=${userId}`, {
                headers: {
                    'X-User-Id': userId
                }
            });
            if (!response.ok) throw new Error('Failed to fetch expenses');
            const data = await response.json();
            setExpenses(data);
        } catch (err) {
            setError('Failed to load expenses');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:9820/expense/v1/addExpense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': userId
                },
                body: JSON.stringify({
                    ...newExpense,
                    user_id: userId,
                    amount: parseFloat(newExpense.amount),
                    created_at: `${newExpense.created_at}T10:00:00Z`,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server response:', errorData);
                throw new Error(`Failed to add expense: ${errorData.message || 'Unknown error'}`);
            }

            const result = await response.json();
            console.log('Success:', result);

            await fetchExpenses();
            setShowForm(false);
            setNewExpense({
                amount: '',
                merchant: '',
                currency: 'INR',
                created_at: new Date().toISOString().split('T')[0],
            });
        } catch (err) {
            console.error('Error adding expense:', err);
        }
    };

    const calculateTotal = () => expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    const formatCurrency = (amount, currency) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency || 'INR',
        }).format(amount);

    if (loading) return <div className="text-lg text-gray-600 p-8">Loading expenses...</div>;
    if (error) return <div className="text-lg text-red-600 p-8">{error}</div>;

    return (
        <div className="w-full min-h-screen bg-gray-100 p-8">
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Merchant</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded bg-[#1a1a1a] text-white placeholder-gray-400"
                                    value={newExpense.merchant}
                                    placeholder="Enter Merchant Name"
                                    onChange={(e) => setNewExpense({ ...newExpense, merchant: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Amount</label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    className="w-full p-2 border rounded bg-[#1a1a1a] text-white placeholder-gray-400"
                                    value={newExpense.amount}
                                    placeholder="Enter Amount"
                                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full p-2 border rounded bg-[#1a1a1a] text-white placeholder-gray-400"
                                    value={newExpense.created_at}
                                    onChange={(e) => setNewExpense({ ...newExpense, created_at: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Add Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} />
                    <span>Add Expense</span>
                </button>
            </div>

            {/* Summary Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Expense Summary</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-blue-800 text-lg">Total Expenses</h3>
                        <p className="text-blue-600 text-3xl font-bold mt-2">
                            {formatCurrency(calculateTotal(), 'INR')}
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-green-800 text-lg">Total Transactions</h3>
                        <p className="text-green-600 text-3xl font-bold mt-2">{expenses.length}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="text-purple-800 text-lg">Average Expense</h3>
                        <p className="text-purple-600 text-3xl font-bold mt-2">
                            {formatCurrency(calculateTotal() / expenses.length || 0, 'INR')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold">Recent Expenses</h2>
                </div>
                {expenses.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">No expenses found.</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="px-6 py-3 text-sm text-gray-800 uppercase">Merchant</th>
                                <th className="px-6 py-3 text-sm text-gray-800 uppercase">Amount</th>
                                <th className="px-6 py-3 text-sm text-gray-800 uppercase">Date</th>
                                <th className="px-6 py-3 text-sm text-gray-800 uppercase">Currency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-800">{expense.merchant || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {formatCurrency(expense.amount || 0, expense.currency)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(expense.created_at || new Date())}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {expense.currency || 'INR'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
