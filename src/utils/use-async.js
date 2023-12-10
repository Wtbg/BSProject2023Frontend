// useAsync.js
import { useState } from 'react';

export function useAsync() {
    const [isLoading, setLoading] = useState(false);
    const [isIdle, setIdle] = useState(true);
    const [isError, setError] = useState(false);
    const [error, setErrorInfo] = useState(null);

    const run = async (asyncFunction) => {
        try {
            setIdle(false);
            setLoading(true);
            // 执行异步操作
            await asyncFunction();
        } catch (error) {
            setError(true);
            setErrorInfo(error);
        } finally {
            setLoading(false);
        }
    };

    return { run, isLoading, isIdle, isError, error };
}
