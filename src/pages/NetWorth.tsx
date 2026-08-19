import { useEffect, useState } from "react";
import { getNetWorth } from "../services/networth";

export default function NetWorth() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const result = await getNetWorth();
        setData(result);
    }

    if (!data) return null;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                Net Worth
            </h1>

            <div
                className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-6
                "
            >

                <div className="bg-zinc-900 p-6 rounded-xl">
                    <p>Activos</p>

                    <h2 className="text-3xl text-green-400 font-bold">
                        $
                        {data.assets.toLocaleString()}
                    </h2>
                </div>

                <div className="bg-zinc-900 p-6 rounded-xl">
                    <p>Pasivos</p>

                    <h2 className="text-3xl text-red-400 font-bold">
                        $
                        {data.liabilities.toLocaleString()}
                    </h2>
                </div>

                <div className="bg-zinc-900 p-6 rounded-xl">
                    <p>Patrimonio Neto</p>

                    <h2 className="text-3xl text-blue-400 font-bold">
                        $
                        {data.netWorth.toLocaleString()}
                    </h2>
                </div>

            </div>
        </div>
    );
}