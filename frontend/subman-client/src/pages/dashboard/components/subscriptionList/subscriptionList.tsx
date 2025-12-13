import React, {useState} from 'react';
import './SubscriptionList.css';
import AddSubscriptionModal from '../AddSubscriptionModal/AddSubscriptionModal';

const INITIAL_SUBSCRIPTIONS = [
    { id: 1, service: 'Netflix', price: '$12.99', payCycle: 'Monthly', renewalDate: '15' , status: 'Active'},
    { id: 2, service: 'Spotify', price: '$9.99', payCycle: 'Monthly', renewalDate: '20' , status: 'Active'},
    { id: 3, service: 'Hulu', price: '$11.99', payCycle: 'Monthly', renewalDate: '25' , status: 'Expired'},
    { id: 4, service: 'Disney+', price: '$7.99', payCycle: 'Monthly', renewalDate: '30' , status: 'Active'},
]

const SubscriptionList: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);

    const handleAddSubscription = (data: { service: string; price: string; payCycle: string; renewalDate: string , status: string }) => {
        const newSubscription = {
            id: subscriptions.length + 1,
            ...data
        };
        setSubscriptions((prevSubs) => [...prevSubs, newSubscription]);
    }
    
    return (
        <div className='sub-list-card'>

            <div className='card-header'>
            <h3 className='card-title'>Dashboard</h3>
            <button className='add-subscription-button' onClick={() => setIsModalOpen(true)}>Add Subscription</button>
            </div>
            
            <table className='sub-table'>
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Price</th>
                        <th>Pay Cycle</th>
                        <th>Renewal day/month</th>
                        <th className='status-head'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((sub) => (
                        <tr key={sub.id} className='table-row'>
                            <td className='service-cell'>
                                {}
                                {sub.service}
                            </td>
                            <td>{sub.price}</td>
                            <td>{sub.payCycle}</td>
                            <td className='renDate-cell'>{sub.renewalDate}</td>
                            <td>
                                <span className={`status-badge ${sub.status.toLowerCase()}`}>
                                    {sub.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AddSubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddSubscription} />
        </div>
    )
}

export default SubscriptionList;