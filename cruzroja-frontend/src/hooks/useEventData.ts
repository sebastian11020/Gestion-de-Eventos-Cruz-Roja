import { useEffect, useState } from "react";
import type { scope, classificationEvent, frame } from "@/types/eventsType";
import {
    getAmbitService,
    getClassificationService, getEventService,
    getFrameService,
} from "@/services/serviceGetEvent";
import {event, Volunteer} from "@/types/usertType";
import {getPersonEvent} from "@/services/serviceGetPerson";

export function useEventData() {
  const [scopes, setScopes] = useState<scope[]>([]);
  const [classificationEvent, setClassificationEvent] = useState<
    classificationEvent[]
  >([]);
  const [frame, setFrame] = useState<frame[]>([]);
  const [events, setEvents] = useState<event[]>([]);
  const [person,setPerson] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function loadAll() {
    setLoading(true);
    try {
      const [scopesData, classificationData, frameData,eventData,personData] = await Promise.all([
        getAmbitService(),
        getClassificationService(),
        getFrameService(),
          getEventService(),
          getPersonEvent()
      ]);
      setScopes(scopesData);
      setClassificationEvent(classificationData);
      setFrame(frameData);
      setEvents(eventData);
      setPerson(personData);
      console.log(eventData);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadAll();
  }, []);
  return { scopes, classificationEvent, frame,events,person, loading };
}
