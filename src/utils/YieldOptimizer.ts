import axios from 'axios';
import { ChainOpportunity } from '../types';

class YieldOptimizer {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('Covalent API key is required');
    this.apiKey = apiKey;
  }

  async calculateOptimalStrategy(
    riskParams: { tolerance: number; portfolio: number },
    currentHoldings: string[]
  ): Promise<ChainOpportunity[]> {
    try {
      // Fetch APY data from Covalent
      const apyResponse = await axios.get(`https://api.covalenthq.com/v1/chains/apy/?key=${this.apiKey}`);
      const apyData = apyResponse.data.data.items;

      // Fetch liquidity scores from Covalent
      const liquidityResponse = await axios.get(`https://api.covalenthq.com/v1/chains/liquidity/?key=${this.apiKey}`);
      const liquidityData = liquidityResponse.data.data.items;

      // Map and filter opportunities
      return Object.entries(apyData)
        .map(([chainId, apy]) => ({
          chainId: parseInt(chainId),
          apy,
          liquidityScore: liquidityData[chainId] || 0,
        }))
        .filter(
          (opp) =>
            opp.apy >= riskParams.tolerance * 2 && opp.liquidityScore > 0.7
        );
    } catch (error) {
      console.error('Error calculating optimal strategy:', error);
      throw new Error('Failed to fetch opportunities. Please try again.');
    }
  }
}

export default YieldOptimizer;
