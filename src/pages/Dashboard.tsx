import { useEffect, useState } from "react";
import { getDashboardMetrics } from "../services/dashboard";
import { getMonthlyAnalytics } from "../services/analytics";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";
import { getNetWorthMetric } from "../services/dashboardNetWorth";
import { getInsights } from "../services/insights";
import BudgetPlanningChart
    from "../components/dashboard/BudgetPlanningChart";

import {
    getBudgetPlanning,
} from "../services/budgetPlanning";

import {
    getUserPreferences,
    saveUserPreferences,
} from "../services/userPreferences";

import {
    getCurrentFinancialPeriod,
} from "../utils/financialPeriod";

export default function Dashboard() {
    const [metrics, setMetrics] = useState({
        income: 0,
        expenses: 0,
        balance: 0,
    });
    const [chartData, setChartData] = useState([]);
    const savingsRate =
        metrics.income > 0
            ? ((metrics.balance / metrics.income) * 100)
                .toFixed(1)
            : 0;
    const [netWorth, setNetWorth] = useState(0);
    const [insights, setInsights] =
        useState<string[]>([]);
    const [
        budgetPlanning,
        setBudgetPlanning,
    ] = useState<any>(null);
    const [
        periodStartDay,
        setPeriodStartDay,
    ] = useState(1);


    useEffect(() => {
        loadPreferences();
        loadMetrics();
        loadAnalytics();
        loadNetWorth();
        loadInsights();
        loadBudgetPlanning();
    }, []);
    async function loadPreferences() {

        const preferences =
            await getUserPreferences();

        if (
            preferences?.period_start_day
        ) {

            setPeriodStartDay(
                preferences.period_start_day
            );
        }
    }
    async function loadNetWorth() {
        const worth =
            await getNetWorthMetric();

        setNetWorth(worth);
    }
    async function loadInsights() {
        const result =
            await getInsights();

        setInsights(result);
    }
    async function loadBudgetPlanning() {

        const data =
            await getBudgetPlanning();

        setBudgetPlanning(data);
    }
    async function loadAnalytics() {
        const data = await getMonthlyAnalytics();

        const grouped = data.reduce((acc: any, tx: any) => {
            const month = tx.transaction_date.slice(0, 7);

            if (!acc[month]) {
                acc[month] = {
                    month,
                    income: 0,
                    expense: 0,
                };
            }

            if (tx.type === "income") {
                acc[month].income += Number(tx.amount);
            }

            if (tx.type === "expense") {
                acc[month].expense += Math.abs(
                    Number(tx.amount)
                );
            }

            return acc;
        }, {});

        setChartData(Object.values(grouped));
    }

    async function loadMetrics() {
        const data = await getDashboardMetrics();
        setMetrics(data);
    }
    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Buenos días"
            : hour < 19
                ? "Buenas tardes"
                : "Buenas noches";

    const {
        startDate,
        endDate } =
        getCurrentFinancialPeriod(periodStartDay
        );

    const periodLabel =
        `${startDate.toLocaleDateString(
            "es-MX",
            {
                day: "numeric",
                month: "short",
            }
        )} - ${endDate.toLocaleDateString(
            "es-MX",
            {
                day: "numeric",
                month: "short",
            }
        )}`;

    let planningMessage = "";

    if (budgetPlanning) {

        if (
            budgetPlanning.budgetTotal >
            budgetPlanning.income
        ) {

            planningMessage =
                `⚠️ Tus presupuestos exceden tus ingresos por $${(
                    budgetPlanning.budgetTotal -
                    budgetPlanning.income
                ).toLocaleString()}.`;

        } else {

            planningMessage =
                `Tienes $${budgetPlanning.available.toLocaleString()} disponibles para ahorrar este periodo.`;

        }
    }

    return (
        <div>
            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    {greeting}
                </h1>

                <div className="mt-3">

                    <p className="text-zinc-400">
                        Periodo: {periodLabel}
                    </p>

                    <div className="mt-3">

                        <label
                            className="
                            text-sm
                            text-zinc-400
                            mr-3
                            "
                        >
                            Inicio del periodo
                        </label>

                        <select
                            value={periodStartDay}
                            className="
                            bg-zinc-800
                            px-3
                            py-2
                            rounded-lg
                            "
                            onChange={async (e) => {

                                const day =
                                    Number(
                                        e.target.value
                                    );

                                setPeriodStartDay(
                                    day
                                );

                                await saveUserPreferences(
                                    day
                                );

                            }}
                        >

                            {Array.from(
                                { length: 28 },
                                (_, i) => i + 1
                            ).map((day) => (

                                <option
                                    key={day}
                                    value={day}
                                >
                                    Día {day}
                                </option>

                            ))}

                        </select>

                    </div>

                </div>

                {planningMessage && (

                    <p className="
                        text-zinc-400
                        mt-2
                        ">
                        {planningMessage}
                    </p>

                )}

            </div>

            <div
                className="
                flex
                gap-4
                overflow-x-auto
                no-scrollbar
                snap-x
                snap-mandatory
                pb-2
                xl:grid
                xl:grid-cols-5
                "
            >

                <div
                    className="
                    bg-zinc-900
                    p-6
                    rounded-xl
                    snap-center
                    min-w-[280px]
                    xl:min-w-0
                    "
                >
                    <p className="text-zinc-400">
                        Ingresos
                    </p>

                    <h2 className="text-3xl font-bold text-green-400">
                        ${metrics.income.toLocaleString()}
                    </h2>
                </div>

                <div
                    className="
                    bg-zinc-900
                    p-6
                    rounded-xl
                    snap-center
                    min-w-[280px]
                    xl:min-w-0
                    "
                >
                    <p className="text-zinc-400">
                        Gastos
                    </p>

                    <h2 className="text-3xl font-bold text-red-400">
                        ${metrics.expenses.toLocaleString()}
                    </h2>
                </div>

                <div
                    className="
                    bg-zinc-900
                    p-6
                    rounded-xl
                    snap-center
                    min-w-[280px]
                    xl:min-w-0
                    "
                >
                    <p className="text-zinc-400">
                        Balance
                    </p>

                    <h2 className="text-3xl font-bold text-blue-400">
                        ${metrics.balance.toLocaleString()}
                    </h2>
                </div>
                <div
                    className="
                    bg-zinc-900
                    p-6
                    rounded-xl
                    snap-center
                    min-w-[280px]
                    xl:min-w-0
                    "
                >
                    <p className="text-zinc-400">
                        Ahorro del Periodo
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-400">
                        {savingsRate}%
                    </h2>
                </div>
                <div
                    className="
                    bg-zinc-900
                    p-6
                    rounded-xl
                    snap-center
                    min-w-[280px]
                    xl:min-w-0
                    "
                >
                    <p className="text-zinc-400">
                        Net Worth
                    </p>

                    <h2 className="text-3xl font-bold text-cyan-400">
                        ${netWorth.toLocaleString()}
                    </h2>
                </div>

            </div>

            {budgetPlanning && (
                <div className="mt-8">

                    <div className="grid
                        grid-cols-1
                        lg:grid-cols-3
                        gap-6">

                        {/* Planeación */}

                        <div className="
                            col-span-1
                            lg:col-span-2
                            bg-zinc-900
                            rounded-xl
                            p-6
                            ">

                            <h2 className="text-xl font-bold mb-6">
                                Planeación de Ingresos
                            </h2>
                            <p className="text-zinc-400 text-sm mb-4">
                                Periodo:
                                {" "}
                                {periodLabel}
                            </p>

                            <div className="grid
                                grid-cols-1
                                xl:grid-cols-2
                                gap-6">

                                <div className="space-y-3">

                                    <p>
                                        Ingresos:
                                        {" "}
                                        $
                                        {budgetPlanning.income.toLocaleString()}
                                    </p>

                                    <p>
                                        Presupuestado:
                                        {" "}
                                        $
                                        {budgetPlanning.budgetTotal.toLocaleString()}
                                    </p>
                                    <p className="text-red-400">
                                        Tarjetas de Crédito:
                                        {" "}
                                        $
                                        {budgetPlanning.liabilityExpenses.toLocaleString()}
                                    </p>

                                </div>

                                <BudgetPlanningChart
                                    data={budgetPlanning.chartData}
                                    available={
                                        budgetPlanning.available
                                    }
                                />

                            </div>

                        </div>

                        {/* Insights */}

                        <div className="bg-zinc-900 rounded-xl p-6">

                            <h2 className="font-bold mb-4">
                                Insights
                            </h2>

                            <div className="space-y-3">

                                {insights.map(
                                    (insight, index) => (
                                        <div
                                            key={index}
                                            className="
                                            bg-zinc-800
                                            p-3
                                            rounded-lg
                                            "
                                        >
                                            {insight}
                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            )}
            <div className="mt-8 bg-zinc-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">
                    Tendencia Financiera
                </h2>

                <IncomeExpenseChart
                    data={chartData}
                />
            </div>
        </div>
    )
}