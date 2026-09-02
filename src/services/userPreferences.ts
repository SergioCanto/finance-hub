import { supabase } from "../lib/supabase";

export async function getUserPreferences() {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data } =
        await supabase
            .from("user_preferences")
            .select("*")
            .eq("user_id", user?.id)
            .single();

    return data;
}

export async function saveUserPreferences(
    periodStartDay: number
) {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    await supabase
        .from("user_preferences")
        .upsert({
            user_id: user?.id,
            period_start_day:
                periodStartDay,
        });

}