import { useEffect, useState } from "react";

type Props = {
    onSave: (goal: {
        name: string;
        target_amount: number;
        current_amount: number;
        target_date: string;
    }) => Promise<void>;

    initialData?: {
        id?: string;
        name: string;
        target_amount: number;
        current_amount: number;
        target_date: string;
    };

    isEditing?: boolean;
};


export default function NewGoalForm({
    onSave,
    initialData,
    isEditing,
}: Props) {
    const [form, setForm] = useState({
        name:
            initialData?.name || "",

        target_amount:
            initialData
                ? String(
                    initialData.target_amount
                )
                : "",

        current_amount:
            initialData
                ? String(
                    initialData.current_amount
                )
                : "",

        target_date:
            initialData?.target_date || "",
    });
    useEffect(() => {

        if (!initialData) return;

        setForm({
            name: initialData.name,

            target_amount:
                String(
                    initialData.target_amount
                ),

            current_amount:
                String(
                    initialData.current_amount
                ),

            target_date:
                initialData.target_date,
        });

    }, [initialData]);

    return (
        <div className="space-y-4">

            <label className="block text-sm text-zinc-400 mb-2">
                Nombre de la Meta
            </label>
            <input
                type="text"
                value={form.name}
                placeholder="Nombre de la meta"
                className="w-full bg-zinc-800 p-3 rounded-lg"
                onChange={(e) =>
                    setForm({
                        ...form,
                        name: e.target.value,
                    })
                }
            />

            <label className="block text-sm text-zinc-400 mb-2">
                Monto Objetivo
            </label>
            <input
                type="number"
                value={form.target_amount}
                placeholder="Monto objetivo"
                className="w-full bg-zinc-800 p-3 rounded-lg"
                onChange={(e) =>
                    setForm({
                        ...form,
                        target_amount: e.target.value,
                    })
                }
            />

            <label className="block text-sm text-zinc-400 mb-2">
                Monto Actual
            </label>
            <input
                type="number"
                value={form.current_amount}
                disabled
                className="
                w-full
                bg-zinc-700
                p-3
                rounded-lg
                opacity-70
                cursor-not-allowed
                "
                placeholder="Monto actual"
                onChange={(e) =>
                    setForm({
                        ...form,
                        current_amount: e.target.value,
                    })
                }
            />

            <label className="block text-sm text-zinc-400 mb-2">
                Fecha Objetivo
            </label>
            <input
                type="date"
                value={form.target_date}
                className="w-full bg-zinc-800 p-3 rounded-lg"
                onChange={(e) =>
                    setForm({
                        ...form,
                        target_date: e.target.value,
                    })
                }
            />

            <button
                onClick={() =>
                    onSave({
                        ...form,
                        target_amount: Number(
                            form.target_amount || 0
                        ),
                        current_amount: Number(
                            form.current_amount || 0
                        ),
                    })
                }
                className="w-full bg-blue-600 py-3 rounded-lg"
            >
                {isEditing
                    ? "Guardar Cambios"
                    : "Guardar Meta"}
            </button>
        </div >
    );
}