import { useEffect, useState } from "react";
import {
    getTransactions,
    createTransaction,
    deleteTransaction,
} from "../services/transactions";
import NewTransactionForm from "../components/transactions/NewTransactionForm";
import { Trash2 } from "lucide-react";

export default function Transactions() {
    const [transactions, setTransactions] =
        useState<any[]>([]);

    useEffect(() => {
        loadTransactions();
    }, []);

    const [showForm, setShowForm] =
        useState(false);

    async function handleSave(data: any) {
        await createTransaction(data);

        setShowForm(false);

        loadTransactions();
    }
    async function handleDelete(
        id: string
    ) {

        const confirmed =
            window.confirm(
                "¿Eliminar esta transacción?"
            );

        if (!confirmed) return;

        await deleteTransaction(id);

        loadTransactions();
    }
    async function loadTransactions() {
        const data = await getTransactions();
        setTransactions(data);
    }

    return (
        <div>
            <div className="flex justify-between mb-6">
                <h1 className="text-3xl font-bold">
                    Transacciones
                </h1>

                <button
                    onClick={() =>
                        setShowForm(!showForm)
                    }
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                    Nueva Transacción
                </button>
            </div>
            {showForm && (
                <NewTransactionForm
                    onSave={handleSave}
                />
            )}
            <div className="bg-zinc-900 rounded-xl">
                <div className="hidden md:block">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left p-4">
                                    Fecha
                                </th>
                                <th className="text-left p-4">
                                    Descripción
                                </th>
                                <th className="text-left p-4">
                                    Categoría
                                </th>
                                <th className="text-left p-4">
                                    Monto
                                </th>
                                <th className="text-left p-4">
                                    Acción
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    className="border-b border-zinc-800"
                                >
                                    <td className="p-4">
                                        {tx.transaction_date}
                                    </td>

                                    <td className="p-4">
                                        {tx.description}
                                    </td>

                                    <td className="p-4">
                                        {tx.category}
                                    </td>

                                    <td className="p-4">
                                        ${tx.amount}
                                    </td>
                                    <td className="p-4">

                                        <button
                                            onClick={() =>
                                                handleDelete(tx.id)
                                            }
                                            className="
                                        text-red-400
                                        hover:text-red-300
                                        transition
                                        "
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="md:hidden space-y-4">

                    {transactions.map((tx) => (

                        <div
                            key={tx.id}
                            className="
                            bg-zinc-900
                            p-4
                            rounded-xl
                            "
                        >

                            <div className="flex justify-between">

                                <span className="text-zinc-400">
                                    {tx.transaction_date}
                                </span>

                                <button
                                    onClick={() =>
                                        handleDelete(tx.id)
                                    }
                                    className="text-red-400"
                                >
                                    <Trash2 size={18} />
                                </button>

                            </div>

                            <h3 className="font-semibold mt-2">
                                {tx.description}
                            </h3>

                            <p className="text-zinc-400">
                                {tx.category}
                            </p>

                            <p className="mt-2 font-bold">
                                ${tx.amount}
                            </p>

                        </div>

                    ))}

                </div>
            </div>
        </div>
    );
}