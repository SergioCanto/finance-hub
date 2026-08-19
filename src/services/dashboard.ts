import { supabase } from "../lib/supabase";

export async function getDashboardMetrics() {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id);

    const now = new Date();

    const currentMonthTransactions =
        data?.filter((tx) => {

            const txDate =
                new Date(
                    tx.transaction_date
                );

            return (
                txDate.getMonth() ===
                now.getMonth() &&
                txDate.getFullYear() ===
                now.getFullYear()
            );

        }) || [];

    const income =
        currentMonthTransactions
            .filter(
                (t) => t.type === "income"
            )
            .reduce(
                (sum, t) =>
                    sum + Number(t.amount),
                0
            );

    const expenses =
        currentMonthTransactions
            .filter(
                (t) => t.type === "expense"
            )
            .reduce(
                (sum, t) =>
                    sum +
                    Math.abs(
                        Number(t.amount)
                    ),
                0
            );

    return {
        income,
        expenses,
        balance:
            income - expenses,
    };
}