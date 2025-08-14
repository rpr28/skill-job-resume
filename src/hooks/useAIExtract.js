import { useState } from 'react';

export function useAIExtract() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const extract = async (raw, role) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/extract-bullets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw,
          role,
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Failed to extract bullets');
      }

      return result.data.bullets;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    extract,
    loading,
    error,
  };
}
