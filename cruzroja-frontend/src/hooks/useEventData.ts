import { useEffect, useState } from "react";
import type { scope, classificationEvent, frame } from "@/types/eventsType";
import {
  getAmbitService,
  getClassificationService,
  getEventService,
  getFrameService,
  getLeaderEvent,
  getSkillsPerson,
} from "@/services/serviceGetEvent";
import { event, leaderDataTable, Volunteer } from "@/types/usertType";
import { getPersonEvent } from "@/services/serviceGetPerson";
import {Department} from "@/types/sedesType";
import {getDepartments} from "@/services/serviceSelect";

export function useEventData() {
  const [scopes, setScopes] = useState<scope[]>([]);
  const [classificationEvent, setClassificationEvent] = useState<
    classificationEvent[]
  >([]);
  const [frame, setFrame] = useState<frame[]>([]);
  const [events, setEvents] = useState<event[]>([]);
  const [person, setPerson] = useState<Volunteer[]>([]);
  const [users, setUsers] = useState<leaderDataTable[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function loadAll() {
    setLoading(true);
    try {
      const [
        scopesData,
        classificationData,
        frameData,
        eventData,
        personData,
        userData,
        skillsData,
          departmentsData,
      ] = await Promise.all([
        getAmbitService(),
        getClassificationService(),
        getFrameService(),
        getEventService(),
        getPersonEvent(),
        getLeaderEvent(),
        getSkillsPerson(),
          getDepartments(),
      ]);
      setScopes(scopesData);
      setClassificationEvent(classificationData);
      setFrame(frameData);
      setEvents(eventData);
      setPerson(personData);
      setUsers(userData);
      setSkills(skillsData);
      setDepartments(departmentsData);
      console.log(departmentsData);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadAll();
  }, []);
  return {
    scopes,
    classificationEvent,
    frame,
    events,
    users,
    person,
    skills,
    loading,
      departments,
    reload: loadAll,
  };
}
