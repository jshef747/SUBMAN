import React from 'react';
import './VerificationModal.css';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="verification-modal-overlay" onClick={onClose}>
            <div className="verification-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="verification-modal-title">Verify Your Email</h2>
                <p className="verification-modal-message">
                    Please check your email to verify your account before logging in.
                </p>
                <button className="verification-modal-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default VerificationModal;
