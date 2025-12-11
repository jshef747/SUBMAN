import React from 'react'
import './addSubscriptionModal.css'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const addSubscriptionModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>Add Subscription</h2>
            <form>
                <div className='form-group'>
                    <label className='form-label'>Service Name</label>
                    <input type="text" className='form-input' placeholder='Enter service name' />
                </div>
                <div className='form-group'>
                    <label className='form-label'>Monthly Cost</label>
                    <input type="number" className='form-input' placeholder='Enter monthly cost' />
                </div>
                <div className='form-group'>
                    <label className='form-label'>Renewal Date</label>
                    <input type="date" className='form-input' />
                </div>
                <div className='form-actions'>
                    <button type="button" className='cancel-button' onClick={onClose}>Cancel</button>
                    <button type="submit" className='submit-button'>Add Subscription</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default addSubscriptionModal