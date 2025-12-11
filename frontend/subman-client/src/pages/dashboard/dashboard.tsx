import React from "react";  
import './Dashboard.css';

import SpendingChart from "./components/SpendingChart/SpendingChart";
import SubscriptionList from "./components/SubscriptionList/SubscriptionList";


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
