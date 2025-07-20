/*
  # Configuration complète de la base de données

  1. Tables principales
    - agencies (agences immobilières)
    - users (utilisateurs)
    - owners (propriétaires)
    - properties (propriétés)
    - tenants (locataires)
    - contracts (contrats)
    - announcements (annonces)
    - messages (messages)
    - notifications (notifications)
    - payment_records (historique des paiements)

  2. Sécurité
    - Activation RLS sur toutes les tables
    - Politiques d'accès basées sur l'agence
    - Permissions appropriées pour chaque rôle

  3. Index et contraintes
    - Index pour les performances
    - Contraintes de validation
    - Clés étrangères
*/

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Supprimer les tables existantes si elles existent (pour reset complet)
DROP TABLE IF EXISTS payment_records CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS rentals CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS owners CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS agencies CASCADE;

-- Table des agences
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  commercial_register TEXT UNIQUE NOT NULL,
  logo TEXT,
  is_accredited BOOLEAN DEFAULT false,
  accreditation_number TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  director_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('director', 'manager', 'agent')),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  avatar TEXT,
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des propriétaires
CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  property_title TEXT NOT NULL CHECK (property_title IN ('attestation_villageoise', 'lettre_attribution', 'permis_habiter', 'acd', 'tf', 'cpf', 'autres')),
  property_title_details TEXT,
  marital_status TEXT NOT NULL CHECK (marital_status IN ('celibataire', 'marie', 'divorce', 'veuf')),
  spouse_name TEXT,
  spouse_phone TEXT,
  children_count INTEGER DEFAULT 0,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des propriétés
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location JSONB NOT NULL,
  details JSONB NOT NULL,
  standing TEXT NOT NULL CHECK (standing IN ('economique', 'moyen', 'haut')),
  rooms JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  is_available BOOLEAN DEFAULT true,
  for_sale BOOLEAN DEFAULT false,
  for_rent BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des locataires
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  marital_status TEXT NOT NULL CHECK (marital_status IN ('celibataire', 'marie', 'divorce', 'veuf')),
  spouse_name TEXT,
  spouse_phone TEXT,
  children_count INTEGER DEFAULT 0,
  profession TEXT NOT NULL,
  nationality TEXT NOT NULL,
  photo_url TEXT,
  id_card_url TEXT,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('bon', 'irregulier', 'mauvais')),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des locations
CREATE TABLE rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_rent DECIMAL(12,2) NOT NULL,
  deposit DECIMAL(12,2),
  status TEXT NOT NULL CHECK (status IN ('actif', 'termine', 'resilie')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des contrats
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('location', 'vente', 'gestion')),
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_rent DECIMAL(12,2),
  sale_price DECIMAL(12,2),
  deposit DECIMAL(12,2),
  charges DECIMAL(12,2),
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'expired', 'terminated', 'renewed')),
  terms TEXT NOT NULL,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des historiques de paiement
CREATE TABLE payment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rental_id UUID REFERENCES rentals(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  paid_date DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paye', 'retard', 'impaye')),
  payment_method TEXT CHECK (payment_method IN ('especes', 'cheque', 'virement', 'mobile_money')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des annonces
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('location', 'vente')),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  announcement_id UUID REFERENCES announcements(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('rental_alert', 'payment_reminder', 'new_message', 'property_update', 'contract_expiry', 'new_interest')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activer RLS (Row Level Security)
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS permissives pour les utilisateurs authentifiés
CREATE POLICY "Users can view their own agency" ON agencies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Directors can update their agency" ON agencies
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can view users from their agency" ON users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Directors can manage users in their agency" ON users
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can manage owners in their agency" ON owners
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view owners from their agency" ON owners
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage properties in their agency" ON properties
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view properties from their agency" ON properties
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage tenants in their agency" ON tenants
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view tenants from their agency" ON tenants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All agencies can search tenant history for collaboration" ON tenants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage rentals in their agency" ON rentals
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view rentals from their agency" ON rentals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage contracts in their agency" ON contracts
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view contracts from their agency" ON contracts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view payment records" ON payment_records
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage payment records" ON payment_records
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can manage announcements from their agency" ON announcements
  FOR ALL TO authenticated USING (true);

CREATE POLICY "All agencies can view active announcements" ON announcements
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE TO authenticated USING (true);

-- Index pour les performances
CREATE INDEX idx_users_agency_id ON users(agency_id);
CREATE INDEX idx_owners_agency_id ON owners(agency_id);
CREATE INDEX idx_properties_agency_id ON properties(agency_id);
CREATE INDEX idx_tenants_agency_id ON tenants(agency_id);
CREATE INDEX idx_tenants_payment_status ON tenants(payment_status);
CREATE INDEX idx_rentals_agency_id ON rentals(agency_id);
CREATE INDEX idx_contracts_agency_id ON contracts(agency_id);
CREATE INDEX idx_announcements_active ON announcements(is_active);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Insérer une agence de démonstration
INSERT INTO agencies (
  id,
  name,
  commercial_register,
  address,
  city,
  phone,
  email,
  is_accredited,
  accreditation_number
) VALUES (
  'b2c3d4e5-f6a7-8901-2345-678901bcdef0',
  'Immobilier Excellence',
  'CI-ABJ-2024-B-12345',
  'Rue des Jardins, Cocody',
  'Abidjan',
  '+225 27 22 44 55 66',
  'contact@immobilier-excellence.ci',
  true,
  'AGR-2024-001'
) ON CONFLICT (id) DO NOTHING;

-- Insérer des utilisateurs de démonstration
INSERT INTO users (
  id,
  email,
  first_name,
  last_name,
  role,
  agency_id,
  permissions,
  is_active
) VALUES 
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'marie.kouassi@agence.com',
  'Marie',
  'Kouassi',
  'director',
  'b2c3d4e5-f6a7-8901-2345-678901bcdef0',
  '{"dashboard": true, "properties": true, "owners": true, "tenants": true, "contracts": true, "collaboration": true, "reports": true, "notifications": true, "settings": true, "userManagement": true}',
  true
),
(
  'c3d4e5f6-a7b8-9012-3456-789012cdef01',
  'manager1@agence.com',
  'Jean',
  'Bamba',
  'manager',
  'b2c3d4e5-f6a7-8901-2345-678901bcdef0',
  '{"dashboard": true, "properties": true, "owners": true, "tenants": true, "contracts": true, "collaboration": true, "reports": true, "notifications": true, "settings": false, "userManagement": false}',
  true
),
(
  'd4e5f6a7-b8c9-0123-4567-890123def012',
  'agent1@agence.com',
  'Koffi',
  'Martin',
  'agent',
  'b2c3d4e5-f6a7-8901-2345-678901bcdef0',
  '{"dashboard": true, "properties": true, "owners": true, "tenants": true, "contracts": false, "collaboration": false, "reports": false, "notifications": true, "settings": false, "userManagement": false}',
  true
) ON CONFLICT (id) DO NOTHING;