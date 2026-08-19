import { supabase } from "../lib/supabase";
import {
    getMonthlyEquivalent
} from "../utils/budgetUtils";

export async function getBudgetPlanning() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: liabilityAccounts } =
        await supabase
            .from("accounts")
            .select("name")
            .eq("user_id", user?.id)
            .eq("type", "liability")
            .eq("is_active", true);

    const { data: budgets } =
        await supabase
            .from("budgets")
            .select("*")
            .eq("user_id", user?.id);

    const { data: transactions } =
        await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user?.id);

    const now = new Date();

    const income =
        transactions
            ?.filter((tx) => {

                const txDate =
                    new Date(
                        tx.transaction_date
                    );

                return (
                    tx.type === "income" &&
                    txDate.getMonth() ===
                    now.getMonth() &&
                    txDate.getFullYear() ===
                    now.getFullYear()
                );

            })
            .reduce(
                (sum, tx) =>
                    sum +
                    Number(tx.amount),
                0
            ) || 0;

    const budgetTotal =
        budgets?.reduce(
            (sum, budget) =>
                sum +
                getMonthlyEquivalent(
                    Number(
                        budget.monthly_limit
                    ),
                    budget.cycle_type
                ),
            0
        ) || 0;

    const liabilityExpenses =
        transactions
            ?.filter((tx) => {

                const txDate =
                    new Date(
                        tx.transaction_date
                    );

                const isCurrentMonth =
                    txDate.getMonth() ===
                    now.getMonth() &&
                    txDate.getFullYear() ===
                    now.getFullYear();

                const isLiabilityAccount =
                    liabilityAccounts?.some(
                        (account) =>
                            account.name ===
                            tx.account
                    );

                return (
                    tx.type === "expense" &&
                    isCurrentMonth &&
                    isLiabilityAccount
                );

            })
            .reduce(
                (sum, tx) =>
                    sum +
                    Math.abs(
                        Number(tx.amount)
                    ),
                0
            ) || 0;

    const available =
        Math.max(
            income - budgetTotal,
            0
        );

    return {
        income,
        budgetTotal,
        liabilityExpenses,
        available,

        chartData: [
            ...(budgets || []).map(
                (budget) => ({
                    name:
                        budget.category,
                    value: getMonthlyEquivalent(
                        Number(
                            budget.monthly_limit
                        ),
                        budget.cycle_type
                    ),
                })
            ),

            {
                name: "Disponible",
                value: available,
            },
        ],
    };
}