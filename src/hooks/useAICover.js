import { useState } from 'react';

export function useAICover() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (profile, job) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          job,
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Failed to generate cover letter');
      }

      return result.data.letter;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generate,
    loading,
    error,
  };
}
