type Props = {
    id: string;
    name: string;
    target: number;
    current: number;
    targetDate: string;

    onContribution: (
        goalId: string,
        currentAmount: number
    ) => void;

    onDelete: (
        goalId: string
    ) => void;

    onComplete: (
        goalId: string
    ) => void;
};

export default function GoalCard({
    id,
    name,
    target,
    current,
    targetDate,
    onContribution,
    onDelete,
    onComplete
}: Props) {
    const percent =
        (current / target) * 100;

    const remaining = Math.max(
        target - current,
        0
    );

    const today = new Date();

    const targetDateObj = new Date(targetDate);

    const monthsRemaining = Math.max(
        1,
        Math.ceil(
            (targetDateObj.getTime() -
                today.getTime()) /
            (1000 * 60 * 60 * 24 * 30)
        )
    );

    const monthlyContribution =
        remaining / monthsRemaining;
    const isCompleted =
        current >= target;

    return (
        <div className="bg-zinc-900 p-6 rounded-xl">
            <h3 className="font-bold text-lg">
                {name}
            </h3>

            <p className="mt-2 text-zinc-400">
                ${current.toLocaleString()} / ${target.toLocaleString()}
            </p>

            <div className="mt-4 bg-zinc-700 h-3 rounded-full">
                <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{
                        width: `${Math.min(percent, 100)}%`
                    }}
                />
            </div>

            <p className="mt-3">
                {percent.toFixed(0)}%
            </p>

            <div className="mt-4 text-sm text-zinc-400">
                <p className="text-orange-400">
                    Faltan: ${remaining.toLocaleString()}
                </p>

                <p className="text-blue-400">
                    Necesitas ahorrar: $
                    {monthlyContribution.toLocaleString(
                        undefined,
                        {
                            maximumFractionDigits: 0,
                        }
                    )}
                    / mes
                </p>
                {!isCompleted && (
                    <button
                        onClick={() =>
                            onContribution(id, current)
                        }
                        className="
                        mt-6
                        w-full
                        bg-green-600
                        hover:bg-green-500
                        text-white
                        font-semibold
                        py-3
                        rounded-lg
                        "
                    >
                        💰 Aportar
                    </button>
                )}
                {isCompleted && (
                    <button
                        onClick={() =>
                            onComplete(id)
                        }
                        className="
                        mt-6
                        w-full
                        bg-blue-600
                        hover:bg-blue-500
                        text-white
                        font-semibold
                        py-3
                        rounded-lg
                        "
                    >
                        ✅ Marcar como Completada
                    </button>
                )}
                <button
                    onClick={() => onDelete(id)}
                    className="
                    mt-3
                    w-full
                    border
                    border-red-500
                    text-red-400
                    hover:bg-red-500
                    hover:text-white
                    py-3
                    rounded-lg
                    "
                >
                    🗑 Eliminar Meta
                </button>
            </div>
        </div>
    );
}