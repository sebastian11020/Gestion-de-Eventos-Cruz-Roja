"use client";
import SearchBar from "@/components/layout/searchBar";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import VolunteerWizard from "@/components/forms/formCreateUser";
import { Eye, PencilLine } from "lucide-react";
import { formCreatePerson, FormState, sectional } from "@/types/usertType";
import ViewUser from "@/components/cards/viewUser";
import { supabase } from "@/lib/supabase-browser";
import { generatePassword } from "@/utils/generatePassword";
import { toFormCreatePerson } from "@/utils/adapters";
import { PAGE_SIZE } from "@/const/consts";
import {
  createPersonService,
  updatePersonService,
} from "@/services/serviceCreatePerson";
import toast from "react-hot-toast";
import { getSupabaseUserId } from "@/utils/getSupabaseId";
import { usePersonData } from "@/hooks/usePersonData";
import { Loading } from "@/components/ui/loading";
import {associateProgramService} from "@/services/serviceCreateProgram";

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
  if (s === "formación")
    return "inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700";
  return "inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700";
}

export default function voluntarios() {
  const [filtro, setFiltro] = useState("");
  const [page, setPage] = useState(1);
  const [openWizard, setOpenWizard] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [cityFilter, setCityFilter] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [editUser, setEditUser] = useState<formCreatePerson | null>(null);
  const [viewUser, setViewUser] = useState<FormState | null>(null);
  const { users, loading, reload } = usePersonData();
  const handleSearch = (value: string) => {
    setFiltro(value);
  };

  const cities = useMemo(() => {
    const set = new Set(users.map((u) => u.sectional.city));
    return Array.from(set).sort();
  }, [users]);

  const states = useMemo(() => {
    const map = new Map<string, string>(); // id -> name
    for (const u of users) {
      if (u.state?.id && u.state?.name) {
        map.set(u.state.id, u.state.name);
      }
    }
    return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [users]);

  async function register(form: formCreatePerson) {
    const password = generatePassword(12);
    const sb = supabase();
    const { data: before } = await sb.auth.getSession();
    const prev = before.session;
    (window as any).__MUTE_AUTH_EVENTS = true;
    const { data, error } = await sb.auth.signUp({
      email: form.email,
      password,
    });

    if (error) {
      (window as any).__MUTE_AUTH_EVENTS = false;
      console.error(error);
      return null;
    }

    const newUserId = data.user?.id ?? null;
    if (prev) {
      await sb.auth.setSession({
        access_token: prev.access_token,
        refresh_token: prev.refresh_token,
      });
    } else {
      await sb.auth.signOut();
    }
    (window as any).__MUTE_AUTH_EVENTS = false;
    return { id: newUserId, password };
  }

  async function handleCreateOrUpdate(data: formCreatePerson) {
    try {
      if (editUser) {
          await toast.promise(
              updatePersonService(data).then((res) => {
                  if (!res.success) {
                      return Promise.reject(res);
                  }
                  return res;
              }),
              {
                  loading: "Creando...",
                  success: (res: { message?: string }) => {
                      return <b>{res.message ?? "Creado correctamente"}</b>;
                  },
                  error: (res: { message?: string }) => (
                      <b>{res.message ?? "No se pudo crear"}</b>
                  ),
              }
          );
          setOpenWizard(false)
      } else {
        const reg = await register(data);
        const newData = {
          ...data,
          id: reg?.id ?? "",
          password: reg?.password ?? "",
        };
          await toast.promise(
              createPersonService(newData).then((res) => {
                  if (!res.success) {
                      return Promise.reject(res);
                  }
                  return res;
              }),
              {
                  loading: "Creando...",
                  success: (res: { message?: string }) => {
                      return <b>{res.message ?? "Creando correctamente"}</b>;
                  },
                  error: (res: { message?: string }) => (
                      <b>{res.message ?? "No se pudo asociar"}</b>
                  ),
              }
          );
          setOpenWizard(false);
      }
      setEditUser(null);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    setPage(1);
  }, [filtro, cityFilter, users]);

  const results = useMemo(() => {
    const q = normalize(filtro);
    const base = !q
      ? users
      : users.filter(
          (u) =>
            normalize(u.carnet).includes(q) ||
            normalize(u.name).includes(q) ||
            normalize(u.lastName).includes(q) ||
            normalize(u.email).includes(q) ||
            normalize(u.state).includes(q) ||
            normalize(u.typeDocument).includes(q) ||
            normalize(u.document).includes(q) ||
            normalize(u.cellphone).includes(q) ||
            normalize(u.sectional.city).includes(q) ||
            normalize(u.state.name).includes(q),
        );
    return base.filter(
      (u) =>
        (cityFilter === "" || u.sectional.city === cityFilter) &&
        (stateFilter === "" || u.state.id === stateFilter),
    );
  }, [filtro, cityFilter, stateFilter, users]);

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, total);
  const pageData = results.slice(startIdx, endIdx);
  const handleCloseView = () => setViewUser(null);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const goTo = (n: number) => setPage(n);

  const onView = (u: FormState) => {
    setViewUser(u);
    setOpenView(true);
  };
  const onEdit = (u: FormState) => {
    const mapped = toFormCreatePerson(u);
    setEditUser(mapped);
    setOpenWizard(true);
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
        <div className="w-44">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover: focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="">Todas las ciudades</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="w-44">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="w-full rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover: focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="">Todos los estados</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          onClick={() => setOpenWizard(true)}
        >
          + Agregar Voluntario
        </Button>
      </div>
      {loading ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <Loading
            size="lg"
            label="Cargando voluntarios…"
            minHeight="min-h-[260px]"
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
                <tr className="text-gray-600">
                  <th className="px-4 py-3 text-left font-semibold">Carnet</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Tipo Doc
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Documento
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Nombre completo
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Celular</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Seccional
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {pageData.map((u) => (
                  <tr
                    key={u.document}
                    className="even:bg-gray-50/60 hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-700">{u.carnet}</td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {u.typeDocument}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{u.document}</td>

                    {/* Nombre y email truncados con tooltip */}
                    <td className="px-4 py-3 text-gray-800 max-w-[260px]">
                      <div className="truncate font-medium" title={u.name}>
                        {u.name} {u.lastName}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">{u.cellphone}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {u.sectional.city}
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
                      <span className={badgeClass(u.state.name)}>
                        {u.state.name}
                      </span>
                    </td>
                    {/* Acciones */}
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onView(u)}
                          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-blue-100 text-blue-700 hover:text-blue-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          aria-label={`Ver ${u.name} ${u.lastName}`}
                          title="Ver"
                        >
                          <Eye className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(u)}
                          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-amber-100 text-amber-700 hover:text-amber-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                          aria-label={`Editar ${u.name} ${u.lastName}`}
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
      )}

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
        onSubmit={handleCreateOrUpdate}
        editForm={editUser}
      />
      <ViewUser infUser={viewUser} onClose={handleCloseView}></ViewUser>
    </div>
  );
}
