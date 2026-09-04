import { supabase } from "../lib/supabase";

export async function completeGoal(
    goalId: string
) {
    const { data, error } = await supabase
        .from("goals")
        .update({
            completed: true,
        })
        .eq("id", goalId)
        .select();

    if (error) throw error;

    return data;
}

export async function deleteGoal(
    goalId: string
) {
    const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", goalId);

    if (error) throw error;
}

export async function getGoals() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user?.id);

    if (error) throw error;

    return data;
}

export async function createGoal(goal: {
    name: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
}) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("goals")
        .insert({
            ...goal,
            user_id: user?.id,
        })
        .select();

    if (error) throw error;

    return data;
}

export async function addContribution(
    goalId: string,
    contribution: number,
    currentAmount: number
) {
    const { data, error } = await supabase
        .from("goals")
        .update({
            current_amount:
                currentAmount + contribution,
        })
        .eq("id", goalId)
        .select();

    if (error) throw error;

    return data;
}

export async function updateGoal(
    goalId: string,
    goal: {
        name: string;
        target_amount: number;
        target_date: string;
    }
) {
    const { data, error } =
        await supabase
            .from("goals")
            .update({
                name: goal.name,
                target_amount:
                    goal.target_amount,
                target_date:
                    goal.target_date,
            })
            .eq("id", goalId)
            .select();

    if (error) throw error;

    return data;
}

export async function withdrawFromGoal(
    id: string,
    amount: number
) {

    const { data: goal, error } =
        await supabase
            .from("goals")
            .select("current_amount")
            .eq("id", id)
            .single();

    if (error) throw error;

    if (!goal) {
        throw new Error(
            "Meta no encontrada"
        );
    }

    const newAmount =
        Math.max(
            Number(goal.current_amount) -
            amount,
            0
        );

    const { data, error: updateError } =
        await supabase
            .from("goals")
            .update({
                current_amount:
                    newAmount,
            })
            .eq("id", id)
            .select();

    if (updateError) {
        throw updateError;
    }

    return data;
}