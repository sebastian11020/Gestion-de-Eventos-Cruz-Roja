"use client";

import { useSectionalsNode } from "@/hooks/useSectionalsNode";

export function StepReview({
  form,
  cityMap,
  epsMap,
}: {
  form: any;
  cityMap: Map<string, string>;
  epsMap: Map<string, string> | undefined;
}) {
  const { sectionals } = useSectionalsNode();
  const sectionalMap = new Map<string, string>();
  sectionals.forEach((s) => sectionalMap.set(String(s.id), s.city));
  const { state } = useSectionalsNode();

  const stateMap = new Map<string, string>();
  state.forEach((s) => stateMap.set(String(s.id), s.name));

  const groupMap = new Map<string, string>();
  sectionals.forEach((s) =>
    s.groups.forEach((g) => groupMap.set(g.id, g.name)),
  );

  const programMap = new Map<string, string>();
  sectionals.forEach((s) =>
    s.groups?.forEach((g) =>
      g.program?.forEach((p) => programMap.set(p.id, p.name)),
    ),
  );

  return (
    <section className="space-y-3">
      <p className="text-sm text-gray-600">
        Revisa la información antes de guardar.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border p-3">
          <h5 className="font-medium text-gray-800 mb-2">Identificación</h5>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>Tipo Doc:</strong> {form.type_document}
            </li>
            <li>
              <strong>Documento:</strong> {form.document}
            </li>
            <li>
              <strong>N° Carnet:</strong> {form.carnet || "-"}
            </li>
            <li>
              <strong>Sangre:</strong> {form.blood}
            </li>
          </ul>
        </div>
        <div className="rounded-lg border p-3">
          <h5 className="font-medium text-gray-800 mb-2">Personales</h5>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>Nombre:</strong> {form.name} {form.lastName}
            </li>
            <li>
              <strong>Sexo:</strong> {form.sex}
            </li>
            <li>
              <strong>Estado:</strong> {stateMap.get(String(form.id_state))}
            </li>
            <li>
              <strong>Fecha de nacimiento:</strong> {form.birthDate}
            </li>
          </ul>
        </div>
        <div className="rounded-lg border p-3">
          <h5 className="font-medium text-gray-800 mb-2">
            Ubicación & Contacto
          </h5>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>Ciudad:</strong> {cityMap.get(form.id_location) ?? "—"}
            </li>
            <li>
              <strong>Dirección:</strong> {form.address.streetAddress || "—"}
            </li>
            <li>
              <strong>Barrio:</strong> {form.address.zone || "—"}
            </li>
            <li>
              <strong>Celular:</strong> {form.phone || "—"}
            </li>
            <li>
              <strong>Email:</strong> {form.email || "—"}
            </li>
          </ul>
        </div>
        <div className="rounded-lg border p-3">
          <h5 className="font-medium text-gray-800 mb-2">Asignación</h5>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>Seccional:</strong>{" "}
              {sectionalMap.get(String(form.id_headquarters)) ?? "—"}
            </li>
            <li>
              <strong>Agrupación:</strong>{" "}
              {groupMap.get(String(form.id_group)) ?? "—"}
            </li>
            <li>
              <strong>Programa:</strong>{" "}
              {programMap.get(String(form.id_program)) ?? "—"}
            </li>
          </ul>
        </div>
        <div className="rounded-lg border p-3">
          <h5 className="font-medium text-gray-800 mb-2">EPS & Emergencia</h5>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>EPS:</strong>{" "}
              {epsMap
                ? (epsMap.get(String(form.id_eps)) ?? "—")
                : form.id_eps || "—"}{" "}
              ({form.type_affiliation || "—"})
            </li>
            <li>
              <strong>Emergencia:</strong> {form.emergencyContact.name || "—"} (
              {form.emergencyContact.relationShip || "—"}) -{" "}
              {form.emergencyContact.phone || "—"}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
