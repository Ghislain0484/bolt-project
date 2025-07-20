/*
  # Ajout de données de démonstration

  1. Agences de démonstration
    - Agence Immobilière Kouassi (directeur: Marie Kouassi)
    - Agence Bamba & Associés (directeur: Jean Bamba)

  2. Utilisateurs de test
    - marie.kouassi@agence.com (Directeur)
    - jean.bamba@agence.com (Directeur)
    - agent1@agence.com (Agent)
    - manager1@agence.com (Manager)

  3. Données de test
    - Propriétaires, locataires, propriétés pour démonstration
*/

-- Insertion des agences de démonstration
INSERT INTO agencies (id, name, commercial_register, address, city, phone, email, is_accredited, accreditation_number) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Agence Immobilière Kouassi', 'CI-ABJ-2023-001', '123 Boulevard Lagunaire', 'Abidjan', '+225 01 02 03 04 05', 'contact@agence-kouassi.ci', true, 'AGR-2023-001'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Agence Bamba & Associés', 'CI-ABJ-2023-002', '456 Avenue de la République', 'Abidjan', '+225 05 06 07 08 09', 'info@bamba-immobilier.ci', true, 'AGR-2023-002');

-- Insertion des utilisateurs de démonstration
INSERT INTO users (id, email, first_name, last_name, role, agency_id, permissions, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'marie.kouassi@agence.com', 'Marie', 'Kouassi', 'director', '550e8400-e29b-41d4-a716-446655440001', '{"dashboard": true, "properties": true, "owners": true, "tenants": true, "contracts": true, "collaboration": true, "reports": true, "notifications": true, "settings": true, "users": true}', true),
  ('550e8400-e29b-41d4-a716-446655440012', 'jean.bamba@agence.com', 'Jean', 'Bamba', 'director', '550e8400-e29b-41d4-a716-446655440002', '{"dashboard": true, "properties": true, "owners": true, "tenants": true, "contracts": true, "collaboration": true, "reports": true, "notifications": true, "settings": true, "users": true}', true),
  ('550e8400-e29b-41d4-a716-446655440013', 'agent1@agence.com', 'Paul', 'Diallo', 'agent', '550e8400-e29b-41d4-a716-446655440001', '{"dashboard": true, "properties": true, "owners": true, "tenants": true}', true),
  ('550e8400-e29b-41d4-a716-446655440014', 'manager1@agence.com', 'Fatou', 'Traoré', 'manager', '550e8400-e29b-41d4-a716-446655440001', '{"dashboard": true, "properties": true, "owners": true, "tenants": true, "contracts": true, "reports": true}', true);

-- Mise à jour des directeurs d'agence
UPDATE agencies SET director_id = '550e8400-e29b-41d4-a716-446655440011' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE agencies SET director_id = '550e8400-e29b-41d4-a716-446655440012' WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- Insertion de propriétaires de démonstration
INSERT INTO owners (id, first_name, last_name, phone, email, address, city, property_title, marital_status, agency_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440021', 'Amadou', 'Sanogo', '+225 07 11 22 33 44', 'amadou.sanogo@email.com', 'Cocody Riviera', 'Abidjan', 'tf', 'marie', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440022', 'Aïcha', 'Ouattara', '+225 05 44 55 66 77', 'aicha.ouattara@email.com', 'Marcory Zone 4', 'Abidjan', 'cpf', 'celibataire', '550e8400-e29b-41d4-a716-446655440002');

-- Insertion de locataires de démonstration
INSERT INTO tenants (id, first_name, last_name, phone, email, address, city, marital_status, profession, nationality, payment_status, agency_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440031', 'Koffi', 'Assi', '+225 01 23 45 67 89', 'koffi.assi@email.com', 'Yopougon Selmer', 'Abidjan', 'marie', 'Ingénieur', 'Ivoirienne', 'bon', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440032', 'Mariam', 'Coulibaly', '+225 02 34 56 78 90', 'mariam.coulibaly@email.com', 'Adjamé Bracodi', 'Abidjan', 'celibataire', 'Comptable', 'Ivoirienne', 'irregulier', '550e8400-e29b-41d4-a716-446655440002');

-- Insertion de propriétés de démonstration
INSERT INTO properties (id, owner_id, agency_id, title, description, location, details, standing, for_sale, for_rent) VALUES
  ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 'Villa moderne Cocody', 'Belle villa de 4 chambres avec piscine', '{"commune": "Cocody", "quartier": "Riviera", "address": "Rue des Palmiers"}', '{"bedrooms": 4, "bathrooms": 3, "surface": 250, "parking": true, "garden": true, "pool": true}', 'haut', false, true),
  ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002', 'Appartement Marcory', 'Appartement 3 pièces bien situé', '{"commune": "Marcory", "quartier": "Zone 4", "address": "Boulevard VGE"}', '{"bedrooms": 2, "bathrooms": 2, "surface": 85, "parking": true, "garden": false, "pool": false}', 'moyen', true, false);

-- Insertion de contrats de démonstration
INSERT INTO rentals (id, property_id, tenant_id, owner_id, agency_id, start_date, monthly_rent, deposit, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01', 350000, 700000, 'actif');

-- Insertion d'annonces de démonstration
INSERT INTO announcements (id, agency_id, property_id, title, description, type, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440042', 'Appartement à vendre Marcory', 'Bel appartement 3 pièces dans un quartier calme', 'vente', true);