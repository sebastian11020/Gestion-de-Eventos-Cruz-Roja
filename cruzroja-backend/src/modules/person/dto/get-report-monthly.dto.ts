export class GetReportInactivityMonthlyDto {
  groups: GroupReport[];
}

export class GroupReport {
  name: string;
  volunteers: VolunteerReport[];
}

export class VolunteerReport {
  document: string;
  name: string;
  licence: string;
  months: ReportAnnualHours[];
}

export class ReportAnnualHours {
  month: string;
  hours: string;
}
