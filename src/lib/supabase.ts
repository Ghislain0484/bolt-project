import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables - using demo mode');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database service functions
export const dbService = {
  // Agencies
  async createAgency(agency: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('agencies')
      .insert(agency)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAgency(id: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Users
  async createUser(user: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    // Validation des données
    if (!user.email || !user.first_name || !user.last_name) {
      throw new Error('Données utilisateur manquantes');
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getUsers(agencyId: string) {
    if (!supabase) return [];
    if (!agencyId) throw new Error('Agency ID manquant');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('agency_id', agencyId);
    if (error) throw error;
    return data;
  },

  async updateUser(id: string, updates: any) {
    if (!supabase) throw new Error('Supabase not configured');
    if (!id || !updates) throw new Error('Paramètres manquants');
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Owners
  async createOwner(owner: any) {
    if (!supabase) {
      // Mode démonstration - créer un propriétaire fictif
      return {
        id: `owner_${Date.now()}`,
        ...owner,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    // Validation stricte des données obligatoires
    const requiredFields = ['first_name', 'last_name', 'phone', 'agency_id', 'address', 'city'];
    for (const field of requiredFields) {
      if (!owner[field] || (typeof owner[field] === 'string' && !owner[field].trim())) {
        throw new Error(`Le champ ${field} est obligatoire`);
      }
    }
    
    // Validation des types de données
    if (typeof owner.children_count !== 'number' || owner.children_count < 0) {
      throw new Error('Le nombre d\'enfants doit être un nombre positif');
    }
    
    // Validation des énumérations
    const validPropertyTitles = ['attestation_villageoise', 'lettre_attribution', 'permis_habiter', 'acd', 'tf', 'cpf', 'autres'];
    if (!validPropertyTitles.includes(owner.property_title)) {
      throw new Error('Type de titre de propriété invalide');
    }
    
    const validMaritalStatuses = ['celibataire', 'marie', 'divorce', 'veuf'];
    if (!validMaritalStatuses.includes(owner.marital_status)) {
      throw new Error('Situation matrimoniale invalide');
    }
    
    try {
      console.log('Tentative de création du propriétaire:', owner);
      
      const { data, error } = await supabase
        .from('owners')
        .insert(owner)
        .select()
        .single();
        
      if (error) {
        console.error('Erreur Supabase:', error);
        
        // Messages d'erreur spécifiques
        if (error.code === '23505') {
          throw new Error('Ce propriétaire existe déjà (téléphone en double)');
        } else if (error.code === '23503') {
          throw new Error('Agence non trouvée');
        } else if (error.code === '42501' || error.message.includes('permission denied')) {
          throw new Error('Permissions insuffisantes');
        } else if (error.code === 'PGRST301') {
          throw new Error('Erreur d\'authentification - veuillez vous reconnecter');
        } else {
          throw new Error(`Erreur base de données: ${error.message}`);
        }
      }
      
      console.log('Propriétaire créé avec succès:', data);
      return data;
      
    } catch (dbError) {
      console.error('Erreur lors de l\'insertion:', dbError);
      throw dbError;
    }
  },

  async getOwners(agencyId: string) {
    if (!supabase) {
      // Mode démonstration
      return [];
    }
    
    if (!agencyId) {
      throw new Error('ID d\'agence manquant');
    }
    
    const { data, error } = await supabase
      .from('owners')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Erreur lors de la récupération des propriétaires:', error);
      throw new Error(`Impossible de charger les propriétaires: ${error.message}`);
    }
    
    return data || [];
  },

  async updateOwner(id: string, updates: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('owners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteOwner(id: string) {
    if (!supabase) return;
    
    const { error } = await supabase
      .from('owners')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async searchOwnersHistory(searchTerm: string) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('owners')
      .select(`
        *,
        agencies(name)
      `)
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .limit(50);
    if (error) throw error;
    return data;
  },

  // Properties
  async createProperty(property: any) {
    if (!supabase) {
      return {
        id: `property_${Date.now()}`,
        ...property,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    // Validation des données obligatoires
    if (!property.title || !property.owner_id || !property.agency_id) {
      throw new Error('Données propriété manquantes');
    }
    
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getProperties(agencyId: string) {
    if (!supabase) return [];
    if (!agencyId) throw new Error('Agency ID manquant');
    
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        owners(first_name, last_name)
      `)
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateProperty(id: string, updates: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProperty(id: string) {
    if (!supabase) return;
    
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Tenants
  async createTenant(tenant: any) {
    if (!supabase) {
      return {
        id: `tenant_${Date.now()}`,
        ...tenant,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    // Validation des données obligatoires
    if (!tenant.first_name || !tenant.last_name || !tenant.phone || !tenant.agency_id) {
      throw new Error('Données locataire manquantes');
    }
    
    const { data, error } = await supabase
      .from('tenants')
      .insert(tenant)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getTenants(agencyId: string) {
    if (!supabase) return [];
    if (!agencyId) throw new Error('Agency ID manquant');
    
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateTenant(id: string, updates: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteTenant(id: string) {
    if (!supabase) return;
    
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async searchTenantsHistory(searchTerm: string, paymentStatus?: string) {
    if (!supabase) return [];
    
    let query = supabase
      .from('tenants')
      .select(`
        *,
        agencies(name)
      `)
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);

    if (paymentStatus && paymentStatus !== 'all') {
      query = query.eq('payment_status', paymentStatus);
    }

    const { data, error } = await query.limit(50);
    if (error) throw error;
    return data;
  },

  // Contracts
  async createContract(contract: any) {
    if (!supabase) {
      return {
        id: `contract_${Date.now()}`,
        ...contract,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    // Validation des données obligatoires
    if (!contract.property_id || !contract.owner_id || !contract.tenant_id || !contract.agency_id) {
      throw new Error('Données contrat manquantes');
    }
    
    const { data, error } = await supabase
      .from('contracts')
      .insert(contract)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getContracts(agencyId: string) {
    if (!supabase) return [];
    if (!agencyId) throw new Error('Agency ID manquant');
    
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        properties(title),
        owners(first_name, last_name),
        tenants(first_name, last_name)
      `)
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateContract(id: string, updates: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('contracts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteContract(id: string) {
    if (!supabase) return;
    
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Announcements
  async createAnnouncement(announcement: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcement)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAnnouncements() {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('announcements')
      .select(`
        *,
        agencies(name),
        properties(title, location)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Messages
  async createMessage(message: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getMessages(userId: string) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!sender_id(first_name, last_name),
        receiver:users!receiver_id(first_name, last_name)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Notifications
  async createNotification(notification: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getNotifications(userId: string) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async markNotificationAsRead(id: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};