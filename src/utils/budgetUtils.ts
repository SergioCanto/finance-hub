export function getMonthlyEquivalent(
    amount: number,
    cycleType: string
) {
    switch (cycleType) {

        case "weekly":
            return amount * 52 / 12;

        case "biweekly":
            return amount * 26 / 12;

        case "monthly":
            return amount;

        case "bimonthly":
            return amount / 2;

        case "semiannual":
            return amount / 6;

        case "annual":
            return amount / 12;

        default:
            return amount;
    }
}