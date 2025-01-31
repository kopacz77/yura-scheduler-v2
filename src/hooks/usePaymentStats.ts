import { useState, useEffect } from 'react';

interface PaymentStats {
  totalRevenue: number;
  pendingAmount: number;
  averageRate: number;
  recurringRevenue: number;
  pendingCount: number;
  recurringStudents: number;
  revenueGrowth: number;
}

const mockStats: PaymentStats = {
  totalRevenue: 12345,
  pendingAmount: 2145,
  averageRate: 85,
  recurringRevenue: 8940,
  pendingCount: 8,
  recurringStudents: 15,
  revenueGrowth: 20.1
};

export function usePaymentStats() {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching payment stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    stats,
    isLoading
  };
}