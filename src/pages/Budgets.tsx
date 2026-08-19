import { useEffect, useState } from "react";
import BudgetCard from "../components/budgets/BudgetCard";
import BudgetForm from
    "../components/budgets/BudgetForm";

import {
    getBudgetStatus,
    createBudget,
    deleteBudget,
    updateBudget,
} from "../services/budgets";

export default function Budgets() {
    const [budgets, setBudgets] = useState<any[]>([]);
    const [showModal,
        setShowModal] =
        useState(false);
    const [editingBudget,
        setEditingBudget] =
        useState<any>(null);

    useEffect(() => {
        loadBudgets();
    }, []);

    async function loadBudgets() {
        const data = await getBudgetStatus();
        setBudgets(data || []);
    }
    async function handleSave(
        budget: {
            category: string;
            monthly_limit: number;
            start_day: number;
            cycle_type: string;
        }
    ) {

        if (editingBudget) {

            await updateBudget(
                editingBudget.id,
                budget
            );

        } else {

            await createBudget(budget);

        }

        setEditingBudget(null);

        setShowModal(false);

        loadBudgets();
    }
    async function handleDelete(
        id: string
    ) {
        const confirmed =
            window.confirm(
                "¿Eliminar budget?"
            );

        if (!confirmed) return;

        await deleteBudget(id);

        loadBudgets();
    }
    function handleEdit(
        id: string
    ) {
        const budget =
            budgets.find(
                (b) => b.id === id
            );

        setEditingBudget(budget);

        setShowModal(true);
    }

    return (
        <div>
            <div className="flex justify-between mb-6">

                <h1 className="text-3xl font-bold">
                    Budget
                </h1>

                <button
                    onClick={() => {

                        setEditingBudget(null);

                        setShowModal(true);

                    }}
                    className="
                    bg-blue-600
                    px-4
                    py-2
                    rounded-lg
                    "
                >
                    + Nuevo Budget
                </button>

            </div>
            {showModal && (
                <div
                    className="
                    fixed
                    inset-0
                    bg-black/70
                    flex
                    items-center
                    justify-center
                    "
                >
                    <div
                        className="
                        bg-zinc-900
                        p-6
                        rounded-xl
                        w-[500px]
                        "
                    >
                        <div
                            className="
                            flex
                            justify-between
                            mb-4
                            "
                        >
                            <h2 className="text-xl font-semibold">
                                {editingBudget
                                    ? "Editar Budget"
                                    : "Nuevo Budget"}
                            </h2>

                            <button
                                onClick={() => {

                                    setEditingBudget(null);

                                    setShowModal(false);

                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <BudgetForm
                            onSave={handleSave}
                            initialData={
                                editingBudget
                                    ? {
                                        category:
                                            editingBudget.category,
                                        monthly_limit:
                                            editingBudget.monthly_limit,
                                        start_day:
                                            editingBudget.start_day,
                                        cycle_type:
                                            editingBudget.cycle_type,
                                    }
                                    : undefined
                            }
                            isEditing={!!editingBudget}
                        />

                    </div>

                </div>
            )}

            <div
                className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
                "
            >
                {budgets.map((budget) => (
                    <BudgetCard
                        key={budget.id}
                        id={budget.id}
                        category={budget.category}
                        limit={Number(
                            budget.monthly_limit
                        )}
                        spent={budget.spent}
                        cycleStart={
                            budget.cycleStart
                        }
                        cycleEnd={
                            budget.cycleEnd
                        }
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        cycleType={
                            budget.cycle_type
                        }
                    />
                ))}
            </div>
        </div>
    );
}