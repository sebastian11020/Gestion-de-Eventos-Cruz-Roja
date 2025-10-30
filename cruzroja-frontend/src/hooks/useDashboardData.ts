import { useEffect, useState } from "react";
import {cards, events, TopVolunteer} from "@/types/dashboardTypes";
import {getEventsCalendar, getPersonDashboard, getPersonPodium} from "@/services/serviceSelect";



export function useDashboardData() {
    const [events,setEvents] = useState<events[]>([]);
    const [cards,setCards] = useState<cards>();
    const [top ,setTop] = useState<TopVolunteer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    async function loadAll() {
        setLoading(true);
        try {
            const [eventsData,cardsData,topData] = await Promise.all([
                getEventsCalendar(),
                getPersonDashboard(),
                getPersonPodium()
            ]);
            setEvents(eventsData);
            setCards(cardsData);
            setTop(topData)
            console.log(topData)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    return {events,cards,top, loading, reload: loadAll };
}
