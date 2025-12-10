import React from "react";  
import './dashboard.css';

import SpendingChart from "./components/spendingChart/spendingChart";
import SubscriptionList from "./components/subscriptionList/subscriptionList";


const dashboard: React.FC = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">

        <main className="dashboard-grid">
          <SubscriptionList />
          
        </main>

      </div>
    </div>
  )
}

export default dashboard
