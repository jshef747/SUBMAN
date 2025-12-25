import React from 'react';
import './ErrorModal.css';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="error-modal-overlay" onClick={onClose}>
            <div className="error-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="error-modal-title">Error</h2>
                <p className="error-modal-message">{message}</p>
                <button className="error-modal-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
