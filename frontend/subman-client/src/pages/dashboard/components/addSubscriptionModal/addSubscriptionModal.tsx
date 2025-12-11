import React, { useState } from 'react'
import './addSubscriptionModal.css'
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { service: string; price: string; renewalDate: string , status: string }) => void;
}

const AddSubscriptionModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [service, setService] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [renewalDate, setRenewalDate] = useState<Date | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if(!service || !price || !renewalDate) {
        alert("Please fill in all fields");
        return;
    }
    onSave({ service, price: `$${price}`, renewalDate: renewalDate ? renewalDate.toISOString().split('T')[0] : '', status: 'Active' });

    setService('');
    setPrice('');
    setRenewalDate(null);
    onClose();
  }

 

  

  return (
    <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>Add Subscription</h2>
            <form>
                <div className='form-group'>
                    <label className='form-label'>Service Name</label>
                    <input type="text" className='form-input' placeholder='Enter service name' value={service} onChange={(e) => setService(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label className='form-label'>Monthly Cost</label>
                    <input type="number" className='form-input' placeholder='Enter monthly cost' value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label className='form-label'>Renewal Date</label>
                    <input type="date" className='form-input' value={renewalDate ? renewalDate.toISOString().split('T')[0] : ''} onChange={(e) => setRenewalDate(e.target.value ? new Date(e.target.value) : null)} />
                </div>
                <div className='form-actions'>
                    <button type="button" className='cancel-button' onClick={onClose}>Cancel</button>
                    <button type="submit" className='submit-button' onClick={handleSave}>Add Subscription</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddSubscriptionModal