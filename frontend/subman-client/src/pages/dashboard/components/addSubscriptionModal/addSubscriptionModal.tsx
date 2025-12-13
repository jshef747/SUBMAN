import React, { useState } from 'react'
import './AddSubscriptionModal.css'
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { service: string; price: string; payCycle: string; renewalDate: string , status: string }) => void;
}

const AddSubscriptionModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [service, setService] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [payCycle, setPayCycle] = useState<string>('');
  const [renewalDate, setRenewalDate] = useState<string>('');
  const [serviceInputClass, setServiceInputClass] = useState<string>('form-input');
  const [priceInputClass, setPriceInputClass] = useState<string>('form-input');
  const [dateInputClass, setDateInputClass] = useState<string>('form-input');
  const [payCycleInputClass, setPayCycleInputClass] = useState<string>('form-input');

  if (!isOpen) return null;

  const dataLabelName = () => { 
    return payCycle === 'Monthly' ? 'Select renewal day' : 'Select renewal month';
  }

  const handleSave = () => {

    let hasError: boolean = false;
    
    if (!service) {
        setServiceInputClass('form-input error');
        hasError = true;
    }

    if (!price) {
        setPriceInputClass('form-input error');
        hasError = true;
    }

    if (!renewalDate) {
        setDateInputClass('form-input error');
        hasError = true;
    }

    if (!payCycle) {
        setPayCycleInputClass('form-input error');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    onSave({ service, price: `$${price}`, payCycle, renewalDate, status: 'Active' });
    setService('');
    setPrice('');
    setRenewalDate('');
    onClose();
  }


  

  return (
    <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>Add Subscription</h2>
            <form>
                <div className='form-group'>
                    <label className='form-label'>Service Name</label>
                    <input type="text" className={serviceInputClass} placeholder='Enter service name' value={service} onChange={(e) => setService(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label className='form-label'>Monthly Cost</label>
                    <input type="number" className={priceInputClass} placeholder='Enter monthly cost' value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label className='form-label'>Pay Cycle</label>
                    <select className={payCycleInputClass} value={payCycle} onChange={(e) => setPayCycle(e.target.value)}>
                        <option value="">Select pay cycle</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label className='form-label'>{payCycle ? dataLabelName() : 'Select pay cycle first'}</label>
                    <input type="number" className={dateInputClass} value={renewalDate} onChange={(e) => setRenewalDate(e.target.value.toString())} />
                </div>
                <div className='form-actions'>
                    <button type="button" className='cancel-button' onClick={onClose}>Cancel</button>
                    <button type="button" className='submit-button' onClick={handleSave}>Add Subscription</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddSubscriptionModal