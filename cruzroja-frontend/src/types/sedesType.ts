import { SECTIONAL_TYPES } from "@/const/consts";

export type City = { id: string; name: string; department: string };

export type FormState = {
  cityId: string;
  type: (typeof SECTIONAL_TYPES)[number] | "";
};
