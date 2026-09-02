export function getCurrentFinancialPeriod(
    periodStartDay: number
) {

    const now = new Date();

    let startDate =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            periodStartDay
        );

    if (
        now.getDate() <
        periodStartDay
    ) {

        startDate =
            new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                periodStartDay
            );

    }

    startDate.setHours(
        0, 0, 0, 0
    );

    const endDate =
        new Date(startDate);

    endDate.setMonth(
        endDate.getMonth() + 1
    );

    endDate.setDate(
        endDate.getDate() - 1
    );

    endDate.setHours(
        23, 59, 59, 999
    );

    return {
        startDate,
        endDate,
    };

}