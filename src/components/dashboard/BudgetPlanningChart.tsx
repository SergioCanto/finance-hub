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
            height={350}
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
                    innerRadius={90}
                    outerRadius={130}
                >
                    <Label
                        position="center"
                        content={() => (
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                <tspan
                                    x="50%"
                                    dy="-0.5em"
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
                                    dy="1.5em"
                                    fill="#a1a1aa"
                                    fontSize="14"
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

                <Legend />

            </PieChart>
        </ResponsiveContainer>
    );
}