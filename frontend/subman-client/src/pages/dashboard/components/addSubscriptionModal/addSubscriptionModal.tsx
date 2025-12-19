import React, { useState } from 'react'
import './AddSubscriptionModal.css'

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { service: string; price: string; payCycle: string; renewalDate: string , status: string }) => void;
}

const AddSubscriptionModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [service, setService] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [payCycle, setPayCycle] = useState<string>('');

  const [renewalDate, setRenewalDate] = useState<Date | null>(null);

  const [serviceInputClass, setServiceInputClass] = useState<string>('form-input');
  const [priceInputClass, setPriceInputClass] = useState<string>('form-input');
  const [payCycleInputClass, setPayCycleInputClass] = useState<string>('form-input');
  const [renewalDateInputClass, setRenewalDateInputClass] = useState<string>('form-input');

  const [showCostError, setShowCostError] = useState<boolean>(false);

  if (!isOpen) return null;

  const resetInput= () => {
    setServiceInputClass('form-input');
    setPriceInputClass('form-input');
    setPayCycleInputClass('form-input');
    setShowCostError(false);
    setService('');
    setPrice('');
    setRenewalDate(null);
  } 
  
  const handleSave = () => {

    resetInput();

    let hasError: boolean = false;

    if (!service) {
        setServiceInputClass('form-input error');
        hasError = true;
    }

    if (!Number(price) || Number(price) <= 0) {
        setShowCostError(true);
        hasError = true;
    }

    else if (!price) {
        setPriceInputClass('form-input error');
        hasError = true;
    }

    if (!payCycle) {
        setPayCycleInputClass('form-input error');
        hasError = true;
    }

    if (!renewalDate) {
        setRenewalDateInputClass('form-input error');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    const day = renewalDate!.getDate().toString().padStart(2, '0');
    const month = (renewalDate!.getMonth() + 1).toString().padStart(2, '0');
    const year = renewalDate!.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    onSave({ service, price: `$${price}`, payCycle, renewalDate: formattedDate, status: 'Active' });
    
    resetInput();

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
                    <label className='form-label'>{payCycle === 'Monthly' ? 'Monthly Cost' : 'Yearly Cost'}</label>
                    <input type="number" className={priceInputClass} placeholder={payCycle === 'Monthly' ? 'Enter monthly cost' : 'Enter yearly cost'} value={price} onChange={(e) => {
                        setPrice(e.target.value);
                        setShowCostError(false);
                    }} />
                </div>
                {showCostError && (<div className='date-error-message'>Invalid cost. Please enter a positive number.</div>
                    )}
                <div className='form-group'>
                    <label className='form-label'>Pay Cycle</label>
                    <select className={payCycleInputClass} value={payCycle} onChange={(e) => setPayCycle(e.target.value)}>
                        <option value="">Select pay cycle</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label className='form-label'>Next due date</label>
                    <div className='date-picker-container'>
                    <DatePicker
                    selected={renewalDate}
                    onChange={(date : Date | null) => {
                      setRenewalDate(date);
                    }}
                    dateFormat={'dd/MM/yyyy'}
                    placeholderText='DD/MM/YYYY'
                    className={renewalDateInputClass}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={7} 
                    wrapperClassName='date-picker-wrapper'/>
                    </div>
                </div>
                <p className='date-disclaimer'>* When you enter a date in the past, the next payment date will be adjusted accordingly.</p>
                <div className='form-actions'>
                    <button type="button" className='cancel-button' onClick={() => {resetInput(); onClose();}}>Cancel</button>
                    <button type="button" className='submit-button' onClick={handleSave}>Add Subscription</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddSubscriptionModal