import React from 'react';
import { StarknetConfig } from '@starknet-react/core';

// Define the StarknetProvider component
const StarknetProvider = ({ children }) => {
  return (
    <StarknetConfig>
      {children}
    </StarknetConfig>
  );
};

export default StarknetProvider;
