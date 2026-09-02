import { supabase } from "../lib/supabase";

export async function getCreditCardBalances() {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: cards } =
        await supabase
            .from("credit_cards")
            .select("*")
            .eq("user_id", user?.id)
            .eq("is_active", true);

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

    const cardsWithBalance =
        cards?.map((card) => {

            const account =
                accounts?.find(
                    (a) =>
                        a.name ===
                        card.account_name
                );

            if (!account) {

                return {
                    ...card,
                    balance: 0,
                };

            }

            const accountTransactions =
                transactions?.filter(
                    (tx) =>
                        tx.account ===
                        account.name
                ) || [];

            const balance =
                accountTransactions.reduce(
                    (currentBalance, tx) => {

                        const amount =
                            Math.abs(
                                Number(
                                    tx.amount
                                )
                            );

                        return tx.type ===
                            "expense"
                            ? currentBalance + amount
                            : currentBalance - amount;

                    },
                    Number(
                        account.opening_balance || 0
                    )
                );

            return {
                ...card,
                balance,
            };

        }) || [];

    return cardsWithBalance;

}