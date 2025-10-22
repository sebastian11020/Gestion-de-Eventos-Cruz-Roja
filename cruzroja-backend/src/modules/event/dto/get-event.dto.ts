export class GetEventCardDDto {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: string;
  streetAddress: string;
  leader: {
    id: string;
    name: string;
  };
  state: string;
  startAt: Date;
}
