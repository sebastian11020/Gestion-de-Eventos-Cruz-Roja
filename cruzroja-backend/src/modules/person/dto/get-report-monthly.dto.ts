export class GetReportInactivityMonthlyDto {
  name: string;
  volunteers: {
    document: string;
    name: string;
    licence: string;
    months: {
      month: string;
      hours: string;
    }[];
  }[];
}
