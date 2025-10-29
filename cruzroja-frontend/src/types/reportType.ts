export type groupReport = {
    groups: {
        name: string;
        volunteers: {
            document: string;
            name: string;
            license: string;
            months: {
                name: string;
                hours: string;
            }[];
        }[];
    }[];
};
