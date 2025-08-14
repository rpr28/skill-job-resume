import { useState } from 'react';

export function useAISummary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const summarize = async (profile) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Failed to generate summary');
      }

      return result.data.summary;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    summarize,
    loading,
    error,
  };
}
