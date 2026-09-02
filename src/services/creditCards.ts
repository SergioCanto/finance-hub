import { supabase } from "../lib/supabase";

export async function getCreditCards() {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } =
        await supabase
            .from("credit_cards")
            .select("*")
            .eq("user_id", user?.id)
            .eq("is_active", true);

    if (error) throw error;

    return data;
}

export async function createCreditCard(
    card: {
        card_name: string;
        account_name: string;
        statement_day: number;
        payment_due_day: number;
    }
) {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } =
        await supabase
            .from("credit_cards")
            .insert({
                ...card,
                user_id: user?.id,
            })
            .select();

    if (error) throw error;

    return data;
}

export async function updateCreditCard(
    id: string,
    card: {
        card_name: string;
        account_name: string;
        statement_day: number;
        payment_due_day: number;
    }
) {

    const { data, error } =
        await supabase
            .from("credit_cards")
            .update(card)
            .eq("id", id)
            .select();

    if (error) throw error;

    return data;

}

export async function deleteCreditCard(
    id: string
) {

    const { error } =
        await supabase
            .from("credit_cards")
            .delete()
            .eq("id", id);

    if (error) throw error;

}