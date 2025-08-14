import { useState } from 'react';

export function useATSScore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const score = async (resumeText, jobText) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/ats-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobText,
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Failed to calculate ATS score');
      }

      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    score,
    loading,
    error,
  };
}
