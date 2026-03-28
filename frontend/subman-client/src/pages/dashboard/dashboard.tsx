import React, { useState, useEffect } from "react";
import './dashboard.css';

import SubscriptionList from "./components/subscriptionList/subscriptionList";
import SpendingGraph from "./components/spendingGraph/SpendingGraph";
import { apiFetch } from '../../utils/apiClient';
import type { Subscription, SubscriptionAPI } from '../../types';

const mapApiToDisplay = (item: SubscriptionAPI): Subscription => ({
  id: item.id,
  service: item.name,
  price: item.pricePerCycle.toLocaleString('en-US', { style: 'currency', currency: item.currency || 'USD' }),
  payCycle: item.payCycle,
  renewalDate: new Date(item.renewalDate).toLocaleDateString('en-GB'),
  status: item.isActive ? 'Active' : 'Expired',
});

const DashboardPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const response = await apiFetch('/subscriptions');
      if (response.ok) {
        const data: SubscriptionAPI[] = await response.json();
        setSubscriptions(data.map(mapApiToDisplay));
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">
        <main className="dashboard-grid">
          <div className="dashboard-left">
            <SubscriptionList subscriptions={subscriptions} setSubscriptions={setSubscriptions} onRefresh={fetchSubscriptions} isLoading={isLoading} />
          </div>
          <div className="dashboard-right">
            <SpendingGraph subscriptions={subscriptions} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
