import { supabase } from "../lib/supabase";

export async function getDashboardMetrics() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id);

    const income = data
        ?.filter((t) => t.type === "income")
        .reduce((a, b) => a + Number(b.amount), 0);

    const expenses = data
        ?.filter((t) => t.type === "expense")
        .reduce(
            (a, b) => a + Math.abs(Number(b.amount)),
            0
        );

    return {
        income: income || 0,
        expenses: expenses || 0,
        balance: (income || 0) - (expenses || 0),
    };
}