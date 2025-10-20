"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import VolunteerPickerModal from "@/components/tables/volunteerPickerModal";
import Modal from "@/components/layout/modal";
import ChangeLeaderTable from "@/components/tables/changeLeaderTable";
import type { CreateEventForm } from "@/types/usertType";
import { GroupNode, SectionalNode } from "@/types/programType";
import { useSedesData } from "@/hooks/useSedesData";
import { useSectionalsNode } from "@/hooks/useSectionalsNode";
import { BASE_SKILL_ID } from "@/components/events/sections/operationSection";
import { Header } from "@/components/events/sections/header";
import { BasicInfoSection } from "@/components/events/sections/basicInfoSections";
import { ClassificationSection } from "@/components/events/sections/classificationSection";
import { LocationSection } from "@/components/events/sections/locationSection";
import { OperationSection } from "@/components/events/sections/operationSection";
import { PrivacyParticipantsSection } from "@/components/events/sections/privacyParticipantsSection";

export type CityOption = { id: string; name: string };

const AMBITS = [
    { value: "INSTITUCIONAL", label: "Institucional" },
    { value: "COMUNITARIO", label: "Comunitario" },
    { value: "EDUCATIVO", label: "Educativo" },
];

const CLASSIFICATIONS = [
    { value: "CAPACITACION", label: "Capacitación" },
    { value: "JORNADA", label: "Jornada" },
    { value: "SIMULACRO", label: "Simulacro" },
];

const MARCOS = [
    { value: "SALUD", label: "Salud" },
    { value: "SOCORRISMO", label: "Socorrismo" },
    { value: "JUVENTUD", label: "Juventud" },
];

export default function CreateEventForm({
                                            onCancel,
                                            onSuccess,
                                            cities,
                                            sectionals,
                                        }: {
    onCancel: () => void;
    onSuccess: () => void;
    cities: CityOption[] | undefined;
    sectionals: SectionalNode[];
}) {
    const [loading, setLoading] = useState(false);
    const [openPicker, setOpenPicker] = useState(false);
    const [openChangeLeader, setOpenChangeLeader] = useState(false);
    const { users } = useSedesData();
    const { skills } = useSectionalsNode();

    const [selectedVolunteers, setSelectedVolunteers] = useState<
        { id: string; name: string; document?: string }[]
    >([]);

    const [form, setForm] = useState<CreateEventForm>({
        ambit: "",
        classification: "",
        applyDecreet: true,
        marcActivity: "",
        startDate: "",
        endDate: "",
        name: "",
        description: "",
        department: "Boyacá",
        city: "",
        streetAddress:"",
        sectionalId: "",
        groupId: "",
        capacity: 0,
        attendant: { document:"",name:""},
        isVirtual: false,
        isPrivate: "false",
        isAdult: false,
        requiresSkills: false,
        skillsQuotasList: [],
    });

    // Derivados
    const sectionalSelected = useMemo(
        () => sectionals.find((c) => String(c.id) === String(form.sectionalId)) || null,
        [sectionals, form.sectionalId]
    );
    const groupOptions: GroupNode[] = sectionalSelected?.groups ?? [];

    const groupSelected = useMemo(
        () => groupOptions.find((g) => String(g.id) === String(form.groupId)) || null,
        [groupOptions, form.groupId]
    );

    const skillsOptions = useMemo(
        () => (skills ?? []).map((s) => ({ id: String(s.id), name: s.name ?? "" })),
        [skills]
    );

    // Handlers de nivel contenedor
    const updateForm = <K extends keyof CreateEventForm>(key: K, value: CreateEventForm[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const removeVolunteer = (id: string) =>
        setSelectedVolunteers((prev) => prev.filter((v) => v.id !== id));

    const handleSectionalChange = (value: string) => {
        setForm((f) => ({ ...f, sectionalId: value, groupId: "" }));
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!form.name) return;

        const cap = Number.isFinite(form.capacity) ? form.capacity : 0;
        const idsReales = new Set((skills ?? []).map((s) => s.id));
        const onlyReal = (form.skillsQuotasList ?? []).filter(q => idsReales.has(q.id));

        const totalAssigned = onlyReal.reduce((a, q) => a + (Number.isFinite(q.qty) ? q.qty : 0), 0);
        const baseRemaining = Math.max(0, cap - totalAssigned);

        const skillsQuotasListToSend = form.requiresSkills
            ? [...onlyReal, { id: BASE_SKILL_ID, qty: baseRemaining }]
            : [{ id: BASE_SKILL_ID, qty: cap }];

        const payload = {
            ...form,
            participants: form.isPrivate === "true" ? selectedVolunteers.map((v) => v.id) : [],
            skillsQuotasList: skillsQuotasListToSend,
        }
        console.log(payload)
        setLoading(true);
        try {
            onSuccess();
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Header title="Crear evento" />

            <BasicInfoSection form={form} onChange={updateForm} />

            <ClassificationSection
                form={form}
                onChange={updateForm}
                ambits={AMBITS}
                classifications={CLASSIFICATIONS}
                marcos={MARCOS}
            />

            <LocationSection
                form={form}
                onChange={updateForm}
                cities={cities ?? []}
                sectionals={sectionals}
                onChangeSectional={handleSectionalChange}
                groupOptions={groupOptions}
            />

            <OperationSection
                form={form}
                onChange={updateForm as any}
                skills={skillsOptions}
            />

            <PrivacyParticipantsSection
                form={form}
                onChange={updateForm}
                selectedVolunteers={selectedVolunteers}
                onOpenPicker={() => setOpenPicker(true)}
                onOpenChangeLeader={() => setOpenChangeLeader(true)}
                onRemoveVolunteer={removeVolunteer}
            />

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" className="rounded-2xl" onClick={onCancel} disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700" disabled={loading}>
                    {loading ? "Creando..." : "Crear evento"}
                </Button>
            </div>
            <VolunteerPickerModal
                open={openPicker}
                onClose={() => setOpenPicker(false)}
                defaultSelected={selectedVolunteers}
                onSave={(list) => {
                    setSelectedVolunteers(list);
                    setOpenPicker(false);
                }}
            />

            <Modal open={openChangeLeader} onClose={() => setOpenChangeLeader(false)} title={"Seleccionar encargado"}>
                <ChangeLeaderTable users={users} />
            </Modal>
        </form>
    );
}