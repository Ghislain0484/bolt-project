import React, { useState } from 'react';
import { Building2, Search, Eye, Settings, Ban, CheckCircle, AlertTriangle, Users, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { AgencySubscription } from '../../types/admin';

export const AgencyManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAgency, setSelectedAgency] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock agencies data
  const [agencies] = useState([
    {
      id: '1',
      name: 'Immobilier Excellence',
      commercialRegister: 'CI-ABJ-2024-B-12345',
      city: 'Abidjan',
      email: 'contact@excellence.ci',
      phone: '+225 01 02 03 04 05',
      director: 'Marie Kouassi',
      subscription: {
        status: 'active',
        plan: 'premium',
        nextPayment: '2024-04-15',
        monthlyFee: 50000
      },
      stats: {
        properties: 67,
        contracts: 45,
        users: 8,
        revenue: 12500000
      },
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Habitat Plus',
      commercialRegister: 'CI-BKE-2024-B-67890',
      city: 'Bouaké',
      email: 'info@habitatplus.ci',
      phone: '+225 05 06 07 08 09',
      director: 'Jean Bamba',
      subscription: {
        status: 'suspended',
        plan: 'basic',
        nextPayment: '2024-03-20',
        monthlyFee: 25000
      },
      stats: {
        properties: 23,
        contracts: 18,
        users: 3,
        revenue: 4200000
      },
      createdAt: new Date('2024-02-10')
    },
    {
      id: '3',
      name: 'Prestige Immobilier',
      commercialRegister: 'CI-SPE-2024-B-11111',
      city: 'San Pedro',
      email: 'contact@prestige.ci',
      phone: '+225 09 10 11 12 13',
      director: 'Koffi Martin',
      subscription: {
        status: 'trial',
        plan: 'premium',
        nextPayment: '2024-03-25',
        monthlyFee: 50000
      },
      stats: {
        properties: 12,
        contracts: 8,
        users: 2,
        revenue: 1800000
      },
      createdAt: new Date('2024-03-01')
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'danger';
      case 'trial': return 'warning';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'suspended': return 'Suspendu';
      case 'trial': return 'Essai';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Basique';
      case 'premium': return 'Premium';
      case 'enterprise': return 'Entreprise';
      default: return plan;
    }
  };

  const toggleAgencyStatus = (agencyId: string) => {
    console.log('Toggle agency status:', agencyId);
    // Implementation for activating/suspending agency
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || agency.subscription.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Gestion des Agences</h2>
        <div className="flex items-center space-x-3">
          <Badge variant="info" size="sm">
            {agencies.length} agences inscrites
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, ville ou directeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
            <option value="trial">Essai</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </Card>

      {/* Agencies List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAgencies.map((agency) => (
          <Card key={agency.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{agency.name}</h3>
                    <p className="text-sm text-gray-500">{agency.commercialRegister}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(agency.subscription.status)} size="sm">
                    {getStatusLabel(agency.subscription.status)}
                  </Badge>
                  <Badge variant="secondary" size="sm">
                    {getPlanLabel(agency.subscription.plan)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{agency.city}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Directeur: {agency.director}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span>Email: {agency.email}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span>Téléphone: {agency.phone}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{agency.stats.properties}</div>
                  <div className="text-xs text-gray-500">Propriétés</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{agency.stats.contracts}</div>
                  <div className="text-xs text-gray-500">Contrats</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{agency.stats.users}</div>
                  <div className="text-xs text-gray-500">Utilisateurs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(agency.stats.revenue).replace(' FCFA', '')}
                  </div>
                  <div className="text-xs text-gray-500">CA (FCFA)</div>
                </div>
              </div>

              {/* Subscription Info */}
              <div className="p-3 bg-blue-50 rounded-lg mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-800">Abonnement mensuel:</span>
                  <span className="font-medium text-blue-900">
                    {formatCurrency(agency.subscription.monthlyFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-blue-800">Prochain paiement:</span>
                  <span className="font-medium text-blue-900">
                    {new Date(agency.subscription.nextPayment).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Inscrite le {agency.createdAt.toLocaleDateString('fr-FR')}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAgency(agency);
                      setShowDetails(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAgencyStatus(agency.id)}
                    className={agency.subscription.status === 'active' ? 'text-red-600' : 'text-green-600'}
                  >
                    {agency.subscription.status === 'active' ? (
                      <Ban className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Agency Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedAgency(null);
        }}
        title="Détails de l'agence"
        size="lg"
      >
        {selectedAgency && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informations générales</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Nom:</strong> {selectedAgency.name}</p>
                  <p><strong>Registre:</strong> {selectedAgency.commercialRegister}</p>
                  <p><strong>Ville:</strong> {selectedAgency.city}</p>
                  <p><strong>Directeur:</strong> {selectedAgency.director}</p>
                  <p><strong>Email:</strong> {selectedAgency.email}</p>
                  <p><strong>Téléphone:</strong> {selectedAgency.phone}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Statistiques</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Propriétés gérées:</strong> {selectedAgency.stats.properties}</p>
                  <p><strong>Contrats actifs:</strong> {selectedAgency.stats.contracts}</p>
                  <p><strong>Utilisateurs:</strong> {selectedAgency.stats.users}</p>
                  <p><strong>Chiffre d'affaires:</strong> {formatCurrency(selectedAgency.stats.revenue)}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Abonnement</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Plan:</strong> {getPlanLabel(selectedAgency.subscription.plan)}</p>
                    <p><strong>Statut:</strong> 
                      <Badge variant={getStatusColor(selectedAgency.subscription.status)} size="sm" className="ml-2">
                        {getStatusLabel(selectedAgency.subscription.status)}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <p><strong>Montant mensuel:</strong> {formatCurrency(selectedAgency.subscription.monthlyFee)}</p>
                    <p><strong>Prochain paiement:</strong> {new Date(selectedAgency.subscription.nextPayment).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <Button variant="ghost" onClick={() => setShowDetails(false)}>
                Fermer
              </Button>
              <Button 
                variant={selectedAgency.subscription.status === 'active' ? 'danger' : 'secondary'}
                onClick={() => toggleAgencyStatus(selectedAgency.id)}
              >
                {selectedAgency.subscription.status === 'active' ? 'Suspendre' : 'Activer'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};