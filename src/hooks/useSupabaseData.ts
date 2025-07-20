import { useState, useEffect } from 'react';
import { dbService, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useSupabaseData<T>(
  fetchFunction: (agencyId: string) => Promise<T[]>,
  dependencies: any[] = []
) {
  const { user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour obtenir un agencyId valide
  const getValidAgencyId = (): string => {
    // Utiliser l'agencyId de l'utilisateur ou l'UUID de démonstration par défaut
    return user?.agencyId || 'b2c3d4e5-f6a7-8901-2345-678901bcdef0';
  };

  const fetchData = async () => {
    const agencyId = getValidAgencyId();

    // Si Supabase n'est pas configuré, utiliser des données de démonstration
    if (!supabase) {
      setData([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(agencyId);
      setData(result || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      
      // Afficher une notification d'erreur plus conviviale
      if (errorMessage.includes('invalid input syntax for type uuid')) {
        setError('Erreur de configuration. Veuillez vous reconnecter.');
      } else if (errorMessage.includes('permission denied')) {
        setError('Accès refusé. Vérifiez vos permissions.');
      } else if (errorMessage.includes('Failed to fetch')) {
        setError('Problème de connexion. Vérifiez votre connexion internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.agencyId, ...dependencies]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch, setData };
}

export function useSupabaseCreate<T>(
  createFunction: (data: any) => Promise<T>,
  onSuccess?: (data: T) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: any) => {
    if (!data) {
      throw new Error('Données manquantes');
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Création en cours avec les données:', data);
      const result = await createFunction(data);
      console.log('Résultat de la création:', result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      console.error('Error creating data:', err);
      
      let errorMessage = 'Erreur lors de la création';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useSupabaseUpdate<T>(
  updateFunction: (id: string, data: any) => Promise<T>,
  onSuccess?: (data: T) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, data: any) => {
    if (!id || !data) {
      throw new Error('Paramètres manquants');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateFunction(id, data);
      onSuccess?.(result);
      return result;
    } catch (err) {
      console.error('Error updating data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useSupabaseDelete(
  deleteFunction: (id: string) => Promise<void>,
  onSuccess?: () => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = async (id: string) => {
    if (!id) {
      throw new Error('ID manquant');
    }

    // Si Supabase n'est pas configuré, simuler la suppression
    if (!supabase) {
      onSuccess?.();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await deleteFunction(id);
      onSuccess?.();
    } catch (err) {
      console.error('Error deleting data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
}