import { useCallback, useEffect, useState } from 'react';
import { requestApi } from './api';

export function useApiList(path) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setLoading(true);
    setError('');
    setVersion((previous) => previous + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    requestApi(path, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setRows(data);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [path, version]);

  return { rows, loading, error, refresh };
}
