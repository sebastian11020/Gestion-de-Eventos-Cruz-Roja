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
  profession: string;
  department?: string;
  city?: string;
  zone?: string;
  address?: string;
  email?: string;
  cellphone?: string;
  emergencyContact: {
    name?: string;
    relationShip?: string;
    phone?: string;
  };
  eps: { name?: string; type?: string };
  totalHours?: string;
  monthHours?: string;
  picture?: string;
};
