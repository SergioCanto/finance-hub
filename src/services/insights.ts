import { supabase } from "../lib/supabase";
import {
    getUserPreferences,
} from "./userPreferences";

import {
    getCurrentFinancialPeriod,
} from "../utils/financialPeriod";

import {
    getCreditCardInsights,
} from "./creditCardInsights";



export async function getInsights() {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const insights: string[] = [];

    const preferences =
        await getUserPreferences();

    const periodStartDay =
        preferences?.period_start_day || 1;

    const {
        startDate,
        endDate,
    } =
        getCurrentFinancialPeriod(
            periodStartDay
        );

    const { data: transactions } =
        await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user?.id);

    const periodTransactions =
        transactions?.filter((tx) => {

            const txDate =
                new Date(
                    tx.transaction_date
                );

            return (
                txDate >= startDate &&
                txDate <= endDate
            );

        }) || [];

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

    const creditCardInsights =
        await getCreditCardInsights();

    const { data: accounts } =
        await supabase
            .from("accounts")
            .select("name,type")
            .eq("user_id", user?.id)
            .eq("is_active", true);

    const income =
        periodTransactions
            ?.filter((t) => {

                if (
                    t.type !== "income"
                ) {
                    return false;
                }

                const account =
                    accounts?.find(
                        (a) =>
                            a.name ===
                            t.account
                    );

                return (
                    account?.type !==
                    "liability"
                );

            })
            .reduce(
                (sum, t) =>
                    sum +
                    Number(t.amount),
                0
            ) || 0;

    const expenses =
        periodTransactions
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
        `✅ Tu tasa de ahorro de este periodo es ${savingsRate.toFixed(
            0
        )
        }% `
    );

    budgets?.forEach((budget) => {
        const spent =
            periodTransactions
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
                )
                }% del presupuesto`
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
            )
            }%)`
        );
    }

    const categories: Record<
        string,
        number
    > = {};

    periodTransactions?.forEach((tx) => {
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

    creditCardInsights.forEach(
        (card) => {

            if (
                card.balance <= 0
            ) {
                return;
            }

            const dueDate =
                card.paymentDate
                    .toLocaleDateString(
                        "es-MX",
                        {
                            day: "2-digit",
                            month: "short",
                        }
                    );

            if (
                card.daysRemaining <= 0
            ) {

                insights.push(
                    `❌ La fecha de pago de ${card.cardName} ya venció. Revisa tu saldo de $${card.balance.toLocaleString()}.`
                );

                return;
            }

            if (
                card.daysRemaining <= 3
            ) {

                insights.push(
                    `🔥 Tu pago de ${card.cardName} vence en ${card.daysRemaining} días. Paga $${card.balance.toLocaleString()} antes del ${dueDate}.`
                );

                return;
            }

            if (
                card.daysRemaining <= 7
            ) {

                insights.push(
                    `🚨 ${card.cardName} vence en ${card.daysRemaining} días. Considera pagar $${card.balance.toLocaleString()} antes del ${dueDate}.`
                );

                return;
            }

            insights.push(
                `💳 Paga $${card.balance.toLocaleString()} de ${card.cardName} antes del ${dueDate} para evitar intereses.`
            );

        }
    );

    return insights;
}