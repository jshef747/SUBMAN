import React, { useState } from 'react'; // Removed useEffect
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './AddSubscriptionModal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { service: string; price: string; payCycle: string; renewalDate: string , status: string }) => void;
    type: 'add' | 'edit';
    editData?: { service: string; price: string; payCycle: string; renewalDate: string , status: string };
    onEdit?: (data: { service: string; price: string; payCycle: string; renewalDate: string , status: string }) => void;
}

const AddSubscriptionModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, editData, onEdit, type }) => {
  
  // 1. STATE INITIALIZATION (This handles the data loading now!)
  const [service, setService] = useState<string>(editData ? editData.service : '');
  const [price, setPrice] = useState<string>(editData ? editData.price.replace('$', '') : '');
  const [payCycle, setPayCycle] = useState<string>(editData ? editData.payCycle : '');
  
  // Date parsing logic inside the initial state
  const [startDate, setStartDate] = useState<Date | null>(() => {
      if (editData && editData.renewalDate) {
          const parts = editData.renewalDate.split('/');
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; 
          const year = parts.length === 3 ? parseInt(parts[2]) : new Date().getFullYear();
          return new Date(year, month, day);
      }
      return null;
  });

  const [serviceInputClass, setServiceInputClass] = useState('form-input');
  const [priceInputClass, setPriceInputClass] = useState('form-input');
  const [payCycleInputClass, setPayCycleInputClass] = useState('form-input');
  const [showDateError, setShowDateError] = useState(false);
  const [showCostError, setShowCostError] = useState(false);


  const resetInput = () => {
    setServiceInputClass('form-input');
    setPriceInputClass('form-input');
    setPayCycleInputClass('form-input');
    setShowDateError(false);
    setShowCostError(false);
    setService('');
    setPrice('');
    setPayCycle('');
    setStartDate(null);
  } 
  
  const handleSave = () => {
    setServiceInputClass('form-input');
    setPriceInputClass('form-input');
    setPayCycleInputClass('form-input');
    setShowDateError(false);
    setShowCostError(false);

    let hasError = false;

    if (!service) { setServiceInputClass('form-input error'); hasError = true; }

    const numericPrice = parseFloat(price);
    if (!price) { setPriceInputClass('form-input error'); hasError = true; }
    else if (isNaN(numericPrice) || numericPrice <= 0) { setShowCostError(true); hasError = true; }

    if (!payCycle) { setPayCycleInputClass('form-input error'); hasError = true; }

    if (!startDate) { setShowDateError(true); hasError = true; }

    if (hasError) return;

    const day = startDate!.getDate().toString().padStart(2, '0');
    const month = (startDate!.getMonth() + 1).toString().padStart(2, '0');
    const year = startDate!.getFullYear();
    
    const finalDate = `${day}/${month}/${year}`;

    const payload = { 
        service, 
        price: `$${price}`, 
        payCycle, 
        renewalDate: finalDate, 
        status: 'Active' 
    };
   
    if (type === 'add') {
        onSave(payload);
    } else if (type === 'edit' && onEdit) {
        onEdit(payload);
    }
    resetInput();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>{type === 'edit' ? 'Edit Subscription' : 'Add Subscription'}</h2>
            <form>
                <div className='form-group'>
                    <label className='form-label'>Service Name</label>
                    <input type="text" className={serviceInputClass} placeholder='Enter service name' value={service} onChange={(e) => setService(e.target.value)} />
                </div>

                <div className='form-group'>
                    <label className='form-label'>{payCycle === 'Monthly' ? 'Monthly Cost' : 'Yearly Cost'}</label>
                    <input type="number" className={priceInputClass} placeholder='0.00' value={price} onChange={(e) => {
                        setPrice(e.target.value);
                        setShowCostError(false);
                    }} />
                </div>
                {showCostError && (<div className='date-error-message'>Invalid cost. Please enter a positive number.</div>)}

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
                    <div style={{ width: '50%' }}>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => {
                                setStartDate(date);
                                setShowDateError(false);
                            }}
                            dateFormat="dd/MM/yyyy"      
                            placeholderText="DD/MM/YYYY" 
                            showYearDropdown             
                            scrollableYearDropdown       
                            yearDropdownItemNumber={10}  
                            
                            className={`form-input ${showDateError ? 'error' : ''}`}
                            calendarClassName="dark-theme-calendar"
                            wrapperClassName="date-picker-wrapper"
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>
                </div>
                {showDateError && (<div className='date-error-message'>Please select a valid date.</div>)}
                
                <p className='date-disclaimer'>* When you enter a date in the past, the next payment date will be adjusted accordingly.</p>
                
                <div className='form-actions'>
                    <button type="button" className='cancel-button' onClick={() => {
                       onClose();
                       resetInput();
                    }}>Cancel</button>
                    <button type="button" className='submit-button' onClick={handleSave}>
                        {type === 'edit' ? 'Save Changes' : 'Add Subscription'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddSubscriptionModal;