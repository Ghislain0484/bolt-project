# 🏢 Plateforme Collaborative de Gestion Immobilière

Une plateforme moderne pour la gestion collaborative de biens immobiliers entre agences en Côte d'Ivoire.

## 🚀 Déploiement Rapide (5 minutes)

### 1. Créer un Projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Copier l'URL du projet et la clé anonyme

### 2. Configurer la Base de Données
1. Dans Supabase SQL Editor
2. Exécuter le fichier `supabase/migrations/complete_setup.sql`
3. Vérifier que toutes les tables sont créées

### 3. Déployer sur Vercel
1. Fork ce repository
2. Connecter à Vercel
3. Ajouter les variables d'environnement :
   ```
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
   ```
4. Déployer

## 👥 Comptes de Démonstration

```
Directeur: marie.kouassi@agence.com / demo123
Manager: manager1@agence.com / demo123
Agent: agent1@agence.com / demo123
```

## 🔧 Fonctionnalités

### ✅ Gestion Complète
- **Propriétaires** : Informations personnelles, titres de propriété
- **Propriétés** : Détails techniques, géolocalisation, images
- **Locataires** : Profils complets, historique de paiement
- **Contrats** : Location, vente, gestion avec calcul automatique des commissions

### ✅ Collaboration Inter-Agences
- **Annonces partagées** entre agences
- **Recherche d'historique** des locataires et propriétaires
- **Messagerie** inter-agences
- **Évaluation des profils** de paiement

### ✅ Outils Avancés
- **Calcul automatique** du standing des propriétés
- **Géolocalisation** des biens
- **Rapports et statistiques** détaillés
- **Notifications** en temps réel
- **Gestion des utilisateurs** et permissions

## 🛠️ Technologies

- **Frontend** : React 18 + TypeScript + Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Auth + API)
- **Déploiement** : Vercel
- **Sécurité** : Row Level Security (RLS)

## 📊 Architecture

```
Frontend (React)
    ↓
Supabase API
    ↓
PostgreSQL + RLS
```

## 🔒 Sécurité

- **Authentification** : Supabase Auth
- **Autorisation** : Row Level Security (RLS)
- **Validation** : Côté client et serveur
- **HTTPS** : Certificats automatiques

## 📱 Responsive Design

- **Mobile First** : Interface optimisée pour tous les écrans
- **Progressive Web App** : Installation possible sur mobile
- **Performance** : Chargement rapide et optimisé

## 🌍 Spécificités Côte d'Ivoire

- **Titres de propriété** : TF, CPF, ACD, Attestations villageoises
- **Monnaie** : Franc CFA (XOF)
- **Géolocalisation** : Centrée sur Abidjan
- **Réglementation** : Conforme aux standards ivoiriens

## 📈 Évolutivité

- **Multi-tenant** : Support de plusieurs agences
- **API REST** : Intégration facile avec d'autres systèmes
- **Webhooks** : Notifications automatiques
- **Backup automatique** : Sauvegardes quotidiennes

## 💰 Coûts

### Gratuit jusqu'à :
- **Vercel** : 100GB de bande passante/mois
- **Supabase** : 500MB de stockage + 2GB de transfert

### Production :
- **Vercel Pro** : 20$/mois
- **Supabase Pro** : 25$/mois

## 🆘 Support

- **Documentation** : Complète et à jour
- **Exemples** : Cas d'usage réels
- **Communauté** : Support actif

---

**Développé avec ❤️ pour les professionnels de l'immobilier en Côte d'Ivoire**