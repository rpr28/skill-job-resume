import { useState } from 'react';

export function useAIRewrite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const rewrite = async (bullets, context) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/rewrite-bullets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bullets,
          context,
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Failed to rewrite bullets');
      }

      return result.data.variants;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    rewrite,
    loading,
    error,
  };
}
