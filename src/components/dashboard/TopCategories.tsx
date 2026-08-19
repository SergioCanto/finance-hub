type Props = {
    data: [string, number][];
};

export default function TopCategories({
    data,
}: Props) {
    return (
        <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="font-bold mb-4">
                Top Categorías
            </h2>

            {data.map(([name, amount]) => (
                <div
                    key={name}
                    className="flex justify-between py-2"
                >
                    <span>{name}</span>

                    <span>
                        ${amount.toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    );
}