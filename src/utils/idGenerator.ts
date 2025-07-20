export class AgencyIdGenerator {
  private static getAgencyCode(agencyName: string): string {
    // Générer un code à partir du nom de l'agence
    const words = agencyName.toUpperCase().split(' ');
    if (words.length >= 2) {
      return words[0].substring(0, 2) + words[1].substring(0, 2);
    }
    return agencyName.toUpperCase().substring(0, 4).padEnd(4, 'X');
  }

  static generateOwnerId(agencyId: string, agencyName: string): string {
    const agencyCode = this.getAgencyCode(agencyName);
    const timestamp = Date.now().toString().slice(-6);
    return `${agencyCode}-PROP-${timestamp}`;
  }

  static generateTenantId(agencyId: string, agencyName: string): string {
    const agencyCode = this.getAgencyCode(agencyName);
    const timestamp = Date.now().toString().slice(-6);
    return `${agencyCode}-LOC-${timestamp}`;
  }

  static generatePropertyId(agencyId: string, agencyName: string): string {
    const agencyCode = this.getAgencyCode(agencyName);
    const timestamp = Date.now().toString().slice(-6);
    return `${agencyCode}-BIEN-${timestamp}`;
  }

  static generateReceiptNumber(agencyId: string, agencyName: string, month: string, year: number): string {
    const agencyCode = this.getAgencyCode(agencyName);
    const monthNum = String(new Date(`${month} 1, ${year}`).getMonth() + 1).padStart(2, '0');
    const sequence = Math.floor(Math.random() * 999) + 1;
    return `${agencyCode}-${year}${monthNum}-${String(sequence).padStart(3, '0')}`;
  }
}

export class RankingCalculator {
  static calculateAgencyScore(metrics: {
    totalProperties: number;
    totalContracts: number;
    totalRevenue: number;
    clientSatisfaction: number;
    collaborationScore: number;
    paymentReliability: number;
  }): number {
    // Pondération des critères
    const weights = {
      properties: 0.15,      // 15% - Volume de propriétés
      contracts: 0.20,       // 20% - Nombre de contrats
      revenue: 0.25,         // 25% - Chiffre d'affaires
      satisfaction: 0.20,    // 20% - Satisfaction client
      collaboration: 0.10,   // 10% - Score de collaboration
      reliability: 0.10      // 10% - Fiabilité des paiements
    };

    // Normalisation des scores (0-100)
    const normalizedScores = {
      properties: Math.min(metrics.totalProperties / 100 * 100, 100),
      contracts: Math.min(metrics.totalContracts / 50 * 100, 100),
      revenue: Math.min(metrics.totalRevenue / 10000000 * 100, 100), // 10M FCFA = 100%
      satisfaction: metrics.clientSatisfaction,
      collaboration: metrics.collaborationScore,
      reliability: metrics.paymentReliability
    };

    // Calcul du score final
    const finalScore = 
      normalizedScores.properties * weights.properties +
      normalizedScores.contracts * weights.contracts +
      normalizedScores.revenue * weights.revenue +
      normalizedScores.satisfaction * weights.satisfaction +
      normalizedScores.collaboration * weights.collaboration +
      normalizedScores.reliability * weights.reliability;

    return Math.round(finalScore * 100) / 100;
  }

  static generateRewards(rank: number, score: number): AgencyReward[] {
    const rewards: AgencyReward[] = [];
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 6);

    if (rank === 1) {
      rewards.push({
        id: `reward_${Date.now()}_1`,
        type: 'cash_bonus',
        title: 'Bonus Excellence',
        description: 'Prime de 500,000 FCFA pour la 1ère place',
        value: 500000,
        validUntil
      });
      rewards.push({
        id: `reward_${Date.now()}_2`,
        type: 'discount',
        title: 'Réduction Premium',
        description: '50% de réduction sur l\'abonnement pendant 3 mois',
        value: 50,
        validUntil
      });
    } else if (rank === 2) {
      rewards.push({
        id: `reward_${Date.now()}_3`,
        type: 'cash_bonus',
        title: 'Bonus Performance',
        description: 'Prime de 300,000 FCFA pour la 2ème place',
        value: 300000,
        validUntil
      });
      rewards.push({
        id: `reward_${Date.now()}_4`,
        type: 'discount',
        title: 'Réduction Avancée',
        description: '30% de réduction sur l\'abonnement pendant 2 mois',
        value: 30,
        validUntil
      });
    } else if (rank === 3) {
      rewards.push({
        id: `reward_${Date.now()}_5`,
        type: 'cash_bonus',
        title: 'Bonus Qualité',
        description: 'Prime de 150,000 FCFA pour la 3ème place',
        value: 150000,
        validUntil
      });
      rewards.push({
        id: `reward_${Date.now()}_6`,
        type: 'discount',
        title: 'Réduction Standard',
        description: '20% de réduction sur l\'abonnement pendant 1 mois',
        value: 20,
        validUntil
      });
    }

    if (score >= 80) {
      rewards.push({
        id: `reward_${Date.now()}_7`,
        type: 'badge',
        title: 'Badge Excellence',
        description: 'Badge de reconnaissance pour score supérieur à 80',
        value: 0,
        validUntil
      });
    }

    return rewards;
  }
}