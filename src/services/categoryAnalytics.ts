import { supabase } from "../lib/supabase";

export async function getTopCategories() {
    const { data } = await supabase
        .from("transactions")
        .select("*");

    const grouped: Record<
        string,
        number
    > = {};

    data?.forEach((tx) => {
        if (tx.type === "expense") {
            grouped[tx.category] =
                (grouped[tx.category] || 0) +
                Math.abs(Number(tx.amount));
        }
    });

    return Object.entries(grouped)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
}