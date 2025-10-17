export type FormState = {
  id?: string;
  typeDocument?: string;
  document?: string;
  carnet?: string;
  name?: string;
  lastName?: string;
  bloodType?: string;
  sex?: string;
  gender?: string;
  skills?:skill[];
  state: {
    id: string;
    name: string;
  };
  bornDate?: string;
  department?: string;
  city?: {
    id: string;
    name: string;
  };
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
  eps: { id?: string; name?: string; type?: string };
  totalHours?: string;
  monthHours?: string;
};

export type formCreatePerson = {
  id: string;
  type_document: string;
  document: string;
  carnet: string;
  name: string;
  lastName: string;
  email: string;
  password?: string;
  sex: string;
  gender: string;
  phone: string;
  skills:string[]
  emergencyContact: {
    name: string;
    relationShip: string;
    phone: string;
  };
  blood: string;
  id_state: string;
  birthDate: string;
  address: {
    streetAddress: string;
    zone: string;
  };
  id_group?: string;
  id_program?: string;
  id_headquarters: string;
  id_location: string;
  id_eps: string;
  type_affiliation: string;
};

export type sectional = {
  id?: string;
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
  id_group?: string;
  name: string;
  sectional?: {
    id: string;
    name: string;
  };
  numberVolunteers?: string;
  numberPrograms?: string;
  leader?: {
    document?: string;
    name: string;
  };
  program?: program[];
};

export type program = {
  id?: string;
  id_program?: string;
  name: string;
  sectional?: {
    id: string;
    name: string;
  };
  group?: string;
  numberVolunteers?: string;
  leader?: {
    document?: string;
    name?: string;
  };
};

export type leaderDataTable = {
  typeDocument: string;
  document: string;
  name: string;
  state: string;
  group?: string;
  program?: string;
};

export type createSectional = {
  idLocation: string;
  type: string;
  leader?: string;
};

export type createGroup = {
  idGroup?: string;
  name?: string;
  idHeadquarters?: string;
  leader?: string;
};

export type event = {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: string;
  startAt: string;
};

export type createProgram = {
  name?: string;
  leader?: string;
  id_group?: string;
  idProgram?: string;
  idHeadquarters?: string;
};
export type createEvent = {
  ambit: string;
  classification: string;
  applyDecreet: boolean;
  marcActivity: string;
  sectional: string;
  group: string;
  startDate: string;
  endDate: string;
  name: string;
  description: string;
  department: string;
  city: string;
  attendant: {
    name: string;
    phone: string;
  };
  capacity: string;
  isVirtual: boolean;
  latitud: string;
  longitud: string;
};

export type eps = {
  id: string;
  name: string;
};

export type state = {
  id: string;
  name: string;
  type: string;
};

export type user = {
  name: string;
  lastName: string;
  role: string;
};

export type skill = {
    id: string;
    name?: string;
}
