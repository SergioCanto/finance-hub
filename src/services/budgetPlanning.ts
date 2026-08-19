import { supabase } from "../lib/supabase";

export async function getBudgetPlanning() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

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
                Number(
                    budget.monthly_limit
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
        available,

        chartData: [
            ...(budgets || []).map(
                (budget) => ({
                    name:
                        budget.category,
                    value: Number(
                        budget.monthly_limit
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