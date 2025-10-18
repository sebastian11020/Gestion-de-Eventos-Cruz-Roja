export class GetPersons {
  id: string;
  typeDocument?: string;
  document?: string;
  carnet?: string;
  name?: string;
  lastName?: string;
  bloodType?: string;
  sex?: string;
  gender?: string;
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
  skills?: {
    id: string;
    name: string;
  }[];
}
