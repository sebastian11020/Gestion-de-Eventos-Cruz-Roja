export function HoursModal({
                        volunteer,
                        onClose,
                    }: {
    volunteer: Volunteer | null;
    onClose: () => void;
}) {
    if (!volunteer) return null;

    const total = volunteer.months.reduce((acc, m) => acc + toNumberHours(m.hours), 0);

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/40"
                onClick={onClose}
                aria-hidden
            />
            {/* Panel */}
            <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 grid place-items-center"
            >
                <div className="w-full max-w-lg rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Reporte de horas</h3>
                            <p className="text-xs text-gray-500">
                                {volunteer.name} • Doc: {volunteer.document} • Carnet: {volunteer.license}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm transition hover:border-gray-400"
                        >
                            Cerrar
                        </button>
                    </div>

                    <div className="max-h-[60vh] overflow-auto px-5 py-4">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-3 py-2 font-medium">Mes</th>
                                <th className="px-3 py-2 font-medium">Horas</th>
                            </tr>
                            </thead>
                            <tbody>
                            {volunteer.months.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-3 py-8 text-center text-sm text-gray-500">
                                        Sin registros de horas.
                                    </td>
                                </tr>
                            ) : (
                                volunteer.months.map((m, idx) => (
                                    <tr key={`${m.name}-${idx}`} className="border-t border-gray-100">
                                        <td className="px-3 py-2 text-gray-800">{m.name}</td>
                                        <td className="px-3 py-2 font-medium text-gray-900">
                                            {toNumberHours(m.hours)}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                            {volunteer.months.length > 0 && (
                                <tfoot>
                                <tr className="border-t border-gray-200">
                                    <td className="px-3 py-2 font-semibold text-gray-800">Total</td>
                                    <td className="px-3 py-2 font-semibold text-gray-900">{total}</td>
                                </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
                        <button
                            onClick={onClose}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}