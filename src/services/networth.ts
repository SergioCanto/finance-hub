import { supabase } from "../lib/supabase";

export async function getNetWorth() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: accounts } =
        await supabase
            .from("accounts")
            .select("*")
            .eq("user_id", user?.id)
            .eq("is_active", true);

    const { data: transactions } =
        await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user?.id);

    const accountsWithBalance =
        accounts?.map((account) => {

            const accountTransactions =
                transactions?.filter(
                    (tx) =>
                        tx.account === account.name
                ) || [];

            const movementTotal =
                accountTransactions.reduce(
                    (sum, tx) => {

                        const amount =
                            Number(tx.amount);

                        return sum + amount;

                    },
                    0
                );

            const currentBalance =
                Number(
                    account.opening_balance || 0
                ) +
                movementTotal;

            return {
                ...account,
                currentBalance,
            };
        }) || [];

    const assets =
        accountsWithBalance
            .filter(
                (account) =>
                    account.type === "asset"
            )
            .reduce(
                (sum, account) =>
                    sum + account.currentBalance,
                0
            );

    const liabilities =
        accountsWithBalance
            .filter(
                (account) =>
                    account.type === "liability"
            )
            .reduce(
                (sum, account) =>
                    sum + account.currentBalance,
                0
            );

    return {
        assets,
        liabilities,
        netWorth:
            assets - liabilities,
        accounts:
            accountsWithBalance,
    };
}