import { useState, useEffect } from 'react';

const cache = {};

export function useFetch(url) {
  const [state, setState] = useState({
    data: null,
    status: 'idle',
    error: null,
  });

  useEffect(() => {
    if (!url) {
      setState({ data: null, status: 'idle', error: null });
      return;
    }

    let isMounted = true;

    async function fetchData() {
      if (cache[url]) {
        if (isMounted) {
          setState({
            data: cache[url],
            status: 'success',
            error: null,
          });
        }
        return;
      }

      setState((prev) => ({ ...prev, status: 'loading', error: null }));

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (isMounted) {
          cache[url] = data;
          setState({
            data,
            status: 'success',
            error: null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setState({
            data: null,
            status: 'error',
            error: err.message,
          });
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
}