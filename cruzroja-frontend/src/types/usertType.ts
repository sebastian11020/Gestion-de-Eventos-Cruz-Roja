export type FormState = {
  typeDocument?: string;
  document?: string;
  carnet?: string;
  name?: string;
  lastName?: string;
  bloodType?: string;
  sex?: string;
  state: string;
  bornDate?: string;
  department?: string;
  city?: string;
  zone?: string;
  address?: string;
  email: string;
  cellphone?: string;
  emergencyContact: {
    name?: string;
    relationShip?: string;
    phone?: string;
  };
  sectional: {
    id?: string;
    city: string;
  };
  group: {
    id: string;
    name: string;
    program: {
      id: string;
      name: string;
    };
  };
  eps: { name?: string; type?: string };
  totalHours?: string;
  monthHours?: string;
  picture?: string;
};

export type sectional = {
  id: string;
  city: string;
  type?: string;
  numberVolunteers?: string;
  numberGroups?: string;
  leader?: {
    document: string;
    name: string;
  };
};

export type group = {
  id?: string;
  name: string;
  numberPrograms?: string;
  leader?: {
    document: string;
    name: string;
  };
  program: program[];
};

export type program = {
  id: string;
  name: string;
  leader?: string;
};

export type leaderDataTable = {
  typeDocument: string;
  document: string;
  name: string;
  state: string;
  group: string;
};
