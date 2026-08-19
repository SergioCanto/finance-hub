import { supabase } from "../lib/supabase";

export async function getTransactions() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("transaction_date", {
            ascending: false,
        });

    if (error) throw error;

    return data;
}

export async function createTransaction(
    transaction: {
        transaction_date: string;
        description: string;
        amount: number;
        type: string;
        category: string;
        account: string;
    }
) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("transactions")
        .insert({
            ...transaction,
            user_id: user?.id, })
        .select();

    if (error) throw error;

    return data;
}

export async function deleteTransaction(
    id: string
) {
    const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

    if (error) throw error;
}