export function formatFechaLarga(d = new Date()) {
    const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

export function fmtDate(d: string | Date) {
    const x = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(x.getTime())) return String(d ?? "");
    return `${String(x.getDate()).padStart(2, "0")}/${String(x.getMonth() + 1).padStart(2, "0")}/${x.getFullYear()}`;
}