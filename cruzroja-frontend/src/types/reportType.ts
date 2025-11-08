export type groupReport = {
  groups: {
    name: string;
    volunteers: {
      document: string;
      name: string;
      licence: string;
      months: {
        name: string;
        hours: string;
      }[];
    }[];
  }[];
};
export type volunteers = {
  document: string;
  name: string;
  licence: string;
  months: {
    name: string;
    hours: string;
  }[];
};
