import { useState, useEffect, useMemo } from 'react';
import { useStarknet, Contract } from '@starknet-react/core';
import YieldOptimizer from '../src/utils/YieldOptimizer';
import { ChainOpportunity, Strategy } from 'types';

const CHAIN_LOGOS: { [key: number]: string } = {
    1: '🦄', // Ethereum
    43114: '❄️', // Avalanche
    81457: '💥' // Blast
  };
  

export default function AutonomousYieldArchitect() {
    const { account } = useStarknet();
    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const [opportunities, setOpportunities] = useState<ChainOpportunity[]>([]);
    
    // Initialize Services
    const optimizer = new YieldOptimizer(process.env.COVALENT_KEY!);
    const nillion = new NillionVaultManager(process.env.NILLION_CLUSTER_ID!);
  
    useEffect(() => {
      const initializeStrategy = async () => {
        if (!account) return;
  
        // 1. Store risk profile in Nillion
        const riskProfile = { tolerance: 75, portfolio: 10000 };
        const secretsId = await nillion.storeRiskProfile(riskProfile);
        
        // 2. Calculate optimal strategy
        const opportunities = await optimizer.calculateOptimalStrategy(
          riskProfile,
          ['ETH', 'USDC']
        );
        
        // 3. Update state
        setStrategy({
          riskScore: riskProfile.tolerance,
          targetChains: opportunities.map(o => o.chainId),
          minAPY: Math.min(...opportunities.map(o => o.apy)),
          encryptedSecretsId: secretsId
        });
        setOpportunities(opportunities);
      };
  
      initializeStrategy();
    }, [account]);
  
    return (
      <div className="container">
        <header>
          <h1>🚀 Autonomous Yield Architect</h1>
          <p>Powered by Starknet, Nillion, and Covalent</p>
        </header>
  
        <section className="dashboard">
          <div className="strategy-card">
            <h2>Active Strategy</h2>
            {strategy ? (
              <>
                <p>🔒 Encrypted Profile ID: {strategy.encryptedSecretsId?.slice(0, 12)}...</p>
                <p>🎯 Target Minimum APY: {strategy.minAPY}%</p>
                <p>📈 Risk Score: {strategy.riskScore}/100</p>
              </>
            ) : (
              <p>Loading strategy...</p>
            )}
          </div>
  
          <div className="opportunities-grid">
            <h2>✨ Top Opportunities</h2>
            <div className="chain-list">
              {opportunities.map((opp) => (
                <div key={opp.chainId} className="chain-card">
                  <div className="chain-logo">
                    {CHAIN_LOGOS[opp.chainId] || '⛓️'}
                  </div>
                  <div className="chain-info">
                    <h3>Chain {opp.chainId}</h3>
                    <p>APY: {opp.apy}%</p>
                    <p>Liquidity: {Math.round(opp.liquidityScore * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
  
        <footer>
          <p>🔗 Deployed on OpSec Network | 🛡️ MPC by Nillion</p>
        </footer>
      </div>
    );
  }
  