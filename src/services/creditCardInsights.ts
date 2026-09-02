import {
    getCreditCardBalances,
} from "./creditCardBalances";

export async function getCreditCardInsights() {

    const cards =
        await getCreditCardBalances();

    const today =
        new Date();

    return cards.map(card => {

        const nextPaymentDate =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                card.payment_due_day
            );

        if (
            nextPaymentDate < today
        ) {

            nextPaymentDate.setMonth(
                nextPaymentDate.getMonth() + 1
            );

        }

        const daysRemaining =
            Math.ceil(
                (
                    nextPaymentDate.getTime() -
                    today.getTime()
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );

        return {

            cardName:
                card.card_name,

            balance:
                Number(card.balance),

            paymentDate:
                nextPaymentDate,

            daysRemaining,

        };

    });

}