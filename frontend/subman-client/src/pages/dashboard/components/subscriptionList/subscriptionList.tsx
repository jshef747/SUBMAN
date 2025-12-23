import React, {useState} from 'react';
import './SubscriptionList.css';
import AddSubscriptionModal from '../addSubscriptionModal/addSubscriptionModal';
import { MdDelete } from "react-icons/md";
import { IoPencil } from "react-icons/io5";
import { supabase } from '../../../../supabaseClient';

import type { Subscription } from '../../../../types';

const SubscriptionList: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);


    const fetchSubscriptions = async() => {
        const { data: { session }} = await supabase.auth.getSession();
        if(!session) return;

        try {
            const response = await fetch('http://localhost:3000/subscriptions', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
            if(response.ok) {
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

    React.useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleAddSubscription = async (data: Subscription) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const [day, month, year] = data.renewalDate.split('/');
        const isoDate = new Date(`${year}-${month}-${day}`).toISOString();

        const numericPrice = parseFloat(data.price.replace('$', ''));

        const payload = {
            name: data.service,
            pricePerCycle: numericPrice,
            payCycle: data.payCycle,
            renewalDate: isoDate,
            isActive: true
        };

        try {
            const response = await fetch('http://localhost:3000/subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                fetchSubscriptions(); 
                setIsModalOpen(false);
                setEditingSubscription(null);
            } else {
                alert("Failed to save subscription");
            }
        } catch (error) {
            console.error("Error saving:", error);
        }
    }

    const handleEditSubscription = (subscription: Subscription) => {
        setEditingSubscription(subscription);
        setIsModalOpen(true);
    }

    const handleDeleteSubscription = async (id: number) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        try {
            const response = await fetch(`http://localhost:3000/subscriptions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
            if (response.ok) {
                setSubscriptions((prevSubs) => prevSubs.filter((sub) => sub.id !== id));
            }
            else {
                alert("Failed to delete subscription"); //TDOD: need to add a popup for this
            }
        } catch (error) {
            //TODO: add a popup for this
            console.error("Error deleting subscription:", error);
            alert("An error occurred while deleting the subscription");
        }
    }
    
    const calculateNextPaymentDate = (payCycle: string, renewalDate: string): string => { 
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [day, month, year] = renewalDate.split('/').map(Number);
        const nextDate = new Date(year, month - 1, day);

        while (nextDate < today) {
            if (payCycle === 'Monthly') {
                nextDate.setMonth(nextDate.getMonth() + 1);
            } else if (payCycle === 'Yearly') {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
            }
        }

        const d = String(nextDate.getDate()).padStart(2, '0');
        const m = String(nextDate.getMonth() + 1).padStart(2, '0');
        const y = nextDate.getFullYear();

        return `${d}/${m}/${y}`;
            
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
                                <button className='edit-button' onClick={() => handleEditSubscription(sub)}><IoPencil size={19} /></button>
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
                                <button className='delete-button' onClick={() => handleDeleteSubscription(sub.id!)}><MdDelete size={24} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AddSubscriptionModal
             isOpen={isModalOpen} 
             onClose={() => setIsModalOpen(false)} 
             onSave={handleAddSubscription}
             editSubscription={editingSubscription}
             key={editingSubscription ? editingSubscription.id : 'add'}
             />
        </div>
    )
}

export default SubscriptionList;