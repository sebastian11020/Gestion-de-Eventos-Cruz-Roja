import type {Volunteer} from "@/app/dashboard/reportes/page";

export async function buildInactivityPdf({
                                             people,
                                             docToGroup,
                                             groupsOrder,
                                             notes,
                                             numero,
                                             ciudadFecha,
                                         }: {
    people: Volunteer[];
    docToGroup: Map<string, string>;
    groupsOrder: string[];
    notes: Record<string, string>;
    numero: string;
    ciudadFecha: string;
}) {
    const pdfMakeAny: any = (await import("pdfmake/build/pdfmake")).default ?? (await import("pdfmake/build/pdfmake"));
    const pdfFontsAny: any = (await import("pdfmake/build/vfs_fonts")).default ?? (await import("pdfmake/build/vfs_fonts"));
    pdfMakeAny.vfs = pdfFontsAny?.pdfMake?.vfs ?? pdfFontsAny?.vfs;

    const grouped: Record<string, Volunteer[]> = {};
    for (const v of people) {
        const gname = docToGroup.get(v.document) ?? "OTROS";
        if (!grouped[gname]) grouped[gname] = [];
        grouped[gname].push(v);
    }
    const order = [...groupsOrder];
    if (!order.includes("OTROS") && grouped["OTROS"]) order.push("OTROS");

    const sede = "CRUZ ROJA COLOMBIANA SECCIONAL BOYACÁ";
    const dependencia = "DIRECCIÓN SECCIONAL DE VOLUNTARIADO";

    const content: any[] = [
        { text: sede, style: "small", alignment: "center" },
        { text: dependencia, style: "small", alignment: "center", margin: [0, 2, 0, 8] },
        { text: `RESOLUCIÓN ${numero}`, style: "title", alignment: "center" },
        { text: ciudadFecha, style: "small", alignment: "center", margin: [0, 4, 0, 12] },
        { text: "Por medio de la cual se declara INACTIVO a un grupo de Voluntarios/as de la Cruz Roja Colombiana Seccional Boyacá en la ciudad de Tunja.", style: "bold", alignment: "center", margin: [0, 4, 0, 14] },
        { text: "El suscrito Líder Seccional de Voluntariado de la Cruz Roja Colombiana Seccional Boyacá, en uso de sus atribuciones conferidas en el Reglamento Nacional de Voluntariado y,", style: "paragraph", margin: [0, 6, 0, 6] },
        { text: "CONSIDERANDO:", style: "bold", margin: [0, 4, 0, 4] },
        { text: "Que, el Artículo 12 ...", style: "paragraph", margin: [0, 0, 0, 4] },
        { text: "Que, el Artículo 13 ...", style: "paragraph", margin: [0, 0, 0, 10] },
        { text: "RESUELVE:", style: "bold", margin: [0, 6, 0, 4] },
        { text: "ARTÍCULO PRIMERO:", style: "bold" },
        { text: "Declarar inactivas a las siguientes personas, de acuerdo con los registros institucionales, agrupadas por programa:", style: "paragraph", margin: [0, 0, 0, 4] },
    ];

    for (const gname of order) {
        const peopleByGroup = grouped[gname];
        if (!peopleByGroup || peopleByGroup.length === 0) continue;

        const body = [
            [
                { text: "#", style: "th" },
                { text: "NOMBRE", style: "th" },
                { text: "IDENT", style: "th" },
                { text: "CÓDIGO", style: "th" },
                { text: "OBSERVACIONES", style: "th" },
            ],
            ...peopleByGroup.map((v, idx) => [
                { text: String(idx + 1), style: "td" },
                { text: (v.name ?? "").toUpperCase(), style: "td" },
                { text: v.document ?? "", style: "td" },
                { text: (v as any).licence ?? (v as any).license ?? "", style: "td" },
                { text: (notes[v.document]?.trim() || "No hay registro mínimo de horas dentro del periodo de referencia"), style: "td" },
            ]),
        ];

        content.push(
            { text: gname, style: "groupTitle", margin: [0, 8, 0, 4] },
            {
                table: { headerRows: 1, widths: ["auto", "*", "auto", "auto", "*"], body },
                layout: {
                    fillColor: (rowIndex: number) => (rowIndex === 0 ? "#f5f5f5" : null),
                    hLineColor: "#999",
                    vLineColor: "#999",
                },
            }
        );
    }

    content.push(
        { text: "ARTÍCULO SEGUNDO:", style: "bold", margin: [0, 10, 0, 0] },
        { text: "Informar a las personas ...", style: "paragraph" },
        { text: "ARTÍCULO TERCERO:", style: "bold", margin: [0, 8, 0, 0] },
        { text: "Los notificados podrán ...", style: "paragraph" },
        { text: "ARTÍCULO CUARTO:", style: "bold", margin: [0, 8, 0, 0] },
        { text: "Si la inactividad ...", style: "paragraph" },
        { text: "ARTÍCULO QUINTO:", style: "bold", margin: [0, 8, 0, 0] },
        { text: "Contra la presente ...", style: "paragraph" },
        { text: "\n\n_______________________________\nLíder Seccional de Voluntariado\nCruz Roja Colombiana Seccional Boyacá", alignment: "center", margin: [0, 24, 0, 0] }
    );

    const docDefinition = {
        pageSize: "LETTER",
        pageMargins: [40, 40, 40, 40],
        content,
        styles: {
            title: { fontSize: 14, bold: true },
            bold: { bold: true },
            small: { fontSize: 10, color: "#444" },
            paragraph: { fontSize: 11, lineHeight: 1.2 },
            groupTitle: { fontSize: 12, bold: true },
            th: { bold: true, fontSize: 10 },
            td: { fontSize: 10 },
        },
        defaultStyle: { fontSize: 11 },
    } as const;

    const fileName = `Resolucion_Inactividad_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdfMakeAny.createPdf(docDefinition).download(fileName);
}
