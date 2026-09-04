import { useEffect, useState } from "react";

import AccountForm from "../components/accounts/AccountForm";

import {
    getAccountsWithBalance,
    createAccount,
    updateAccount,
    archiveAccount,
} from "../services/accounts";

export default function Accounts() {
    const [accounts, setAccounts] =
        useState<any[]>([]);

    const [showModal, setShowModal] =
        useState(false);

    const [editingAccount,
        setEditingAccount] =
        useState<any>(null);

    useEffect(() => {
        loadAccounts();
    }, []);

    async function loadAccounts() {
        const data =
            await getAccountsWithBalance();

        setAccounts(
            data?.filter(
                (account) =>
                    account.is_active
            ) || []
        );
    }

    async function handleSave(
        account: {
            name: string;
            type: string;
            opening_balance: number;
            include_in_net_worth: boolean;
        }
    ) {
        if (editingAccount) {
            await updateAccount(
                editingAccount.id,
                account
            );
        } else {
            await createAccount(
                account
            );
        }

        setEditingAccount(null);

        setShowModal(false);

        loadAccounts();
    }

    async function handleDelete(
        id: string
    ) {
        const confirmed =
            window.confirm(
                "¿Archivar cuenta?"
            );

        if (!confirmed) return;

        await archiveAccount(id);

        loadAccounts();
    }

    function handleEdit(
        id: string
    ) {
        const account =
            accounts.find(
                (a) => a.id === id
            );

        setEditingAccount(account);

        setShowModal(true);
    }

    return (
        <div>
            <div className="flex justify-between mb-6">

                <h1 className="text-3xl font-bold">
                    Cuentas
                </h1>

                <button
                    onClick={() => {
                        setEditingAccount(null);
                        setShowModal(true);
                    }}
                    className="
                    bg-blue-600
                    px-4
                    py-2
                    rounded-lg
                    "
                >
                    + Nueva Cuenta
                </button>

            </div>

            {showModal && (
                <div className="
                fixed
                inset-0
                bg-black/70
                flex
                items-center
                justify-center
                ">

                    <div className="
                    bg-zinc-900
                    p-6
                    rounded-xl
                    w-[500px]
                    ">

                        <div className="
                        flex
                        justify-between
                        mb-4
                        ">

                            <h2 className="text-xl font-semibold">
                                {editingAccount
                                    ? "Editar Cuenta"
                                    : "Nueva Cuenta"}
                            </h2>

                            <button
                                onClick={() => {
                                    setEditingAccount(null);
                                    setShowModal(false);
                                }}
                            >
                                ✕
                            </button>

                        </div>

                        <AccountForm
                            onSave={handleSave}
                            initialData={
                                editingAccount
                                    ? {
                                        name:
                                            editingAccount.name,
                                        type:
                                            editingAccount.type,
                                        opening_balance:
                                            editingAccount.opening_balance,
                                        include_in_net_worth:
                                            editingAccount.include_in_net_worth,
                                    }
                                    : undefined
                            }
                            isEditing={
                                !!editingAccount
                            }
                        />

                    </div>

                </div>
            )}

            <div className="space-y-3">

                {accounts.map((account) => (

                    <div
                        key={account.id}
                        className="
                        bg-zinc-900
                        rounded-xl
                        p-4
                        flex
                        justify-between
                        items-center
                        "
                    >

                        <div>

                            <h3 className="font-semibold">
                                {account.name}
                            </h3>

                            <p className="text-sm text-zinc-400">
                                {account.type === "asset"
                                    ? "Activo"
                                    : "Pasivo"}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                                Saldo inicial
                            </p>

                            <p className="text-zinc-300">
                                $
                                {Number(
                                    account.opening_balance
                                ).toLocaleString()}
                            </p>

                            <p className="text-xs text-zinc-500 mt-2">
                                Movimientos
                            </p>

                            <p
                                className={
                                    account.movement_total >= 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                }
                            >
                                $
                                {Number(
                                    account.movement_total
                                ).toLocaleString()}
                            </p>

                            <p className="text-xs text-zinc-500 mt-2">
                                Saldo actual
                            </p>

                            <p className="text-green-400 font-semibold">
                                $
                                {Number(
                                    account.calculated_balance
                                ).toLocaleString()}
                            </p>

                        </div>

                        <div className="flex gap-4">

                            <button
                                onClick={() =>
                                    handleEdit(
                                        account.id
                                    )
                                }
                            >
                                ✏️
                            </button>

                            <button
                                onClick={() =>
                                    handleDelete(
                                        account.id
                                    )
                                }
                            >
                                🗑️
                            </button>

                        </div>

                    </div>

                ))}

            </div>
        </div>
    );
}