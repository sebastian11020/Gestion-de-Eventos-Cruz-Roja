export class GetEventCardDDto {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  department: {
    id: string;
    name: string;
  };
  city: {
    id: string;
    name: string;
  };
  capacity: string;
  streetAddress: string;
  leader: {
    id: string;
    name: string;
  };
  state: string;
  startAt: Date;
  skill_quota: GetSkillQuota[];
  is_leader: boolean;
  is_participant: boolean;
  is_adult: boolean;
}

export class GetSkillQuota {
  id: string;
  name: string;
  quantity: string;
}
