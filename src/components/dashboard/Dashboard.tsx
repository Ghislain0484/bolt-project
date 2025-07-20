import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  UserCheck, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Propriétés Gérées',
      value: '247',
      icon: Building2,
      trend: { value: 12, isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Propriétaires',
      value: '89',
      icon: Users,
      trend: { value: 5, isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Locataires Actifs',
      value: '198',
      icon: UserCheck,
      trend: { value: 8, isPositive: true },
      color: 'yellow' as const,
    },
    {
      title: 'Contrats en Cours',
      value: '176',
      icon: FileText,
      trend: { value: 3, isPositive: false },
      color: 'red' as const,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'new_property',
      title: 'Nouvelle propriété ajoutée',
      description: 'Villa 4 chambres - Cocody',
      time: '2 min',
      status: 'success',
    },
    {
      id: 2,
      type: 'payment_received',
      title: 'Paiement reçu',
      description: 'Loyer Mars 2024 - Apt 2B',
      time: '15 min',
      status: 'success',
    },
    {
      id: 3,
      type: 'overdue_payment',
      title: 'Retard de paiement',
      description: 'Loyer en retard - Villa Marcory',
      time: '1 h',
      status: 'warning',
    },
    {
      id: 4,
      type: 'new_tenant',
      title: 'Nouveau locataire',
      description: 'Koffi Martin - Appartement 3A',
      time: '3 h',
      status: 'info',
    },
  ];

  const upcomingRentals = [
    {
      id: 1,
      property: 'Villa Cocody - Angré',
      tenant: 'Aya Kouassi',
      dueDate: '2024-03-15',
      amount: '450,000 FCFA',
      status: 'pending',
    },
    {
      id: 2,
      property: 'Appartement 2B - Plateau',
      tenant: 'Jean-Baptiste Kone',
      dueDate: '2024-03-20',
      amount: '320,000 FCFA',
      status: 'overdue',
    },
    {
      id: 3,
      property: 'Maison Yopougon',
      tenant: 'Marie Bamba',
      dueDate: '2024-03-25',
      amount: '280,000 FCFA',
      status: 'upcoming',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Terminé</Badge>;
      case 'warning':
        return <Badge variant="warning">En attente</Badge>;
      case 'info':
        return <Badge variant="info">Nouveau</Badge>;
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'overdue':
        return <Badge variant="danger">En retard</Badge>;
      case 'upcoming':
        return <Badge variant="info">À venir</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de votre activité immobilière
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Activités Récentes
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Voir tout
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Rentals */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Loyers à Venir
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Voir tout
            </button>
          </div>
          
          <div className="space-y-4">
            {upcomingRentals.map((rental) => (
              <div key={rental.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {rental.property}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {rental.tenant} • {rental.dueDate}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {rental.amount}
                  </span>
                  {getStatusBadge(rental.status)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Actions Rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/properties')}
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Ajouter Propriété</p>
              <p className="text-sm text-gray-500">Nouvelle propriété</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/owners')}
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Users className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Nouveau Propriétaire</p>
              <p className="text-sm text-gray-500">Enregistrer</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/tenants')}
            className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <UserCheck className="h-8 w-8 text-yellow-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Nouveau Locataire</p>
              <p className="text-sm text-gray-500">Ajouter</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/contracts')}
            className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FileText className="h-8 w-8 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Nouveau Contrat</p>
              <p className="text-sm text-gray-500">Créer</p>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
};