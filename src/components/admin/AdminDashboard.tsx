import React, { useState } from 'react';
import { Shield, Building2, TrendingUp, Users, DollarSign, Award, Settings, BarChart3 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AgencyManagement } from './AgencyManagement';
import { SubscriptionManagement } from './SubscriptionManagement';
import { AgencyRankings } from './AgencyRankings';
import { PlatformSettings } from './PlatformSettings';
import { PlatformStats } from '../../types/admin';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock platform stats
  const platformStats: PlatformStats = {
    totalAgencies: 47,
    activeAgencies: 42,
    totalProperties: 1247,
    totalContracts: 856,
    totalRevenue: 125000000, // 125M FCFA
    monthlyGrowth: 12.5,
    subscriptionRevenue: 8400000 // 8.4M FCFA
  };

  const adminTabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'agencies', name: 'Gestion Agences', icon: Building2 },
    { id: 'subscriptions', name: 'Abonnements', icon: DollarSign },
    { id: 'rankings', name: 'Classements', icon: Award },
    { id: 'settings', name: 'Paramètres', icon: Settings },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Administration Plateforme</h1>
                <p className="text-sm text-gray-500">Gestion globale ImmoPlatform</p>
              </div>
            </div>
            <Badge variant="danger" size="sm">Super Admin</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center p-3 rounded-lg bg-blue-500">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Agences Totales
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {platformStats.totalAgencies}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className="text-green-600">
                        {platformStats.activeAgencies} actives
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center p-3 rounded-lg bg-green-500">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Revenus Plateforme
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {formatCurrency(platformStats.totalRevenue)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className="text-green-600">
                        ↗ {platformStats.monthlyGrowth}% ce mois
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center p-3 rounded-lg bg-yellow-500">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Revenus Abonnements
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {formatCurrency(platformStats.subscriptionRevenue)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className="text-blue-600">
                        Mensuel récurrent
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center p-3 rounded-lg bg-purple-500">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Propriétés Gérées
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {platformStats.totalProperties.toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className="text-purple-600">
                        {platformStats.totalContracts} contrats actifs
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Agences Récemment Inscrites
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Immobilier Excellence', city: 'Abidjan', date: '2024-03-10' },
                      { name: 'Habitat Plus', city: 'Bouaké', date: '2024-03-08' },
                      { name: 'Prestige Immobilier', city: 'San Pedro', date: '2024-03-05' }
                    ].map((agency, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{agency.name}</p>
                          <p className="text-sm text-gray-500">{agency.city}</p>
                        </div>
                        <span className="text-sm text-gray-500">{agency.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Alertes Système
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          3 agences en retard de paiement
                        </p>
                        <p className="text-xs text-yellow-600">Suspension automatique dans 5 jours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          1 agence suspendue
                        </p>
                        <p className="text-xs text-red-600">Immobilier Delta - Impayé depuis 15 jours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Système opérationnel
                        </p>
                        <p className="text-xs text-green-600">Tous les services fonctionnent normalement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'agencies' && <AgencyManagement />}
        {activeTab === 'subscriptions' && <SubscriptionManagement />}
        {activeTab === 'rankings' && <AgencyRankings />}
        {activeTab === 'settings' && <PlatformSettings />}
      </div>
    </div>
  );
};