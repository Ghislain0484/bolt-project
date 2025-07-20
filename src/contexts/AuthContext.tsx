import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, dbService } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        // Check for demo user in localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
          return;
        }

        // Only check Supabase if configured
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Get user profile from database using Supabase auth user ID
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!error && userData) {
              const user: User = {
                id: userData.id,
                email: userData.email,
                firstName: userData.first_name,
                lastName: userData.last_name,
                role: userData.role,
                agencyId: userData.agency_id,
                avatar: userData.avatar,
                createdAt: new Date(userData.created_at),
              };
              setUser(user);
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    let authListener: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          localStorage.removeItem('user');
        }
      });
      authListener = data;
    }

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo credentials for development
      const demoUsers = [
        {
          id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
          email: 'marie.kouassi@agence.com',
          password: 'demo123',
          firstName: 'Marie',
          lastName: 'Kouassi',
          role: 'director',
          agencyId: 'b2c3d4e5-f6a7-8901-2345-678901bcdef0',
          avatar: null,
        },
        {
          id: 'c3d4e5f6-a7b8-9012-3456-789012cdef01',
          email: 'manager1@agence.com',
          password: 'demo123',
          firstName: 'Jean',
          lastName: 'Bamba',
          role: 'manager',
          agencyId: 'b2c3d4e5-f6a7-8901-2345-678901bcdef0',
          avatar: null,
        },
        {
          id: 'd4e5f6a7-b8c9-0123-4567-890123def012',
          email: 'agent1@agence.com',
          password: 'demo123',
          firstName: 'Koffi',
          lastName: 'Martin',
          role: 'agent',
          agencyId: 'b2c3d4e5-f6a7-8901-2345-678901bcdef0',
          avatar: null,
        }
      ];

      // Check demo credentials first
      const demoUser = demoUsers.find(u => u.email === email && u.password === password);
      
      if (demoUser) {
        const user: User = {
          id: demoUser.id,
          email: demoUser.email,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          role: demoUser.role as 'director' | 'manager' | 'agent',
          agencyId: demoUser.agencyId,
          avatar: demoUser.avatar,
          createdAt: new Date(),
        };
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Create anonymous session for RLS if Supabase is available
        if (supabase) {
          try {
            await supabase.auth.signInAnonymously();
          } catch (error) {
            console.warn('Could not create anonymous session:', error);
          }
        }
        
        return;
      }

      // If not demo user, try Supabase authentication
      if (supabase) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError) throw authError;

          // Get user profile from database using authenticated user ID
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (userError) throw userError;

          const user: User = {
            id: userData.id,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            role: userData.role,
            agencyId: userData.agency_id,
            avatar: userData.avatar,
            createdAt: new Date(userData.created_at),
          };
          
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          return;
        } catch (supabaseError) {
          throw new Error('Identifiants incorrects');
        }
      } else {
        throw new Error('Identifiants incorrects');
      }
      
    } catch (error) {
      throw new Error('Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};