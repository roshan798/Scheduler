import { useState } from 'react';

type FetchCallback<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

const useFetch = <T, Args extends unknown[]>(cb: FetchCallback<T, Args>) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fn = async (...args: Args): Promise<void> => {
        setLoading(true);
        try {
            const res = await cb(...args);
            setData(res);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fn };
};

export default useFetch;
