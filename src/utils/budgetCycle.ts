export function getCurrentCycle(
    startDay: number,
    cycleType: string
) {
    const today = new Date();

    let startDate: Date;
    let endDate: Date;

    if (cycleType === "weekly") {

        startDate = new Date(today);
        startDate.setDate(
            today.getDate() - 7
        );

        endDate = today;

        return {
            startDate,
            endDate,
        };
    }

    if (cycleType === "biweekly") {

        startDate = new Date(today);
        startDate.setDate(
            today.getDate() - 15
        );

        endDate = today;

        return {
            startDate,
            endDate,
        };
    }

    if (today.getDate() >= startDay) {

        startDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            startDay
        );

        endDate = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            startDay - 1
        );

    } else {

        startDate = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            startDay
        );

        endDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            startDay - 1
        );
    }

    return {
        startDate,
        endDate,
    };
}