import { useContractWrite, useContractRead } from '@starknet-react/core';

const useYieldArchitectContract = (contractAddress: string, abi: any) => {
  const { writeAsync: storeStrategy } = useContractWrite({
    calls: [
      {
        contractAddress,
        entrypoint: 'store_strategy',
        calldata: [],
      },
    ],
  });

  const { data: strategy, isLoading: isReading, error: readError } = useContractRead({
    contractAddress,
    entrypoint: 'retrieve_strategy',
    calldata: [],
  });

  return { storeStrategy, strategy, isReading, readError };
};

export default useYieldArchitectContract;
