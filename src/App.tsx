import React, { useMemo, useEffect } from 'react';
import Header from './components/Header';
import StrategyCard from './components/StrategyCard';
import OpportunityCard from './components/OpportunityCard';
import useStarknetAccount from './hooks/useStarknetAccount';
import useYieldOptimizer from './hooks/useYieldOptimizer';
import useNillionVault from './hooks/useNillionVault';
import useYieldArchitectContract from './hooks/useYieldArchitectContract';

const App = () => {
  const { account, isConnected } = useStarknetAccount();
  const apiKey = process.env.REACT_APP_COVALENT_API_KEY!;
  const nillionClusterId = process.env.REACT_APP_NILLION_CLUSTER_ID!;
  const contractAddress = process.env.REACT_APP_YIELD_ARCHITECT_CONTRACT_ADDRESS!;
  const abi = require('../contracts/YieldArchitect.json'); // ABI of the deployed contract

  const riskParams = useMemo(() => ({ tolerance: 75, portfolio: 10000 }), []);
  const { opportunities, loading, error } = useYieldOptimizer(apiKey, riskParams);
  const { encryptedSecretsId, storeRiskProfile, loading: nillionLoading, error: nillionError } =
    useNillionVault(nillionClusterId);
  const { storeStrategy, strategy, isReading, readError } = useYieldArchitectContract(contractAddress, abi);

  // Store risk profile and strategy when the app initializes
  useEffect(() => {
    if (isConnected && !encryptedSecretsId) {
      storeRiskProfile(riskParams);
    }
    if (isConnected && encryptedSecretsId) {
      storeStrategy();
    }
  }, [isConnected, encryptedSecretsId, storeRiskProfile, storeStrategy, riskParams]);

  if (!isConnected) {
    return <p>Please connect your Starknet wallet.</p>;
  }

  if (nillionLoading || isReading) {
    return <p>Loading...</p>;
  }

   // Handle errors gracefully
   const handleError = () => {
    if (nillionError) {
      return <p>Error storing risk profile: {typeof nillionError === 'string' ? nillionError : 'Unknown error'}</p>;
    }
    if (readError) {
      return <p>Error interacting with smart contract: {typeof readError === 'string' ? readError : 'Unknown error'}</p>;
    }
    return null;
  };

  const errorMessage = handleError();
  if (errorMessage) {
    return errorMessage;
  }

  return (
    <div className="app-container">
      <Header />
      <StrategyCard
        strategy={{
          riskScore: riskParams.tolerance,
          targetChains: opportunities.map((opp: any) => opp.chainId),
          minAPY: Math.min(...opportunities.map((opp: any) => opp.apy)),
          encryptedSecretsId,
        }}
      />
      <div className="opportunities-grid">
        <h2>✨ Top Opportunities</h2>
        {loading ? (
          <p>Loading opportunities...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          opportunities.map((opp: any) => (
            <OpportunityCard key={opp.chainId} {...opp} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
