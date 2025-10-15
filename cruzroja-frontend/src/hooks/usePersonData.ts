import { useState, useEffect } from "react";
import type {FormState} from "@/types/usertType";
import {getPerson} from "@/services/serviceGetPerson";

export function usePersonData() {
    const [users,setUsers] = useState<FormState[]>([])
    const [loading, setLoading] = useState(false);

    async function loadAll() {
        setLoading(true);
        try {
            const [usersData] = await Promise.all([
                getPerson()
            ]);
            setUsers(usersData);
            console.log(usersData);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadAll();
    }, []);
    return {users, loading, reload: loadAll };
}
