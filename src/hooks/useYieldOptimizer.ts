import { useState, useEffect } from 'react';
import axios from 'axios';

const useYieldOptimizer = (apiKey: string, riskParams: { tolerance: number; portfolio: number }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const apyResponse = await axios.get(`https://api.covalenthq.com/v1/chains/apy/?key=${apiKey}`);
        const liquidityResponse = await axios.get(`https://api.covalenthq.com/v1/chains/liquidity/?key=${apiKey}`);

        const apyData = apyResponse.data.data.items;
        const liquidityData = liquidityResponse.data.data.items;

        const filteredOpportunities = Object.entries(apyData)
          .map(([chainId, apy]) => ({
            chainId: parseInt(chainId),
            apy,
            liquidityScore: liquidityData[chainId] || 0,
          }))
          .filter((opp) => opp.apy >= riskParams.tolerance * 2 && opp.liquidityScore > 0.7);

        setOpportunities(filteredOpportunities);
        setError(null);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Failed to fetch opportunities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [apiKey, riskParams]);

  return { opportunities, loading, error };
};

export default useYieldOptimizer;
