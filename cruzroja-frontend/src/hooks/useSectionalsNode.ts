import {useEffect, useState} from "react";
import {getSectionalInfo} from "@/services/serviceCreateSectional";
import type {SectionalNode} from "@/types/programType";
import type { cities } from "@/components/volunteer/constants";
import type {eps,state} from "@/types/usertType"
import {getCities, getEPS, getState} from "@/services/serviceSelect";

export function useSectionalsNode() {
    const [sectionals, setSectionals] = useState<SectionalNode[]>([]);
    const [cities,setCities] = useState<cities[]>()
    const [eps,setEps] = useState<eps[]>([])
    const [state, setState] = useState<state[]>([])
    const [loading, setLoading] = useState(false);

    async function loadAll(){
        setLoading(true);
        try {
            const [sectionalsData,citiesData,epsData,stateData] = await Promise.all([
                getSectionalInfo(),
                getCities(),
                getEPS(),
                getState()
            ])
            setSectionals(sectionalsData);
            setCities(citiesData);
            setEps(epsData);
            setState(stateData);
            console.log(sectionalsData)
        }finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadAll()
    }, []);
    return {sectionals,cities,eps,state, loading, reload: loadAll};
}