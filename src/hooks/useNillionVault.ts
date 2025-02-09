import { useState } from 'react';
import { NillionClient } from '@nillion/nillion-client-js';

const useNillionVault = (clusterId: string) => {
  const [encryptedSecretsId, setEncryptedSecretsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = new NillionClient({ clusterId });

  const storeRiskProfile = async (profile: Record<string, any>) => {
    try {
      setLoading(true);
      const secrets = new Map(Object.entries(profile));
      const collection = await client.createCollection('risk-profile', secrets);
      setEncryptedSecretsId(collection.id);
      setError(null);
    } catch (err) {
      console.error('Error storing risk profile:', err);
      setError('Failed to store risk profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const retrieveRiskProfile = async (collectionId: string): Promise<Record<string, any> | null> => {
    try {
      setLoading(true);
      const profile = await client.getCollection(collectionId);
      setError(null);
      return Object.fromEntries(profile.entries());
    } catch (err) {
      console.error('Error retrieving risk profile:', err);
      setError('Failed to retrieve risk profile. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { encryptedSecretsId, storeRiskProfile, retrieveRiskProfile, loading, error };
};

export default useNillionVault;
