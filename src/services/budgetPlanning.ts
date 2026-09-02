import { supabase } from "../lib/supabase";
import {
    getMonthlyEquivalent
} from "../utils/budgetUtils";
import {
    getUserPreferences,
} from "./userPreferences";

import {
    getCurrentFinancialPeriod,
} from "../utils/financialPeriod";

export async function getBudgetPlanning() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

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

    const { data: liabilityAccounts } =
        await supabase
            .from("accounts")
            .select("name")
            .eq("user_id", user?.id)
            .eq("type", "liability")
            .eq("is_active", true);

    const liabilityAccountNames =
        liabilityAccounts?.map(
            (account) =>
                account.name
        ) || [];

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

    const income =
        transactions
            ?.filter((tx) => {

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
                    tx.type === "income" &&
                    !liabilityAccountNames.includes(
                        tx.account
                    ) &&
                    txDate >= startDate &&
                    txDate <= endDate
                );

            }).reduce(
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

                const isCurrentPeriod =
                    txDate >= startDate &&
                    txDate <= endDate;

                const isLiabilityAccount =
                    liabilityAccounts?.some(
                        (account) =>
                            account.name ===
                            tx.account
                    );

                return (
                    tx.type === "expense" &&
                    isCurrentPeriod &&
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