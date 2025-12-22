import React from "react";  
import './Dashboard.css';

import SubscriptionList from "./components/subscriptionList/SubscriptionList";


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
