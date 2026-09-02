import { supabase } from "../lib/supabase";
import { getCurrentCycle }
    from "../utils/budgetCycle";

export async function getBudgets() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user?.id);

    if (error) throw error;

    return data;
}

export async function getBudgetStatus() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: budgets } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user?.id);

    const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id);

    return budgets?.map((budget) => {
        const cycle =
            getCurrentCycle(
                budget.start_day,
                budget.cycle_type
            )

        const spent =
            transactions
                ?.filter((tx) => {

                    if (
                        tx.category !== budget.category
                    ) {
                        return false;
                    }

                    if (
                        tx.type !== "expense"
                    ) {
                        return false;
                    }

                    const [
                        year,
                        month,
                        day,
                    ] = tx.transaction_date
                        .split("-")
                        .map(Number);

                    const txDate =
                        new Date(
                            year,
                            month - 1,
                            day
                        );

                    return (
                        txDate >= cycle.startDate &&
                        txDate <= cycle.endDate
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

        return {
            ...budget,
            spent,
            cycleStart:
                cycle.startDate,
            cycleEnd:
                cycle.endDate,
        };
    });
}

export async function createBudget(
    budget: {
        category: string;
        monthly_limit: number;
        start_day: number;
        cycle_type: string;
    }
) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } =
        await supabase
            .from("budgets")
            .insert({
                ...budget,
                user_id: user?.id,
            })
            .select();

    if (error) throw error;

    return data;
}

export async function updateBudget(
    id: string,
    budget: {
        category: string;
        monthly_limit: number;
        start_day: number;
        cycle_type: string;
    }
) {
    const { data, error } =
        await supabase
            .from("budgets")
            .update(budget)
            .eq("id", id)
            .select();

    if (error) throw error;

    return data;
}

export async function deleteBudget(
    id: string
) {
    const { error } =
        await supabase
            .from("budgets")
            .delete()
            .eq("id", id);

    if (error) throw error;
}