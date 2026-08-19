import { useEffect, useState } from "react";

type Props = {
    onSave: (category: {
        name: string;
        type: string;
    }) => Promise<void>;

    initialData?: {
        name: string;
        type: string;
    };

    isEditing?: boolean;
};

export default function CategoryForm({
    onSave,
    initialData,
    isEditing,
}: Props) {
    const [form, setForm] = useState({
        name: "",
        type: "expense",
    });

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        }
    }, [initialData]);

    return (
        <div className="space-y-4">

            <div>
                <label className="block text-sm text-zinc-400 mb-2">
                    Nombre
                </label>

                <input
                    type="text"
                    value={form.name}
                    className="w-full bg-zinc-800 p-3 rounded-lg"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label className="block text-sm text-zinc-400 mb-2">
                    Tipo
                </label>

                <select
                    value={form.type}
                    className="w-full bg-zinc-800 p-3 rounded-lg"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            type: e.target.value,
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
            </div>

            <button
                onClick={() => onSave(form)}
                className="
                w-full
                bg-blue-600
                py-3
                rounded-lg
                "
            >
                {isEditing
                    ? "Guardar Cambios"
                    : "Crear Categoría"}
            </button>

        </div>
    );
}