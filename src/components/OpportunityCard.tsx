import React from 'react';

type OpportunityCardProps = {
  chainId: number;
  apy: number;
  liquidityScore: number;
};

const CHAIN_LOGOS: { [key: number]: string } = {
  1: '🦄', // Ethereum
  43114: '❄', // Avalanche
  81457: '💥' // Blast
};

const OpportunityCard = ({ chainId, apy, liquidityScore }: OpportunityCardProps) => {
  return (
    <div className="opportunity-card" aria-label={`Chain ${chainId} Opportunity`}>
      <div className="chain-logo">{CHAIN_LOGOS[chainId] || '⛓'}</div>
      <div className="chain-info">
        <h3>Chain {chainId}</h3>
        <p>APY: {apy}%</p>
        <p>Liquidity: {Math.round(liquidityScore * 100)}%</p>
      </div>
    </div>
  );
};

export default OpportunityCard;
