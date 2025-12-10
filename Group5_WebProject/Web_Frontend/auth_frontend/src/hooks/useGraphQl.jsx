import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useGraphQL = (query, variables = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:4001/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query,
            variables
          })
        });

        const result = await response.json();

        if (isMounted) {
          if (result.errors) {
            setError(result.errors[0]);
          } else {
            setData(result.data);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [query, variables, token]);

  return { data, loading, error };
};

export const useMutation = () => {
  const { token } = useAuth();

  const mutate = async (query, variables = {}) => {
    try {
      const response = await fetch('http://localhost:4001/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data;
    } catch (error) {
      throw error;
    }
  };

  return { mutate };
};