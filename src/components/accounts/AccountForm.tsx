import { useEffect, useState } from "react";

type Props = {
    onSave: (account: {
        name: string;
        type: string;
        opening_balance: number;
    }) => Promise<void>;

    initialData?: {
        name: string;
        type: string;
        opening_balance: number;
    };

    isEditing?: boolean;
};

export default function AccountForm({
    onSave,
    initialData,
    isEditing,
}: Props) {
    const [form, setForm] = useState({
        name: "",
        type: "asset",
        opening_balance: "",
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                ...initialData,
                opening_balance:
                    String(
                        initialData.opening_balance
                    ),
            });
        }
    }, [initialData]);

    return (
        <div className="space-y-4">

            <div>
                <label className="block text-sm text-zinc-400 mb-2">
                    Nombre de la cuenta
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
                    <option value="asset">
                        Activo
                    </option>

                    <option value="liability">
                        Pasivo
                    </option>
                </select>
            </div>

            <div>
                <label className="block text-sm text-zinc-400 mb-2">
                    Saldo inicial
                </label>

                <input
                    type="number"
                    value={form.opening_balance}
                    placeholder="25000"
                    className="w-full bg-zinc-800 p-3 rounded-lg"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            opening_balance:
                                e.target.value,
                        })
                    }
                />
            </div>

            <button
                className="
                w-full
                bg-blue-600
                py-3
                rounded-lg
                "
                onClick={() =>
                    onSave({
                        ...form,
                        opening_balance:
                            Number(
                                form.opening_balance || 0
                            ),
                    })
                }
            >
                {isEditing
                    ? "Guardar Cambios"
                    : "Crear Cuenta"}
            </button>

        </div>
    );
}