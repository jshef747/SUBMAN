import React, { useState, useEffect } from "react";
import './Dashboard.css';

import SubscriptionList from "./components/subscriptionList/subscriptionList";
import SpendingGraph from "./components/spendingGraph/SpendingGraph";
import { supabase } from '../../supabaseClient';
import type { Subscription } from '../../types';




const dashboard: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const fetchSubscriptions = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const response = await fetch('http://localhost:3000/subscriptions', {
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
            <SubscriptionList subscriptions={subscriptions} onRefresh={fetchSubscriptions} />
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
