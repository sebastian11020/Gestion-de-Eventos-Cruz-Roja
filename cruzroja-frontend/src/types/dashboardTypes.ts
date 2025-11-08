export type events = {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  textColor: string;
};

export type cards = {
  total_user: string;
  leader: string;
  total_coordinators_group: string;
  total_coordinators_program: string;
  total_volunteers: string;
  active_events: string;
};

export type TopVolunteer = {
  name: string;
  hours: number;
};

export type Notifications = {
  id: string;
  description: string;
};
