import {
    getCreditCardInsights,
} from "./creditCardInsights";

export async function getUpcomingCardPayments() {

    const cards =
        await getCreditCardInsights();
    return cards
        .filter(
            card =>
                card.balance > 0
        )
        .sort(
            (a, b) =>
                a.daysRemaining -
                b.daysRemaining
        );

}