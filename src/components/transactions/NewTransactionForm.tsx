import { useState } from "react";
import { useEffect } from "react";
import {
    getCategories,
    createCategory,
} from "../../services/categories";
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

    const [
        showCategoryModal,
        setShowCategoryModal,
    ] = useState(false);

    const [
        newCategoryName,
        setNewCategoryName,
    ] = useState("");

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

    async function handleCreateCategory() {

        if (!newCategoryName.trim()) {
            return;
        }

        await createCategory({
            name: newCategoryName,
            type: form.type,
        });

        await loadCategories();

        setForm({
            ...form,
            category: newCategoryName,
        });

        setNewCategoryName("");

        setShowCategoryModal(false);

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
                    onChange={(e) => {

                        if (
                            e.target.value ===
                            "__new_category__"
                        ) {

                            setShowCategoryModal(
                                true
                            );

                            return;
                        }

                        setForm({
                            ...form,
                            category: e.target.value,
                        });

                    }}
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

                    <option value="__new_category__">
                        ➕ Crear Nueva Categoría...
                    </option>
                </select>
                <p className="text-xs text-zinc-400">
                    Categorías disponibles para:
                    {" "}
                    {form.type === "expense"
                        ? "Gasto"
                        : "Ingreso"}
                </p>
                <select
                    value={form.account}
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

            {showCategoryModal && (

                <div
                    className="
                    fixed
                    inset-0
                    bg-black/70
                    flex
                    items-center
                    justify-center
                    z-50
                    "
                >

                    <div
                        className="
                        bg-zinc-900
                        p-6
                        rounded-xl
                        w-[400px]
                        "
                    >

                        <div className="flex justify-between mb-4">

                            <h3 className="text-xl font-bold">
                                Nueva Categoría
                            </h3>

                            <button
                                onClick={() =>
                                    setShowCategoryModal(false)
                                }
                            >
                                ✕
                            </button>

                        </div>

                        <p className="text-zinc-400 mb-4">

                            Categoría para:

                            {" "}

                            {form.type === "expense"
                                ? "Gasto"
                                : "Ingreso"}

                        </p>

                        <input
                            type="text"
                            value={newCategoryName}
                            placeholder="Nombre de la categoría"
                            className="
                            w-full
                            bg-zinc-800
                            p-3
                            rounded-lg
                            "
                            onChange={(e) =>
                                setNewCategoryName(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            onClick={handleCreateCategory}
                            className="
                                mt-4
                                w-full
                                bg-blue-600
                                py-3
                                rounded-lg
                                "
                        >
                            Crear Categoría
                        </button>

                    </div>

                </div>

            )}

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