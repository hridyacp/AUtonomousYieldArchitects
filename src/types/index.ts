// ======================== Strategy Type ========================
export type Strategy = {
  riskScore: number; // User's risk tolerance score (0-100)
  targetChains: number[]; // List of target chain IDs
  minAPY: number; // Minimum acceptable APY
  encryptedSecretsId?: string;// Encrypted ID for stored risk profile
};

// ======================== Chain Opportunity Type ========================
export type ChainOpportunity = {
  chainId: number; // Blockchain network ID
  apy: number; // Annual Percentage Yield
  liquidityScore: number; // Liquidity score (0-1)
};
