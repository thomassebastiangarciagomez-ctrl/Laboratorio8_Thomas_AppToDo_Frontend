import { useState, useEffect, useCallback } from "react";
import { getSummary } from "../../../api/adminApi";

export function useAdminSummary() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadSummary = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setSummary(await getSummary());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSummary();
    }, [loadSummary]);

    return { summary, loading, error, reload: loadSummary };
}
