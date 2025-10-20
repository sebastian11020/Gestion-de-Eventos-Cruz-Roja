export function FancyCard({
                       title,
                       icon,
                       children,
                   }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl p-[1px] bg-gradient-to-br from-blue-100 via-white to-indigo-100 shadow-sm">
            <div className="rounded-3xl bg-white">
                <div className="flex items-center gap-2 rounded-t-3xl bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
                    <span className="text-blue-600">{icon}</span>
                    <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
                </div>
                <div className="px-4 py-4">{children}</div>
            </div>
        </div>
    );
}