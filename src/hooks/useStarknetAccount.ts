import { useAccount } from '@starknet-react/core';
import { useAccount } from '@starknet-react/core';

const useStarknetAccount = () => {
  const { account, address, isConnected } = useAccount();
  return { account, address, isConnected };
};

export default useStarknetAccount;
