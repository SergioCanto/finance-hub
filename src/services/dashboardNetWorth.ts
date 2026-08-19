import { getNetWorth } from "./networth";

export async function getNetWorthMetric() {
    const data = await getNetWorth();

    return data.netWorth;
}