import React, {useState} from 'react';
import './SubscriptionList.css';
import AddSubscriptionModal from '../AddSubscriptionModal/AddSubscriptionModal';
import { MdDelete } from "react-icons/md";
import { IoPencil } from "react-icons/io5";

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

    const handleDeleteSubscription = (id: number) => {
        setSubscriptions((prevSubs) => prevSubs.filter((sub) => sub.id !== id));
    }
    
    const calculateNextPaymentDate = (payCycle: string, renewalDate: string): string => {
        const today = new Date();
        let nextPaymentDate: Date;

        if (payCycle === 'Monthly') {
            const [day] = renewalDate.split('/').map(Number);
            nextPaymentDate = new Date(today.getFullYear(), today.getMonth(), day);
            
            if (nextPaymentDate < today) {
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            }
        } else {
            const [day, month] = renewalDate.split('/').map(Number);
            nextPaymentDate = new Date(today.getFullYear(), month - 1, day);
            
            if (nextPaymentDate < today) {
                nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
            }
        }

        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return nextPaymentDate.toLocaleDateString(undefined, options);
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
                        <th></th>
                        <th>Service</th>
                        <th>Price</th>
                        <th>Pay Cycle</th>
                        <th>Next Payment Date</th>
                        <th className='status-head'>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((sub) => (
                        <tr key={sub.id} className='table-row'>
                            <td>
                                <button className='edit-button'><IoPencil size={19} /></button>
                            </td>
                            <td className='service-cell'>
                                {}
                                {sub.service}
                            </td>
                            <td>{sub.price}</td>
                            <td>{sub.payCycle}</td>
                            <td className='next-cell'>{calculateNextPaymentDate(sub.payCycle, sub.renewalDate)}</td>
                            <td>
                                <span className={`status-badge ${sub.status.toLowerCase()}`}>
                                    {sub.status}
                                </span>
                            </td>
                            <td>
                                <button className='delete-button' onClick={() => handleDeleteSubscription(sub.id)}><MdDelete size={24} /></button>
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