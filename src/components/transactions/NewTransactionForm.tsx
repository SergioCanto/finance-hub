import { useState } from "react";
import { useEffect } from "react";
import { getCategories } from "../../services/categories";
import { getAccounts } from "../../services/accounts";

type Props = {
    onSave: (data: any) => Promise<void>;
};

export default function NewTransactionForm({
    onSave,
}: Props) {
    const [form, setForm] = useState({
        transaction_date: "",
        description: "",
        amount: "",
        type: "expense",
        category: "",
        account: "",
    });

    const [categories, setCategories] =
        useState<any[]>([]);

    useEffect(() => {
        loadCategories();
        loadAccounts();
    }, []);

    const [accounts, setAccounts] =
        useState<any[]>([]);
    const filteredCategories =
        categories.filter(
            (category) =>
                category.type === form.type
        );

    async function loadCategories() {
        const data = await getCategories();

        setCategories(data || []);
    }
    async function loadAccounts() {
        const data = await getAccounts();

        setAccounts(data || []);
    }

    return (
        <div className="bg-zinc-900 p-6 rounded-xl mb-6">
            <h2 className="text-xl font-bold mb-4">
                Nueva Transacción
            </h2>

            <div className="grid grid-cols-2 gap-4">

                <input
                    type="date"
                    className="bg-zinc-800 p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            transaction_date: e.target.value,
                        })
                    }
                />

                <input
                    placeholder="Descripción"
                    className="bg-zinc-800 p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            description: e.target.value,
                        })
                    }
                />

                <input
                    type="number"
                    placeholder="Monto"
                    value={form.amount}
                    className="bg-zinc-800 p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            amount: e.target.value,
                        })
                    }
                />

                <select
                    value={form.type}
                    className="bg-zinc-800 p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            type: e.target.value,
                            category: "",
                        })
                    }
                >
                    <option value="expense">
                        Gasto
                    </option>

                    <option value="income">
                        Ingreso
                    </option>
                </select>

                <select
                    value={form.category}
                    className="bg-zinc-800 p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            category: e.target.value,
                        })
                    }
                >
                    <option value="">
                        Selecciona categoría
                    </option>

                    {filteredCategories.map((category) => (
                        <option
                            key={category.id}
                            value={category.name}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-zinc-400">
                    Categorías disponibles para:
                    {" "}
                    {form.type === "expense"
                        ? "Gasto"
                        : "Ingreso"}
                </p>
                <select
                    className="bg-zinc-800 p-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            account: e.target.value,
                        })
                    }
                >
                    <option value="">
                        Selecciona cuenta
                    </option>

                    {accounts.map((account) => (
                        <option
                            key={account.id}
                            value={account.name}
                        >
                            {account.name}
                        </option>
                    ))}
                </select>

            </div>

            <button
                onClick={() =>
                    
                    onSave({
                        ...form,
                        amount: Number(form.amount),
                    })
                }
                className="mt-4 bg-green-600 px-4 py-2 rounded"
            >
                Guardar
            </button>
        </div>
    );
}