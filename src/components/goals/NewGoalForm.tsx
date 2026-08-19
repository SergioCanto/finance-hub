import { useState } from "react";

type Props = {
    onSave: (goal: {
        name: string;
        target_amount: number;
        current_amount: number;
        target_date: string;
    }) => Promise<void>;
};

export default function NewGoalForm({
    onSave,
}: Props) {
    const [form, setForm] = useState({
        name: "",
        target_amount: "",
        current_amount: "",
        target_date: "",
    });

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Nombre de la meta"
                className="w-full bg-zinc-800 p-3 rounded-lg"
                onChange={(e) =>
                    setForm({
                        ...form,
                        name: e.target.value,
                    })
                }
            />

            <input
                type="number"
                placeholder="Monto objetivo"
                className="w-full bg-zinc-800 p-3 rounded-lg"
                onChange={(e) =>
                    setForm({
                        ...form,
                        target_amount: e.target.value,
                    })
                }
            />

            <input
                type="number"
                value={form.current_amount}
                placeholder="Monto actual"
                className="w-full bg-zinc-800 p-3 rounded-lg"
                onChange={(e) =>
                    setForm({
                        ...form,
                        current_amount: e.target.value,
                    })
                }
            />

            <input
                type="date"
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
                Guardar Meta
            </button>
        </div>
    );
}