"use client";
import SearchBar from "@/components/layout/searchBar";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import VolunteerWizard from "@/components/layout/formCreateUser";
import { Eye, PencilLine } from "lucide-react";

type voluntarProps = {
  id: string;
  typeDocument: string;
  document: number;
  fullName: string;
  cellphone: number;
  emergencyCellPhone: number;
  email: string;
  state: string;
};

const PAGE_SIZE = 7;

const dataUser: voluntarProps[] = [
  {
    id: "a123",
    typeDocument: "CC",
    document: 1023456534,
    fullName: "Juan Sebastian Rodriguez Mateus",
    cellphone: 3124567654,
    emergencyCellPhone: 3206754312,
    email: "juan@gmail.com",
    state: "Activo",
  },
  {
    id: "a1234",
    typeDocument: "CC",
    document: 1023456536,
    fullName: "Sebastian Daza Delgadillo",
    cellphone: 3123567454,
    emergencyCellPhone: 3106754312,
    email: "sebastian@gmail.com",
    state: "Licencia",
  },
  {
    id: "a1235",
    typeDocument: "CC",
    document: 1012456534,
    fullName: "Andres Felipe Melo Avellaneda",
    cellphone: 3024567654,
    emergencyCellPhone: 3116754312,
    email: "andres@gmail.com",
    state: "Inactivo",
  },
  {
    id: "a1236",
    typeDocument: "CC",
    document: 1023456556,
    fullName: "David Santiago Lotero Rodriguez",
    cellphone: 3156785432,
    emergencyCellPhone: 3216354312,
    email: "david@gmail.com",
    state: "Formacion",
  },
  {
    id: "a12379",
    typeDocument: "CC",
    document: 1023456556,
    fullName: "Harold Ricardo Alvarado Rodriguez",
    cellphone: 3156785432,
    emergencyCellPhone: 3216354312,
    email: "harold@gmail.com",
    state: "Desvinculado",
  },
  {
    id: "a22379",
    typeDocument: "CC",
    document: 1023456556,
    fullName: "Harold Ricardo Alvarado Rodriguez",
    cellphone: 3156785432,
    emergencyCellPhone: 3216354312,
    email: "harold@gmail.com",
    state: "Desvinculado",
  },
  {
    id: "a32379",
    typeDocument: "CC",
    document: 1023456556,
    fullName: "Harold Ricardo Alvarado Rodriguez",
    cellphone: 3156785432,
    emergencyCellPhone: 3216354312,
    email: "harold@gmail.com",
    state: "Desvinculado",
  },
  {
    id: "b12379",
    typeDocument: "CC",
    document: 1023456556,
    fullName: "Harold Ricardo Alvarado Rodriguez",
    cellphone: 3156785432,
    emergencyCellPhone: 3216354312,
    email: "harold@gmail.com",
    state: "Desvinculado",
  },
];

function normalize(v: unknown) {
  return String(v ?? "").toLowerCase();
}
function badgeClass(state: string) {
  const s = state.toLowerCase();
  if (s === "activo")
    return "inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700";
  if (s === "licencia")
    return "inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-700";
  if (s === "desvinculado")
    return "inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700";
  if (s === "inactivo")
    return "inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700";
  if (s === "formacion")
    return "inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700";
  return "inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700";
}

export default function voluntarios() {
  const [filtro, setFiltro] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openWizard, setOpenWizard] = useState(false);

  const handleSearch = (value: string) => {
    setFiltro(value);
  };

  const handleCreate = (data: any) => {
    console.log("Voluntario creado:", data);
    // aquí podrías llamar a tu API Nest (POST /voluntarios)
    setOpenWizard(false);
  };

  useEffect(() => {
    setPage(1);
  }, [filtro]);

  const results = useMemo(() => {
    const q = normalize(filtro);
    if (!q) return dataUser;

    return dataUser.filter((u) => {
      return (
        normalize(u.fullName).includes(q) ||
        normalize(u.email).includes(q) ||
        normalize(u.state).includes(q) ||
        normalize(u.typeDocument).includes(q) ||
        normalize(u.document).includes(q) ||
        normalize(u.cellphone).includes(q) ||
        normalize(u.emergencyCellPhone).includes(q)
      );
    });
  }, [filtro]);

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, total);
  const pageData = results.slice(startIdx, endIdx);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const goTo = (n: number) => setPage(n);

  const onView = (u: voluntarProps) => {
    console.log("Ver voluntario", u);
  };
  const onEdit = (u: voluntarProps) => {
    console.log("Editar voluntario", u);
  };
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight mb-4">
        Voluntarios
      </h1>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <SearchBar
            placeholder="Buscar Voluntario..."
            onSearch={handleSearch}
          />
        </div>
        <Button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          onClick={() => setOpenWizard(true)}
        >
          + Agregar Voluntario
        </Button>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
              <tr className="text-gray-600">
                <th className="px-4 py-3 text-left font-semibold">Carnet</th>
                <th className="px-4 py-3 text-left font-semibold">Tipo Doc</th>
                <th className="px-4 py-3 text-left font-semibold">Documento</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Nombre completo
                </th>
                <th className="px-4 py-3 text-left font-semibold">Celular</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Emergencia
                </th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {pageData.map((u) => (
                <tr
                  key={u.id}
                  className="even:bg-gray-50/60 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-700">{u.id}</td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {u.typeDocument}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{u.document}</td>

                  {/* Nombre y email truncados con tooltip */}
                  <td className="px-4 py-3 text-gray-800 max-w-[260px]">
                    <div className="truncate font-medium" title={u.fullName}>
                      {u.fullName}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-700">{u.cellphone}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {u.emergencyCellPhone}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <span
                      className="truncate block max-w-[220px]"
                      title={u.email}
                    >
                      {u.email}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className={badgeClass(u.state)}>{u.state}</span>
                  </td>

                  {/* Acciones */}
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(u)}
                        className="inline-flex items-center justify-center rounded-md p-2 hover:bg-blue-100 text-blue-700 hover:text-blue-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        aria-label={`Ver ${u.fullName}`}
                        title="Ver"
                      >
                        <Eye className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(u)}
                        className="inline-flex items-center justify-center rounded-md p-2 hover:bg-amber-100 text-amber-700 hover:text-amber-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        aria-label={`Editar ${u.fullName}`}
                        title="Editar"
                      >
                        <PencilLine className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageData.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-gray-500"
                    colSpan={9}
                  >
                    No se encontraron resultados para “{filtro}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer de paginación */}
      <div className="flex flex-col  mt-6  ">
        {/* Info */}
        <p className="text-sm text-gray-600">
          {total === 0
            ? "0 resultados"
            : `Mostrando ${startIdx + 1}–${endIdx} de ${total} resultados`}
        </p>

        {/* Controles */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={goPrev}
            disabled={currentPage === 1}
            className="rounded-lg  px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Anterior
          </button>

          {/* Botones de página (máx 5 visibles con "…") */}
          {(() => {
            const maxVisible = 5;
            const pages: (number | string)[] = [];

            if (totalPages <= maxVisible) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              let start = Math.max(1, currentPage - 2);
              let end = Math.min(totalPages, currentPage + 2);

              if (start === 1) {
                end = maxVisible - 1;
                for (let i = 1; i <= end; i++) pages.push(i);
                pages.push("…");
                pages.push(totalPages);
              } else if (end === totalPages) {
                pages.push(1);
                pages.push("…");
                for (
                  let i = totalPages - (maxVisible - 2);
                  i <= totalPages;
                  i++
                ) {
                  pages.push(i);
                }
              } else {
                pages.push(1);
                pages.push("…");
                for (let i = start; i <= end; i++) pages.push(i);
                pages.push("…");
                pages.push(totalPages);
              }
            }

            return pages.map((p, idx) =>
              typeof p === "number" ? (
                <button
                  key={idx}
                  onClick={() => goTo(p)}
                  className={[
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                    p === currentPage
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  ].join(" ")}
                >
                  {p}
                </button>
              ) : (
                <span key={idx} className="px-2 text-gray-400">
                  {p}
                </span>
              ),
            );
          })()}

          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            className="rounded-lg  px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Siguiente
          </button>
        </div>
      </div>
      <VolunteerWizard
        open={openWizard}
        onClose={() => setOpenWizard(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
