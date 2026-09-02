import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
    Label,
} from "recharts";

type Props = {
    data: {
        name: string;
        value: number;
    }[];

    available: number;
};

const COLORS = [
    "#eab308",
    "#3b82f6",
    "#a855f7",
    "#f97316",
    "#22c55e",
    "#ef4444",
    "#14b8a6",
];

export default function BudgetPlanningChart({
    data,
    available,
}: Props) {
    return (
        <ResponsiveContainer
            width="100%"
            height={450}
        >
            <PieChart>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #3f3f46",
                        borderRadius: "12px",
                    }}
                    formatter={(value, name) => [
                        `$${Number(value).toLocaleString()}`,
                        name,
                    ]}
                />
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={75}
                    outerRadius={115}
                    cx="50%"
                    cy="42%"
                >
                    <Label
                        position="center"
                        content={() => (
                            <text
                                x="50%"
                                y="42%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                <tspan
                                    x="50%"
                                    dy="-2.5em"
                                    fill="#22c55e"
                                    fontSize="20"
                                    fontWeight="bold"
                                >
                                    $
                                    {Math.round(
                                        available
                                    ).toLocaleString()}
                                </tspan>

                                <tspan
                                    x="50%"
                                    dy="1.4em"
                                    fill="#a1a1aa"
                                    fontSize="15"
                                >
                                    Disponible
                                </tspan>
                            </text>
                        )}
                    />
                    {data.map(
                        (_, index) => (
                            <Cell
                                key={index}
                                fill={
                                    COLORS[
                                    index %
                                    COLORS.length
                                    ]
                                }
                            />
                        )
                    )}
                </Pie>

                <Legend
                    layout="horizontal"
                    align="center"
                />

            </PieChart>
        </ResponsiveContainer>
    );
}