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

            const currentBalance =
                accountTransactions.reduce(
                    (balance, tx) => {

                        const amount =
                            Math.abs(
                                Number(tx.amount)
                            );

                        if (
                            account.type === "asset"
                        ) {

                            return tx.type === "income"
                                ? balance + amount
                                : balance - amount;

                        }

                        if (
                            account.type === "liability"
                        ) {

                            return tx.type === "expense"
                                ? balance + amount
                                : balance - amount;

                        }

                        return balance;

                    },
                    Number(
                        account.opening_balance || 0
                    )
                );

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