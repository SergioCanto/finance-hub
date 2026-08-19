import { supabase } from "../lib/supabase";

export async function getMonthlyAnalytics() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id);

    if (error) throw error;

    return data;
}