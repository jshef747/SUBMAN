import React, { useState } from 'react';
import './subscriptionList.css';
import AddSubscriptionModal from '../addSubscriptionModal/addSubscriptionModal';
import ErrorModal from '../errorModal/ErrorModal';
import ConfirmModal from '../confirmModal/ConfirmModal';
import { MdDelete } from "react-icons/md";
import { IoPencil } from "react-icons/io5";

import type { Subscription } from '../../../../types';
import { getServiceIcon } from '../../../../utils/serviceIcons';
import { apiFetch } from '../../../../utils/apiClient';

interface SubscriptionListProps {
    subscriptions: Subscription[];
    setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
    onRefresh: () => void;
    isLoading: boolean;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, setSubscriptions, onRefresh, isLoading }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const handleSaveSubscription = async (data: Subscription) => {
        const isEdit = !!data.id && data.id > 0;
        const method = isEdit ? 'PATCH' : 'POST';
        const path = isEdit ? `/subscriptions/${data.id}` : '/subscriptions';

        const tempId = -Date.now();
        if (!isEdit) {
            setSubscriptions(prev => [...prev, { ...data, id: tempId }]);
        }
        setIsModalOpen(false);
        setEditingSubscription(null);

        const [day, month, year] = data.renewalDate.split('/');
        const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
        const numericPrice = parseFloat(data.price.replace(/[^0-9.]/g, ''));

        const payload = {
            name: data.service,
            pricePerCycle: numericPrice,
            payCycle: data.payCycle,
            renewalDate: isoDate,
            isActive: true,
        };

        try {
            const response = await apiFetch(path, {
                method,
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onRefresh();
            } else {
                if (!isEdit) setSubscriptions(prev => prev.filter(sub => sub.id !== tempId));
                setErrorMessage('Failed to save subscription');
                setIsErrorModalOpen(true);
            }
        } catch {
            if (!isEdit) setSubscriptions(prev => prev.filter(sub => sub.id !== tempId));
            setErrorMessage('An error occurred while saving the subscription');
            setIsErrorModalOpen(true);
        }
    };

    const handleEditSubscription = (subscription: Subscription) => {
        setEditingSubscription(subscription);
        setIsModalOpen(true);
    };

    const handleDeleteSubscription = async (id: number) => {
        const previousSubscriptions = [...subscriptions];
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));

        try {
            const response = await apiFetch(`/subscriptions/${id}`, { method: 'DELETE' });
            if (response.ok) {
                onRefresh();
            } else {
                setSubscriptions(previousSubscriptions);
                setErrorMessage('Failed to delete subscription');
                setIsErrorModalOpen(true);
            }
        } catch {
            setSubscriptions(previousSubscriptions);
            setErrorMessage('An error occurred while deleting the subscription');
            setIsErrorModalOpen(true);
        }
    };

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
    };

    const confirmDeleteSub = subscriptions.find(s => s.id === confirmDeleteId);

    return (
        <div className='sub-list-card'>
            <div className='card-header'>
                <h3 className='card-title'>My Subscriptions</h3>
                <button className='add-subscription-button' onClick={() => setIsModalOpen(true)}>Add Subscription</button>
            </div>

            <table className='sub-table'>
                <thead>
                    <tr>
                        <th></th>
                        <th>Service</th>
                        <th>Price</th>
                        <th>Pay Cycle</th>
                        <th>Next Payment</th>
                        <th>Status</th>
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
                    ) : subscriptions.length === 0 ? (
                        <tr>
                            <td colSpan={7} className='empty-state'>
                                <p>No subscriptions yet.</p>
                                <p className='empty-state-sub'>Click "Add Subscription" to track your first one.</p>
                            </td>
                        </tr>
                    ) : (
                        subscriptions.map((sub) => (
                            <tr key={sub.id} className='table-row'>
                                <td>
                                    <button className='edit-button' onClick={() => handleEditSubscription(sub)}><IoPencil size={19} /></button>
                                </td>
                                <td className='service-cell'>
                                    {getServiceIcon(sub.service)}
                                    {sub.service}
                                </td>
                                <td>{sub.price}</td>
                                <td>{sub.payCycle}</td>
                                <td>{calculateNextPaymentDate(sub.payCycle, sub.renewalDate)}</td>
                                <td>
                                    <span className={`status-badge ${sub.status.toLowerCase()}`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td>
                                    <button className='delete-button' onClick={() => setConfirmDeleteId(sub.id!)}><MdDelete size={24} /></button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <AddSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingSubscription(null); }}
                onSave={handleSaveSubscription}
                editSubscription={editingSubscription}
                key={editingSubscription ? editingSubscription.id : 'add'}
            />

            <ConfirmModal
                isOpen={confirmDeleteId !== null}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={() => { if (confirmDeleteId !== null) handleDeleteSubscription(confirmDeleteId); }}
                title="Delete Subscription"
                message={confirmDeleteSub ? `Delete "${confirmDeleteSub.service}"? This cannot be undone.` : 'Delete this subscription?'}
            />

            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                message={errorMessage}
            />
        </div>
    );
};

export default SubscriptionList;
