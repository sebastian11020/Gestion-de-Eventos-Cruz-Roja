import { useEffect, useState } from "react";
import { getSectionalInfo } from "@/services/serviceCreateSectional";
import type { SectionalNode } from "@/types/programType";
import type { cities } from "@/components/volunteer/constants";
import type {eps, skill, state} from "@/types/usertType";
import {getCities, getEPS, getSkills, getState} from "@/services/serviceSelect";

export function useSectionalsNode() {
  const [sectionals, setSectionals] = useState<SectionalNode[]>([]);
  const [cities, setCities] = useState<cities[]>();
  const [eps, setEps] = useState<eps[]>([]);
  const [state, setState] = useState<state[]>([]);
  const [skills,setSkills] = useState<skill[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [sectionalsData, citiesData, epsData, stateData, skillData] =
        await Promise.all([
          getSectionalInfo(),
          getCities(),
          getEPS(),
          getState(),
          getSkills(),
        ]);
      setSectionals(sectionalsData);
      setCities(citiesData);
      setEps(epsData);
      setState(stateData);
      setSkills(skillData);
      console.log(skillData);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadAll();
  }, []);
  return { sectionals, cities, eps, state,skills, loading, reload: loadAll };
}
