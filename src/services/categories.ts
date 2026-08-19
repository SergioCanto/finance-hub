import { supabase } from "../lib/supabase";

export async function getCategories() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_active", true)
        .order("name");

    if (error) throw error;

    return data;
}

export async function createCategory(
    category: {
        name: string;
        type: string;
    }
) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("categories")
        .insert({
            ...category,
            is_active: true,
            user_id: user?.id,
        })
        .select();

    if (error) throw error;

    return data;
}

export async function updateCategory(
    id: string,
    category: {
        name: string;
        type: string;
    }
) {
    const { data, error } = await supabase
        .from("categories")
        .update(category)
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;
}

export async function archiveCategory(
    id: string
) {
    const { data, error } = await supabase
        .from("categories")
        .update({
            is_active: false,
        })
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;
}