import type { InactiveItem } from "@/app/dashboard/reportes/page";

export async function buildUnlinkingPdf({
  people,
  notes,
  numero,
  ciudadFecha,
}: {
  people: InactiveItem[];
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

  const sede = "Cruz Roja Colombiana";
  const dependencia = "DIRECCIÓN SECCIONAL DE VOLUNTARIADO";

  const body = [
    [
      { text: "#", style: "th" },
      { text: "NOMBRE", style: "th" },
      { text: "DOC IDENT", style: "th" },
      { text: "CÓDIGO", style: "th" },
      { text: "OBSERVACIONES", style: "th" },
    ],
    ...people.map((it, idx) => [
      { text: String(idx + 1), style: "td" },
      { text: (it.name ?? "").toUpperCase(), style: "td" },
      { text: it.document ?? "", style: "td" },
      { text: it.license ?? "", style: "td" },
      {
        text:
          notes[it.document]?.trim() ||
          "No hay registro mínimo de horas por un periodo igual o superior a doce (12) meses, según el RNV.",
        style: "td",
      },
    ]),
  ];

  const content: any[] = [
    { text: sede, style: "small", alignment: "center" },
    {
      text: dependencia,
      style: "small",
      alignment: "center",
      margin: [0, 2, 0, 8],
    },
    { text: `RESOLUCIÓN ${numero}`, style: "title", alignment: "center" },
    {
      text: `(${ciudadFecha})`,
      style: "small",
      alignment: "center",
      margin: [0, 2, 0, 12],
    },
    {
      text: "Por medio de la cual se DESVINCULA a un grupo de personas, del Voluntariado de Socorrismo y de Juventud de la Cruz Roja Colombiana Seccional Boyacá en la Sede Seccional (Tunja).",
      style: "paragraph",
      alignment: "center",
      margin: [0, 0, 0, 10],
    },
    {
      text: "El suscrito Líder de Voluntariado de la Cruz Roja Colombiana Seccional Boyacá, en uso de sus atribuciones conferidas en el Reglamento Nacional de Voluntariado y,",
      style: "paragraph",
      margin: [0, 0, 0, 8],
    },
    { text: "CONSIDERANDO:", style: "bold", margin: [0, 0, 0, 6] },
    {
      text: "Que, el Artículo 12 del Reglamento Nacional de Voluntariado expresa que se considera activo el voluntario de base que cumpla con un número mínimo de veinticuatro (24) horas de servicio voluntario cada dos meses, en los programas o actividades propias de las agrupaciones. No incluye las actividades de bienestar.",
      style: "paragraph",
      margin: [0, 0, 0, 6],
    },
    {
      text: "Que, el Artículo 13 del Reglamento Nacional de Voluntariado expresa que cuando un voluntario permanezca inactivo por un periodo igual o superior a un (1) año, será desvinculado de la Institución mediante Resolución motivada por el respectivo Director.",
      style: "paragraph",
      margin: [0, 0, 0, 10],
    },
    { text: "RESUELVE:", style: "bold", margin: [0, 0, 0, 6] },
    { text: "ARTÍCULO PRIMERO:", style: "bold" },
    {
      text: "Desvincular a las personas relacionadas a continuación del Voluntariado de Base de la Cruz Roja Colombiana Seccional Boyacá:",
      style: "paragraph",
      margin: [0, 0, 0, 8],
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
      margin: [0, 0, 0, 10],
    },
    { text: "ARTÍCULO SEGUNDO:", style: "bold", margin: [0, 4, 0, 2] },
    {
      text: "Informar a las personas en mención, que pierden todos los derechos de los Voluntarios Activos y no podrán desempeñar actividades o funciones en nombre de la Cruz Roja Colombiana, ni utilizar el Emblema, uniformes e identificación institucional; por lo cual es su deber devolver estos elementos a la Institución.",
      style: "paragraph",
    },
    { text: "ARTÍCULO TERCERO:", style: "bold", margin: [0, 8, 0, 2] },
    {
      text: "Notificar a las personas desvinculadas sobre el contenido de esta Resolución, publicándola en cartelera institucional por ocho (8) días y, de ser posible, en sus correos electrónicos personales registrados en la base de datos institucional.",
      style: "paragraph",
    },
    { text: "ARTÍCULO CUARTO:", style: "bold", margin: [0, 8, 0, 2] },
    {
      text: "Informar que contra esta resolución proceden los recursos de reposición y, en subsidio, el de apelación en los términos reglamentarios; vencidos los términos quedará en firme la decisión.",
      style: "paragraph",
      margin: [0, 0, 0, 14],
    },
    {
      text: "Comuníquese y cúmplase.",
      style: "paragraph",
      margin: [0, 0, 0, 18],
    },
    {
      columns: [
        {
          width: "50%",
          stack: [
            { text: "_______________________________", alignment: "center" },
            { text: "Líder Seccional de Voluntariado", alignment: "center" },
            {
              text: "Cruz Roja Colombiana Seccional Boyacá",
              alignment: "center",
            },
          ],
        },
        {
          width: "50%",
          stack: [
            { text: "_______________________________", alignment: "center" },
            { text: "Director Ejecutivo Seccional", alignment: "center" },
            {
              text: "Cruz Roja Colombiana Seccional Boyacá",
              alignment: "center",
            },
          ],
        },
      ],
      columnGap: 20,
      margin: [0, 0, 0, 12],
    },
    {
      text: "c.c.: Representantes Seccionales de Socorrismo y Juventud • Comisión Seccional de Voluntariado • Archivo Seccional de Voluntariado",
      style: "small",
      alignment: "left",
    },
  ];

  const docDefinition = {
    pageSize: "LETTER",
    pageMargins: [40, 40, 40, 40],
    content,
    styles: {
      title: { fontSize: 14, bold: true },
      bold: { bold: true },
      small: { fontSize: 10, color: "#444" },
      paragraph: { fontSize: 11, lineHeight: 1.2 },
      th: { bold: true, fontSize: 10 },
      td: { fontSize: 10 },
    },
    defaultStyle: { fontSize: 11 },
  } as const;

  const fileName = `Resolucion_Desvinculacion_${new Date().toISOString().slice(0, 10)}.pdf`;
  pdfMakeAny.createPdf(docDefinition).download(fileName);
}
