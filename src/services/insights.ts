import { supabase } from "../lib/supabase";

export async function getInsights() {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const insights: string[] = [];

    const { data: transactions } =
        await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user?.id);

    const { data: budgets } =
        await supabase
            .from("budgets")
            .select("*")
            .eq("user_id", user?.id);

    const { data: goals } =
        await supabase
            .from("goals")
            .select("*")
            .eq("user_id", user?.id);

    const income =
        transactions
            ?.filter((t) => t.type === "income")
            .reduce(
                (sum, t) => sum + Number(t.amount),
                0
            ) || 0;

    const expenses =
        transactions
            ?.filter((t) => t.type === "expense")
            .reduce(
                (sum, t) =>
                    sum + Math.abs(Number(t.amount)),
                0
            ) || 0;

    const savingsRate =
        income > 0
            ? (income - expenses) / income * 100
            : 0;

    insights.push(
        `✅ Tu tasa de ahorro es ${savingsRate.toFixed(
            0
        )}%`
    );

    budgets?.forEach((budget) => {
        const spent =
            transactions
                ?.filter(
                    (tx) =>
                        tx.type === "expense" &&
                        tx.category === budget.category
                )
                .reduce(
                    (sum, tx) =>
                        sum + Math.abs(Number(tx.amount)),
                    0
                ) || 0;

        const percent =
            (spent / budget.monthly_limit) * 100;

        if (percent > 80) {
            insights.push(
                `⚠️ ${budget.category} ha consumido ${percent.toFixed(
                    0
                )}% del presupuesto`
            );
        }
    });

    if (goals?.length) {
        const bestGoal = [...goals].sort(
            (a, b) =>
                b.current_amount /
                b.target_amount -
                a.current_amount /
                a.target_amount
        )[0];

        const progress =
            (bestGoal.current_amount /
                bestGoal.target_amount) *
            100;

        insights.push(
            `🎯 Tu meta más avanzada es ${bestGoal.name} (${progress.toFixed(
                0
            )}%)`
        );
    }

    const categories: Record<
        string,
        number
    > = {};

    transactions?.forEach((tx) => {
        if (tx.type === "expense") {
            categories[tx.category] =
                (categories[tx.category] || 0) +
                Math.abs(Number(tx.amount));
        }
    });

    const topCategory =
        Object.entries(categories).sort(
            (a, b) => b[1] - a[1]
        )[0];

    if (topCategory) {
        insights.push(
            `📉 La categoría de mayor gasto es ${topCategory[0]} ($${topCategory[1].toLocaleString()})`
        );
    }

    return insights;
}