import { useEffect, useState } from "react";
import { getCategories } from "../../services/categories";

type Props = {
    onSave: (budget: {
        category: string;
        monthly_limit: number;
        start_day: number;
        cycle_type: string;
    }) => Promise<void>;

    initialData?: {
        category: string;
        monthly_limit: number;
        start_day: number;
        cycle_type: string;
    };
    isEditing?: boolean;
};

export default function BudgetForm({
    onSave,
    initialData,
    isEditing,
}: Props) {
    const [categories, setCategories] =
        useState<any[]>([]);
    const [form, setForm] = useState({
        category:
            initialData?.category || "",
        monthly_limit:
            initialData?.monthly_limit || 0,
        start_day:
            initialData?.start_day || 1,
        cycle_type:
            initialData?.cycle_type ||
            "monthly",
    });
    useEffect(() => {
        if (initialData) {
            setForm({
                category: initialData.category,
                monthly_limit:
                    initialData.monthly_limit,
                start_day:
                    initialData.start_day,
                cycle_type:
                    initialData.cycle_type,
            });
        }
    }, [initialData]);
    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        const data =
            await getCategories();

        setCategories(
            (data || []).filter(
                (category) =>
                    category.type === "expense"
            )
        );
    }

    return (
        <div className="space-y-4">
            <label className="block text-sm text-zinc-400 mb-2">
                Categoría
            </label>

            <select
                value={form.category}
                className="
                w-full
                bg-zinc-800
                p-3
                rounded-lg
                "
                onChange={(e) =>
                    setForm({
                        ...form,
                        category: e.target.value,
                    })
                }
            >

                <option value="">
                    Selecciona una categoría
                </option>

                {categories.map((category) => (
                    <option
                        key={category.id}
                        value={category.name}
                    >
                        {category.name}
                    </option>
                ))}

            </select>
            <label className="block text-sm text-zinc-400 mb-2">
                Presupuesto máximo
            </label>
            <input
                type="number"
                value={form.monthly_limit}
                placeholder="Ej: 5000"
                className="w-full bg-zinc-800 p-3 rounded-lg"
                onChange={(e) =>
                    setForm({
                        ...form,
                        monthly_limit: Number(
                            e.target.value
                        ),
                    })
                }
            />
            <label className="block text-sm text-zinc-400 mb-2">
                Día de inicio del ciclo
            </label>
            <input
                type="number"
                value={form.start_day}
                min={1}
                max={31}
                placeholder="Ej: 15"
                className="w-full bg-zinc-800 p-3 rounded-lg"
                onChange={(e) =>
                    setForm({
                        ...form,
                        start_day: Number(
                            e.target.value
                        ),
                    })
                }
            />
            <label className="block text-sm text-zinc-400 mb-2">
                Frecuencia del presupuesto
            </label>
            <select
                value={form.cycle_type}
                className="
                w-full
                bg-zinc-800
                p-3
                rounded-lg
                "
                onChange={(e) =>
                    setForm({
                        ...form,
                        cycle_type: e.target.value,
                    })
                }
            >

                <option value="weekly">
                    Semanal
                </option>

                <option value="biweekly">
                    Quincenal
                </option>

                <option value="monthly">
                    Mensual
                </option>

            </select>

            <button
                onClick={() => {

                    if (!form.category) {
                        alert(
                            "Selecciona una categoría"
                        );
                        return;
                    }

                    onSave(form);

                }}
                className="
                w-full
                bg-blue-600
                py-3
                rounded-lg
                "
            >
                {isEditing
                    ? "Guardar Cambios"
                    : "Guardar Budget"}
            </button>

        </div>
    );
}