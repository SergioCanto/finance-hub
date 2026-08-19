type Props = {
    id: string;
    category: string;
    limit: number;
    spent: number;
    cycleStart: string;
    cycleEnd: string;

    onDelete: (
        id: string
    ) => void;

    onEdit: (
        id: string
    ) => void;
    cycleType: string;
};

export default function BudgetCard({
    id,
    category,
    limit,
    spent,
    cycleStart,
    cycleEnd,
    onDelete,
    onEdit,
    cycleType,
}: Props) {
    const percent = (spent / limit) * 100;

    const color =
        percent > 100
            ? "bg-red-500"
            : percent > 80
                ? "bg-yellow-500"
                : "bg-green-500";

    const startLabel =
        new Date(
            cycleStart
        ).toLocaleDateString(
            "es-MX",
            {
                day: "numeric",
                month: "short",
            }
        );

    const endLabel =
        new Date(
            cycleEnd
        ).toLocaleDateString(
            "es-MX",
            {
                day: "numeric",
                month: "short",
            }
        );
    return (
        <div className="bg-zinc-900 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-3">

                <div>
                    <span className="font-semibold">
                        {category}
                    </span>

                    <p className="text-sm text-zinc-400 mt-1">
                        {startLabel} → {endLabel}
                    </p>
                    <p className="text-xs text-zinc-500">

                        {cycleType === "weekly" &&
                            "Semanal"}

                        {cycleType === "biweekly" &&
                            "Quincenal"}

                        {cycleType === "monthly" &&
                            "Mensual"}

                    </p>
                </div>

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => onEdit(id)}
                        className="
                        text-blue-400
                        hover:text-blue-300
                        "
                    >
                        ✏️
                    </button>

                    <span
                        className={
                            percent > 100
                                ? "text-red-400 font-bold"
                                : percent > 80
                                    ? "text-yellow-400 font-bold"
                                    : "text-green-400 font-bold"
                        }
                    >
                        {percent.toFixed(0)}%
                    </span>

                </div>

            </div>

            <div className="w-full bg-zinc-700 h-3 rounded-full">
                <div
                    className={`${color} h-3 rounded-full`}
                    style={{
                        width: `${Math.min(percent, 100)}%`,
                    }}
                />
            </div>

            <p className="mt-3 text-zinc-400">
                ${spent.toLocaleString()} / $
                {limit.toLocaleString()}
            </p>
            {spent > limit && (
                <p className="mt-2 text-red-400 text-sm">
                    ⚠️ Excedido por $
                    {(spent - limit).toLocaleString()}
                </p>
            )}

            <button
                onClick={() => onDelete(id)}
                className="
                mt-4
                w-full
                border
                border-red-500
                text-red-400
                py-2
                rounded-lg
                "
            >
                Eliminar Budget
            </button>
        </div>
    );
}