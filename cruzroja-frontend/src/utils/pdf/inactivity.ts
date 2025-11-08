import type { Volunteer } from "@/app/dashboard/reportes/page";

function getGroupLabel(gname: string, index: number): string {
  const upper = gname.toUpperCase();
  if (upper.includes("JUV")) return "Juveniles";
  if (upper.includes("SOC")) return "Socorristas";
  return gname;
}

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
  const pdfMakeAny: any =
    (await import("pdfmake/build/pdfmake")).default ??
    (await import("pdfmake/build/pdfmake"));
  const pdfFontsAny: any =
    (await import("pdfmake/build/vfs_fonts")).default ??
    (await import("pdfmake/build/vfs_fonts"));
  pdfMakeAny.vfs = pdfFontsAny?.pdfMake?.vfs ?? pdfFontsAny?.vfs;

  // Agrupar personas por programa / agrupación
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
    { text: "Cruz Roja Colombiana", style: "small", alignment: "center" },
    { text: sede, style: "small", alignment: "center" },
    {
      text: dependencia,
      style: "small",
      alignment: "center",
      margin: [0, 2, 0, 12],
    },
    { text: `RESOLUCIÓN ${numero}`, style: "title", alignment: "center" },
    {
      text: `(${ciudadFecha})`,
      style: "small",
      alignment: "center",
      margin: [0, 4, 0, 12],
    },
    {
      text: "Por medio de la cual se declara INACTIVO a un grupo de Voluntarios/as Socorristas y Juveniles de la Cruz Roja Colombiana Seccional Boyacá en la ciudad de Tunja.",
      style: "bold",
      alignment: "center",
      margin: [0, 4, 0, 16],
    },
    {
      text: "El suscrito Líder Seccional de Voluntariado de la Cruz Roja Colombiana Seccional Boyacá, en uso de sus atribuciones conferidas en el Reglamento Nacional de Voluntariado y,",
      style: "paragraph",
      margin: [0, 0, 0, 10],
    },
    { text: "CONSIDERANDO:", style: "bold", margin: [0, 0, 0, 6] },
    {
      text:
        "Que, el Artículo 12 del Reglamento Nacional de Voluntariado expresa que se considera activo el voluntario de base que cumpla con un número mínimo de veinticuatro (24) horas de servicio voluntario cada dos meses, en los programas o actividades propias de las agrupaciones. No incluye las actividades de bienestar.\n\n" +
        "Que, el Artículo 13 del mismo Reglamento Nacional establece como Voluntarios inactivos, que pierden los derechos de los voluntarios activos, a aquellos quienes durante dos meses consecutivos incumplan con el número de horas o actividades establecidas. En tales casos, la condición de inactivo deberá ser declarada mediante resolución motivada expedida por el respectivo Coordinador de Gestión, indicando claramente el tiempo de inactividad.\n\n" +
        "Que, teniendo en cuenta los registros de actividades desarrolladas por el voluntariado durante los meses de enero a marzo de 2025, las siguientes personas faltaron a sus compromisos como voluntarios de la Institución por un periodo de dos meses consecutivos o más sin causa justificada.",
      style: "paragraph",
      margin: [0, 0, 0, 10],
    },
    { text: "RESUELVE:", style: "bold", margin: [0, 10, 0, 6] },
  ];

  // ARTÍCULO PRIMERO y SEGUNDO: listados por agrupación (Juventud / Socorrismo)
  const articleLabels = ["PRIMERO", "SEGUNDO"];
  let articleIndex = 0;

  for (const gname of order) {
    const peopleByGroup = grouped[gname];
    if (!peopleByGroup || peopleByGroup.length === 0) continue;
    if (articleIndex > 1) {
      // Si llegaran más grupos, se agregan con un título simple pero sin nuevo artículo,
      // para no chocar con los artículos TERCERO a OCTAVO fijos.
      const extraBody = [
        [
          { text: "#", style: "th" },
          { text: "NOMBRE", style: "th" },
          { text: "DOC IDENT", style: "th" },
          { text: "CÓDIGO", style: "th" },
          { text: "OBSERVACIONES", style: "th" },
        ],
        ...peopleByGroup.map((v, idx) => [
          { text: String(idx + 1), style: "td" },
          { text: (v.name ?? "").toUpperCase(), style: "td" },
          { text: v.document ?? "", style: "td" },
          { text: (v as any).licence ?? (v as any).license ?? "", style: "td" },
          {
            text:
              notes[v.document]?.trim() ||
              "No hay registro mínimo de horas dentro del periodo de referencia",
            style: "td",
          },
        ]),
      ];

      content.push(
        { text: gname, style: "groupTitle", margin: [0, 8, 0, 4] },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto", "*"],
            body: extraBody,
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? "#f5f5f5" : null,
            hLineColor: "#999",
            vLineColor: "#999",
          },
        },
      );
      continue;
    }

    const articulo = articleLabels[articleIndex];
    const groupLabel = getGroupLabel(gname, articleIndex);

    const body = [
      [
        { text: "#", style: "th" },
        { text: "NOMBRE", style: "th" },
        { text: "DOC IDENT", style: "th" },
        { text: "CÓDIGO", style: "th" },
        { text: "OBSERVACIONES", style: "th" },
      ],
      ...peopleByGroup.map((v, idx) => [
        { text: String(idx + 1), style: "td" },
        { text: (v.name ?? "").toUpperCase(), style: "td" },
        { text: v.document ?? "", style: "td" },
        { text: (v as any).licence ?? (v as any).license ?? "", style: "td" },
        {
          text:
            notes[v.document]?.trim() ||
            "No hay registro mínimo de horas dentro del periodo de referencia",
          style: "td",
        },
      ]),
    ];

    content.push(
      {
        text: `ARTÍCULO ${articulo}:`,
        style: "bold",
        margin: [0, articleIndex === 0 ? 6 : 10, 0, 0],
      },
      {
        text: `Declarar a las personas relacionadas a continuación como Voluntarios ${groupLabel} Inactivos de la Cruz Roja Colombiana Seccional Boyacá:`,
        style: "paragraph",
        margin: [0, 2, 0, 4],
      },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto", "*"],
          body,
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? "#f5f5f5" : null),
          hLineColor: "#999",
          vLineColor: "#999",
        },
      },
    );

    articleIndex++;
  }

  // ARTÍCULOS TERCERO A OCTAVO, igual al formato del archivo
  content.push(
    {
      text: "ARTÍCULO TERCERO:",
      style: "bold",
      margin: [0, 10, 0, 0],
    },
    {
      text: "Informar a las personas relacionadas anteriormente, que pierden todos los derechos de los Voluntarios Activos y no podrán desempeñar actividades o funciones en nombre de la Cruz Roja Colombiana, ni utilizar el Emblema, uniformes e identificación institucional, por lo cual es su deber devolver estos elementos a la Institución.",
      style: "paragraph",
      margin: [0, 2, 0, 8],
    },
    {
      text: "ARTÍCULO CUARTO:",
      style: "bold",
      margin: [0, 0, 0, 0],
    },
    {
      text: "Informar a los interesados que podrán solicitar su vinculación nuevamente al Voluntariado, presentando petición escrita ante el Líder Seccional de Voluntariado.",
      style: "paragraph",
      margin: [0, 2, 0, 8],
    },
    {
      text: "ARTÍCULO QUINTO:",
      style: "bold",
      margin: [0, 0, 0, 0],
    },
    {
      text: "Informar a los notificados que si permanecen inactivos por un periodo igual o superior a doce (12) meses contados a partir del último registro de horas referido, serán retirados definitivamente de la Agrupación y de la Cruz Roja Colombiana.",
      style: "paragraph",
      margin: [0, 2, 0, 8],
    },
    {
      text: "ARTÍCULO SEXTO:",
      style: "bold",
      margin: [0, 0, 0, 0],
    },
    {
      text: "Los notificados podrán solicitar verificación y/o reposición de sus derechos si consideran desacuerdos con la presente Resolución, dentro de un término de ocho (08) días hábiles contados a partir de su publicación.",
      style: "paragraph",
      margin: [0, 2, 0, 8],
    },
    {
      text: "ARTÍCULO SÉPTIMO:",
      style: "bold",
      margin: [0, 0, 0, 0],
    },
    {
      text: "Notificar la presente Resolución a cada una de las personas relacionadas, a través del correo personal registrado en los archivos de la Institución y en la cartelera institucional por un término de cinco (5) días.",
      style: "paragraph",
      margin: [0, 2, 0, 8],
    },
    {
      text: "ARTÍCULO OCTAVO:",
      style: "bold",
      margin: [0, 0, 0, 0],
    },
    {
      text: "La presente Resolución rige a partir de la fecha de su expedición y contra ella procede el Recurso de Reposición.",
      style: "paragraph",
      margin: [0, 2, 0, 12],
    },
    {
      text: "Comuníquese y cúmplase. Dada en Tunja, a los veintiséis (26) días del mes de abril del año 2025.",
      style: "paragraph",
      margin: [0, 0, 0, 24],
    },
    {
      text: "_______________________________\nLíder Seccional de Voluntariado\nCruz Roja Colombiana Seccional Boyacá",
      alignment: "center",
      margin: [0, 0, 0, 12],
    },
    {
      text: "c.c. Representantes Secc. Socorrismo y Juventud\nArchivo Seccional de Voluntariado.\nElaboró: Secretaria Seccional de Voluntariado.",
      style: "small",
      margin: [0, 0, 0, 0],
    },
  );

  const docDefinition = {
    pageSize: "LETTER",
    pageMargins: [40, 40, 40, 40],
    content,
    styles: {
      title: { fontSize: 14, bold: true },
      bold: { bold: true },
      small: { fontSize: 9, color: "#444" },
      paragraph: { fontSize: 11, lineHeight: 1.2, alignment: "justify" },
      groupTitle: { fontSize: 12, bold: true },
      th: { bold: true, fontSize: 9 },
      td: { fontSize: 9 },
    },
    defaultStyle: { fontSize: 11 },
  } as const;

  const fileName = `Resolucion_Inactividad_${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;
  pdfMakeAny.createPdf(docDefinition).download(fileName);
}
