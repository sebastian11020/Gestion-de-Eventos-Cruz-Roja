import { SECTIONAL_TYPES } from "@/const/consts";
import { cities } from "@/components/volunteer/constants";

export type City = { id: string; name: string; department: string };
export type Department = { id: string; name: string; children: cities[] };

export type FormState = {
  cityId: string;
  type: (typeof SECTIONAL_TYPES)[number] | "";
};
