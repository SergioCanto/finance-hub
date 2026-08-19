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
    }
) {
    const { data, error } = await supabase
        .from("accounts")
        .update(account)
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

            const movementTotal =
                accountTransactions.reduce(
                    (sum, tx) =>
                        sum + Number(tx.amount),
                    0
                );

            return {
                ...account,

                calculated_balance:
                    Number(
                        account.opening_balance || 0
                    ) + movementTotal,

                movement_total:
                    movementTotal,
            };

        }) || []
    );
}