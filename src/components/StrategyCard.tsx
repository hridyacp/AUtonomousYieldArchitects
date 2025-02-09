import React from 'react';

type StrategyCardProps = {
  strategy: {
    riskScore: number;
    targetChains: number[];
    minAPY: number;
    encryptedSecretsId?: string;
  };
};

const StrategyCard = ({ strategy }: StrategyCardProps) => {
  return (
    <div className="strategy-card">
      <h2>Active Strategy</h2>
      {strategy ? (
        <>
          <p>🔒 Encrypted Profile ID: {strategy.encryptedSecretsId?.slice(0, 12)}...</p>
          <p>🎯 Target Minimum APY: {strategy.minAPY}%</p>
          <p>📈 Risk Score: {strategy.riskScore}/100</p>
          <p>🔗 Target Chains: {strategy.targetChains.join(', ')}</p>
        </>
      ) : (
        <p>Loading strategy...</p>
      )}
    </div>
  );
};

export default StrategyCard;
