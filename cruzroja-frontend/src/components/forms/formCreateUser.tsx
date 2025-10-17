"use client";
import { useEffect, useMemo, useState } from "react";
import { formCreatePerson } from "@/types/usertType";
import { Progress } from "@/components/volunteer/progress";
import { Stepper } from "@/components/volunteer/stepper";
import { Footer } from "@/components/volunteer/footer";
import { Header } from "@/components/volunteer/header";
import { INITIAL_FORM } from "@/components/volunteer/constants";
import { StepIdentification } from "@/components/volunteer/stepIdentification";
import { StepPersonal } from "@/components/volunteer/stepPersonal";
import { StepLocationContact } from "@/components/volunteer/stepLocationContact";
import { StepEpsEmergency } from "@/components/volunteer/stepEpsEmergency";
import { StepReview } from "@/components/volunteer/stepStepsReview";
import { useSectionalsNode } from "@/hooks/useSectionalsNode";

export default function VolunteerWizard({
  open,
  onClose,
  onSubmit,
  editForm,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: formCreatePerson) => void;
  editForm: formCreatePerson | null;
}) {
  const [step, setStep] = useState(0);
  const steps = [
    "Identificación",
    "Personales",
    "Ubicación/Contacto",
    "EPS & Emergencia",
    "Revisión",
  ];
  const progress = Math.round(((step + 1) / steps.length) * 100);
  const [form, setForm] = useState<formCreatePerson>(INITIAL_FORM);
  const { cities, eps, sectionals,skills} = useSectionalsNode();

  useEffect(() => {
    if (!open) return;
    if (editForm) {
      setForm(editForm);
    } else {
      setForm(INITIAL_FORM);
    }
  }, [open, editForm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleNested = (
    group: "emergencyContact" | "address",
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [group]: { ...(s as any)[group], [name]: value },
    }));
  };

  function handleGroupChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const groupId = e.target.value;
    setForm((s) => ({ ...s, id_group: groupId }));
  }

  function handleProgramChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const programId = e.target.value;
    setForm((s) => ({ ...s, id_program: programId }));
  }

  const cityMap = useMemo(() => {
    const m = new Map<string, string>();
    (cities ?? []).forEach((c) => m.set(c.id, c.name));
    return m;
  }, [cities]);

  const epsMap = useMemo(() => {
    const m = new Map<string, string>();
    (eps ?? []).forEach((e) => m.set(String(e.id), e.name));
    return m;
  }, [eps]);

  const canNext = useMemo(() => {
    if (step === 0) {
      return form.type_document && form.document && form.blood;
    }
    if (step === 1) {
      return form.name && form.lastName && form.sex;
    }
    if (step === 2) {
      return form.id_location && form.address && form.email && form.phone;
    }
    if (step === 3) {
      return form.id_eps && form.type_affiliation;
    }
    return true;
  }, [step, form]);

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setStep(0);
  };

  const submit = () => {
    resetForm();
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* header */}
        <Header onClose={onClose} />

        <Progress progress={progress} />
        <Stepper steps={steps} step={step} />

        {/* body */}
        <div className="max-h[65vh] md:max-h-[65vh] overflow-y-auto px-6 pb-6 pt-4">
          {step === 0 && (
            <StepIdentification form={form} handleChange={handleChange} />
          )}
            {step === 1 && (
                <StepPersonal
                    form={form}
                    handleChange={handleChange}
                    onChangeSkills={(next) => setForm((f) => ({ ...f, skills: next }))}
                />
            )}
          {step === 2 && (
            <StepLocationContact
              form={form}
              cities={cities}
              sectionals={sectionals}
              handleChange={handleChange}
              handleNested={handleNested}
              handleGroupChange={handleGroupChange}
              handleProgramChange={handleProgramChange}
            />
          )}
          {step === 3 && (
            <StepEpsEmergency
              form={form}
              eps={eps}
              handleChange={handleChange}
              handleNested={handleNested}
            />
          )}
          {step === 4 && (
            <StepReview form={form} cityMap={cityMap} epsMap={epsMap} />
          )}
        </div>

        <Footer
          step={step}
          stepsLen={steps.length}
          canNext={!!canNext}
          onClose={onClose}
          onReset={resetForm}
          onPrev={prev}
          onNext={next}
          onSubmit={submit}
        />
      </div>
    </div>
  );
}
