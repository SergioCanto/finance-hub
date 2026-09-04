import { supabase } from "../lib/supabase";

export async function getAccounts() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_active", true)
        .order("name");

    if (error) throw error;

    return data;
}
export async function createAccount(
    account: {
        name: string;
        type: string;
        opening_balance: number;
        include_in_net_worth: boolean;
    }
) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("accounts")
        .insert({
            ...account,
            is_active: true,
            user_id: user?.id,
        })
        .select();

    if (error) throw error;

    return data;
}
export async function updateAccount(
    id: string,
    account: {
        name: string;
        type: string;
        opening_balance: number;
        include_in_net_worth: boolean;
    }
) {
    const { data, error } = await supabase
        .from("accounts")
        .update({
            name: account.name,
            type: account.type,
            opening_balance: account.opening_balance,
            include_in_net_worth:
                account.include_in_net_worth,
        })
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;
}
export async function archiveAccount(
    id: string
) {
    const { data, error } = await supabase
        .from("accounts")
        .update({
            is_active: false,
        })
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;
}

export async function getAccountsWithBalance() {

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

    return (
        accounts?.map((account) => {

            const accountTransactions =
                transactions?.filter(
                    (tx) =>
                        tx.account === account.name
                ) || [];

            const calculatedBalance =
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

                calculated_balance:
                    calculatedBalance,

                movement_total:
                    calculatedBalance -
                    Number(
                        account.opening_balance || 0
                    ),
            };

        }) || []
    );
}