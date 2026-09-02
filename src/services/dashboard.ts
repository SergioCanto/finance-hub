import { supabase } from "../lib/supabase";
import {
    getUserPreferences,
} from "./userPreferences";

import {
    getCurrentFinancialPeriod,
} from "../utils/financialPeriod";

export async function getDashboardMetrics() {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id);

    const { data: accounts } =
        await supabase
            .from("accounts")
            .select("name,type")
            .eq("user_id", user?.id)
            .eq("is_active", true);


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

    const periodTransactions =
        data?.filter((tx) => {

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
                txDate >= startDate &&
                txDate <= endDate
            );

        }) || [];

    const income =
        periodTransactions
            .filter((t) => {

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
            );

    const expenses =
        periodTransactions
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