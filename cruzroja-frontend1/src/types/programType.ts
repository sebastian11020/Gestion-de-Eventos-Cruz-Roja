export type ProgramItem = { id: string; name: string };
export type GroupNode = { id: string; name: string; program: ProgramItem[] };
export type SectionalNode = { id: string; city: string; groups: GroupNode[] };

export type FormState = {
  sectional: string;
  group: string;
  name: string;
  programId?: string;
};
