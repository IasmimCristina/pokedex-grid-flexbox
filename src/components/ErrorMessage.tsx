import React from 'react';
import './ErrorMessage.css';
interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const handleReload = () => {
    window.location.reload();
  };
  return (
    <div className="error-message">

      <p className='error-message__text'>{message}</p>
      <button className='error-message__button' onClick={handleReload}>
        Try again
      </button>
    </div>
  );
};

export default ErrorMessage;
