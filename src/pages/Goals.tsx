import { useEffect, useState } from "react";
import GoalCard from "../components/goals/GoalCard";
import NewGoalForm from "../components/goals/NewGoalForm";
import { Trash2 } from "lucide-react";

import {
    getGoals,
    createGoal,
    addContribution,
    completeGoal,
    deleteGoal,
} from "../services/goals";

export default function Goals() {
    const [goals, setGoals] = useState<any[]>([]);
    const [showModal, setShowModal] =
        useState(false);

    const [selectedGoalId, setSelectedGoalId] =
        useState("");

    const [selectedCurrentAmount,
        setSelectedCurrentAmount] =
        useState(0);

    const [contribution,
        setContribution] =
        useState(0);

    const [showContributionModal,
        setShowContributionModal] =
        useState(false);
    const activeGoals =
        goals.filter(
            (goal) => !goal.completed
        );

    const completedGoals =
        goals.filter(
            (goal) => goal.completed
        );

    useEffect(() => {
        loadGoals();
    }, []);
    async function handleCompleteGoal(
        goalId: string
    ) {
        await completeGoal(goalId);

        loadGoals();
    }
    async function handleDeleteGoal(
        goalId: string
    ) {
        const confirmed = window.confirm(
            "¿Eliminar esta meta?"
        );

        if (!confirmed) return;

        await deleteGoal(goalId);

        loadGoals();
    }
    async function loadGoals() {
        const data = await getGoals();
        setGoals(data || []);
    }

    async function handleSave(goal: {
        name: string;
        target_amount: number;
        current_amount: number;
        target_date: string;
    }) {
        await createGoal(goal);

        setShowModal(false);

        loadGoals();
    }
    function openContributionModal(
        goalId: string,
        currentAmount: number
    ) {
        setSelectedGoalId(goalId);

        setSelectedCurrentAmount(
            currentAmount
        );

        setShowContributionModal(true);
    }

    async function handleContribution() {
        await addContribution(
            selectedGoalId,
            contribution,
            selectedCurrentAmount
        );

        setContribution(0);

        setShowContributionModal(false);

        loadGoals();
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Metas Financieras
                </h1>

                <button
                    onClick={() =>
                        setShowModal(true)
                    }
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                    + Nueva Meta
                </button>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-zinc-900 w-[500px] rounded-xl p-6">

                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                Nueva Meta
                            </h2>

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                ✕
                            </button>
                        </div>

                        <NewGoalForm
                            onSave={handleSave}
                        />

                    </div>

                </div>
            )}
            {showContributionModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-zinc-900 p-6 rounded-xl w-[400px]">

                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                Aportar a Meta
                            </h2>

                            <button
                                onClick={() =>
                                    setShowContributionModal(false)
                                }
                            >
                                ✕
                            </button>
                        </div>

                        <input
                            type="number"
                            placeholder="Monto"
                            className="w-full bg-zinc-800 p-3 rounded-lg"
                            onChange={(e) =>
                                setContribution(
                                    Number(e.target.value)
                                )
                            }
                        />

                        <button
                            onClick={handleContribution}
                            className="w-full mt-4 bg-green-600 py-3 rounded-lg"
                        >
                            Guardar Aportación
                        </button>

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
                {activeGoals.map((goal) => (
                    <GoalCard
                        key={goal.id}
                        id={goal.id}
                        name={goal.name}
                        target={Number(goal.target_amount)}
                        current={Number(goal.current_amount)}
                        targetDate={goal.target_date}
                        onContribution={
                            openContributionModal
                        }
                        onDelete={handleDeleteGoal}
                        onComplete={handleCompleteGoal}
                    />
                ))}

            </div>
            {completedGoals.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold mt-12 mb-6">
                        Metas Completadas
                    </h2>

                    <div
                        className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        xl:grid-cols-3
                        gap-6
                        "
                    >

                        {completedGoals.map((goal) => (
                            <div
                                key={goal.id}
                                className="
                                    bg-zinc-900
                                    p-6
                                    rounded-xl
                                    border
                                    border-green-500
                                    "
                            >
                                <h3 className="font-bold">
                                    {goal.name}
                                </h3>

                                <p className="mt-3 text-green-400">
                                    ✅ Completada
                                </p>
                                <button
                                    onClick={() => handleDeleteGoal(goal.id)}
                                    className="
                                        mt-4
                                        flex
                                        items-center
                                        gap-2
                                        text-red-400
                                        hover:text-red-300
                                    "
                                >
                                    <Trash2 size={16} />
                                    Eliminar Meta
                                </button>
                            </div>
                        ))}

                    </div>
                </>
            )}
        </div>
    );
}