const API_BASE = import.meta.env.VITE_API_URL || '';

export function useFetch(path) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!path) return;

        let isMounted = true;
        setLoading(true);
        setError(null);

        fetch(`${API_BASE}/api${path}`)
            .then((res) => {
                if (!res.ok) throw new Error(`요청 실패: ${res.status}`);
                return res.json();
            })
            .then((json) => {
                if (isMounted) { setData(json); setLoading(false); }
            })
            .catch((err) => {
                if (isMounted) { setError(err.message); setLoading(false); }
            });

        return () => { isMounted = false; };
    }, [path]);

    return { data, loading, error };
}