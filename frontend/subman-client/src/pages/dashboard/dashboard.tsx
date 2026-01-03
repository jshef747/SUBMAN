import React, { useState, useEffect } from "react";
import './dashboard.css';

import SubscriptionList from "./components/subscriptionList/subscriptionList";
import SpendingGraph from "./components/spendingGraph/SpendingGraph";
import { supabase } from '../../supabaseClient';
import type { Subscription } from '../../types';




const dashboard: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = 'http://localhost:3001';

  const fetchSubscriptions = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const response = await fetch(`${apiUrl}/subscriptions`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const mappedData: Subscription[] = data.map((item: any) => ({
          id: item.id,
          service: item.name,
          price: `$${item.pricePerCycle}`,
          payCycle: item.payCycle,
          renewalDate: new Date(item.renewalDate).toLocaleDateString('en-GB'),
          status: item.isActive ? 'Active' : 'Expired',
        }));
        setSubscriptions(mappedData);
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
  )
}


export default dashboard
