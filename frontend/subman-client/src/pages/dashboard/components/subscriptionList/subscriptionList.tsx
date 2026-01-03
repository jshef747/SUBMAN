import React, { useState } from 'react';
import './subscriptionList.css';
import AddSubscriptionModal from '../addSubscriptionModal/addSubscriptionModal';
import ErrorModal from '../errorModal/ErrorModal';
import { MdDelete } from "react-icons/md";
import { IoPencil } from "react-icons/io5";
import { supabase } from '../../../../supabaseClient';

import type { Subscription } from '../../../../types';

interface SubscriptionListProps {
    subscriptions: Subscription[];
    setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
    onRefresh: () => void;
    isLoading: boolean;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, setSubscriptions, onRefresh, isLoading }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    // const [subscriptions, setSubscriptions] = useState<Subscription[]>([]); <-- REMOVED

    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');



    // fetchSubscriptions REMOVED (moved to parent)

    // useEffect REMOVED (moved to parent)


    const handleAddSubscription = async (data: Subscription) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Optimistic UI Update
        const tempId = -Date.now();
        const optimisticSubscription = { ...data, id: tempId };
        setSubscriptions(prev => [...prev, optimisticSubscription]);
        setIsModalOpen(false);
        setEditingSubscription(null);

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
                onRefresh();
            } else {
                // Revert optimistic update
                setSubscriptions(prev => prev.filter(sub => sub.id !== tempId));
                setErrorMessage("Failed to save subscription");
                setIsErrorModalOpen(true);
            }
        } catch (error) {
            console.error("Error saving:", error);
            // Revert optimistic update
            setSubscriptions(prev => prev.filter(sub => sub.id !== tempId));
            setErrorMessage("An error occurred while saving the subscription");
            setIsErrorModalOpen(true);
        }
    }

    const handleEditSubscription = (subscription: Subscription) => {
        setEditingSubscription(subscription);
        setIsModalOpen(true);
    }

    const handleDeleteSubscription = async (id: number) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Optimistic UI Update
        const previousSubscriptions = [...subscriptions];
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));

        try {
            const response = await fetch(`http://localhost:3000/subscriptions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
            if (response.ok) {
                onRefresh();
            }
            else {
                // Revert optimistic update
                setSubscriptions(previousSubscriptions);
                setErrorMessage("Failed to delete subscription");
                setIsErrorModalOpen(true);
            }
        } catch (error) {
            console.error("Error deleting subscription:", error);
            // Revert optimistic update
            setSubscriptions(previousSubscriptions);
            setErrorMessage("An error occurred while deleting the subscription");
            setIsErrorModalOpen(true);
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
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <tr key={`skeleton-${index}`} className='table-row'>
                                <td><div className='skeleton skeleton-icon'></div></td>
                                <td><div className='skeleton skeleton-text service-skeleton'></div></td>
                                <td><div className='skeleton skeleton-text price-skeleton'></div></td>
                                <td><div className='skeleton skeleton-text cycle-skeleton'></div></td>
                                <td><div className='skeleton skeleton-text date-skeleton'></div></td>
                                <td><div className='skeleton skeleton-badge'></div></td>
                                <td><div className='skeleton skeleton-icon'></div></td>
                            </tr>
                        ))
                    ) : (
                        subscriptions.map((sub) => (
                            <tr key={sub.id} className='table-row'>
                                <td>
                                    <button className='edit-button' onClick={() => handleEditSubscription(sub)}><IoPencil size={19} /></button>
                                </td>
                                <td className='service-cell'>
                                    { }
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
                        ))
                    )}
                </tbody>
            </table>

            <AddSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddSubscription}
                editSubscription={editingSubscription}
                key={editingSubscription ? editingSubscription.id : 'add'}
            />

            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                message={errorMessage}
            />
        </div>
    )
}

export default SubscriptionList;