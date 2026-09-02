import { useEffect, useState } from "react";

import {
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
} from "../services/creditCards";

import {
    getCreditCardBalances,
} from "../services/creditCardBalances";

import {
    getAccounts,
} from "../services/accounts";

import {
    CreditCard,
    Pencil,
    Trash2,
} from "lucide-react";

export default function CreditCards() {

    const [cards, setCards] =
        useState<any[]>([]);

    const [accounts, setAccounts] =
        useState<any[]>([]);

    const [showForm, setShowForm] =
        useState(false);

    const [
        editingCard,
        setEditingCard,
    ] = useState<any>(null);

    const [form, setForm] =
        useState({
            card_name: "",
            account_name: "",
            statement_day: 1,
            payment_due_day: 15,
        });

    useEffect(() => {
        loadCards();
        loadAccounts();
    }, []);

    async function loadCards() {

        const data =
            await getCreditCardBalances();

        setCards(data || []);

    }

    async function loadAccounts() {

        const data =
            await getAccounts();

        setAccounts(
            data?.filter(
                account =>
                    account.type ===
                    "liability"
            ) || []
        );

    }

    async function handleSave() {

        await createCreditCard(form);

        setShowForm(false);

        setForm({
            card_name: "",
            account_name: "",
            statement_day: 1,
            payment_due_day: 15,
        });

        loadCards();

    }

    async function handleEdit(
        card: any
    ) {

        setEditingCard(card);

        setForm({
            card_name:
                card.card_name,

            account_name:
                card.account_name,

            statement_day:
                card.statement_day,

            payment_due_day:
                card.payment_due_day,
        });

        setShowForm(true);

    }

    async function handleUpdate() {

        await updateCreditCard(
            editingCard.id,
            form
        );

        setEditingCard(null);

        setShowForm(false);

        loadCards();

    }

    async function handleDelete(
        id: string
    ) {

        const confirmed =
            window.confirm(
                "¿Eliminar esta tarjeta?"
            );

        if (!confirmed) return;

        await deleteCreditCard(id);

        loadCards();

    }

    return (
        <div>

            <div className="flex justify-between mb-6">

                <h1 className="text-3xl font-bold">
                    Tarjetas de Crédito
                </h1>

                <button
                    onClick={() => {

                        setEditingCard(null);

                        setForm({
                            card_name: "",
                            account_name: "",
                            statement_day: 1,
                            payment_due_day: 15,
                        });

                        setShowForm(!showForm);

                    }}
                    className="
                    bg-blue-600
                    px-4
                    py-2
                    rounded-lg
                    "
                >
                    {
                        editingCard
                            ? "Editar Tarjeta"
                            : "Nueva Tarjeta"
                    }
                </button>

            </div>

            {showForm && (

                <div className="
                    bg-zinc-900
                    p-6
                    rounded-xl
                    mb-6
                ">

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nombre de la tarjeta"
                            className="
                            bg-zinc-800
                            p-3
                            rounded
                            "
                            value={form.card_name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    card_name:
                                        e.target.value,
                                })
                            }
                        />

                        <select
                            value={form.account_name}
                            className="
                            bg-zinc-800
                            p-3
                            rounded
                            "
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    account_name:
                                        e.target.value,
                                })
                            }
                        >

                            <option value="">
                                Cuenta asociada
                            </option>

                            {accounts.map(
                                account => (

                                    <option
                                        key={account.id}
                                        value={
                                            account.name
                                        }
                                    >
                                        {account.name}
                                    </option>

                                )
                            )}

                        </select>

                        <select
                            value={form.statement_day}
                            className="bg-zinc-800 p-3 rounded"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    statement_day:
                                        Number(
                                            e.target.value
                                        ),
                                })
                            }
                        >

                            {Array.from(
                                { length: 31 },
                                (_, i) => i + 1
                            ).map(day => (

                                <option
                                    key={day}
                                    value={day}
                                >
                                    Corte día {day}
                                </option>

                            ))}

                        </select>

                        <select
                            value={form.payment_due_day}
                            className="bg-zinc-800 p-3 rounded"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    payment_due_day:
                                        Number(
                                            e.target.value
                                        ),
                                })
                            }
                        >

                            {Array.from(
                                { length: 31 },
                                (_, i) => i + 1
                            ).map(day => (

                                <option
                                    key={day}
                                    value={day}
                                >
                                    Pago día {day}
                                </option>

                            ))}

                        </select>

                    </div>

                    <button
                        onClick={
                            editingCard
                                ? handleUpdate
                                : handleSave
                        }
                        className="
                        mt-4
                        bg-green-600
                        px-4
                        py-2
                        rounded-lg
                        "
                    >
                        {
                            editingCard
                                ? "Guardar Cambios"
                                : "Guardar Tarjeta"
                        }
                    </button>

                </div>

            )}

            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
            ">

                {cards.map(card => {

                    const today =
                        new Date();

                    const nextCutDate =
                        new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            card.statement_day
                        );

                    if (nextCutDate < today) {

                        nextCutDate.setMonth(
                            nextCutDate.getMonth() + 1
                        );

                    }

                    const nextPaymentDate =
                        new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            card.payment_due_day
                        );

                    if (nextPaymentDate < today) {

                        nextPaymentDate.setMonth(
                            nextPaymentDate.getMonth() + 1
                        );

                    }

                    return (


                        <div
                            key={card.id}
                            className="
                        bg-zinc-900
                        p-6
                        rounded-xl
                        "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                bg-blue-600/20
                                p-3
                                rounded-xl
                                "
                                >
                                    <CreditCard
                                        size={20}
                                        className="text-blue-400"
                                    />
                                </div>

                                <div>

                                    <h3 className="font-bold text-xl">
                                        {card.card_name}
                                    </h3>

                                    <p className="text-zinc-500 text-sm">
                                        {card.account_name}
                                    </p>

                                </div>

                            </div>

                            <div
                                className="
                            mt-6
                            bg-zinc-800/50
                            rounded-xl
                            p-4
                            "
                            >

                                <p className="text-zinc-400 text-sm">
                                    Saldo Actual
                                </p>

                                <p
                                    className="
                                text-4xl
                                font-bold
                                text-red-400
                                mt-1
                                "
                                >
                                    $
                                    {Number(
                                        card.balance
                                    ).toLocaleString()}
                                </p>

                            </div>

                            <div className="border-t border-zinc-800 my-5" />

                            <p className="mt-3 text-zinc-400">
                                Cuenta:
                                {" "}
                                {card.account_name}
                            </p>

                            <div className="grid grid-cols-2 gap-4">

                                <div
                                    className="
                                bg-zinc-800/40
                                p-4
                                rounded-xl
                                "
                                >

                                    <p className="text-zinc-500 text-sm">
                                        Próximo Corte
                                    </p>

                                    <p className="font-bold text-xl">
                                        {nextCutDate.toLocaleDateString(
                                            "es-MX",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                            }
                                        )}
                                    </p>

                                </div>

                                <div
                                    className="
                                bg-zinc-800/40
                                p-4
                                rounded-xl
                                "
                                >

                                    <p className="text-zinc-500 text-sm">
                                        Próximo Pago
                                    </p>

                                    <p className="font-bold text-xl">
                                        {nextPaymentDate.toLocaleDateString(
                                            "es-MX",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                            }
                                        )}
                                    </p>

                                </div>

                            </div>
                            <div className="flex gap-3 mt-6">

                                <button
                                    onClick={() =>
                                        handleEdit(card)
                                    }
                                    className="
                                        flex-1
                                        border
                                        border-blue-500
                                        text-blue-400
                                        py-2
                                        rounded-lg
                                        hover:bg-blue-500/10
                                        "
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        <Pencil size={16} />
                                        Editar
                                    </div>
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(card.id)
                                    }
                                    className="
                                        flex-1
                                        border
                                        border-red-500
                                        text-red-400
                                        py-2
                                        rounded-lg
                                        hover:bg-red-500/10
                                        "
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        <Trash2 size={16} />
                                        Eliminar
                                    </div>
                                </button>

                            </div>

                        </div>

                    );
                })}

            </div>

        </div>
    );
}