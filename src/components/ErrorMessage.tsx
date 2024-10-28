// src/components/ErrorMessage.tsx
import React from 'react';
import './ErrorMessage.css'; // Crie um arquivo CSS separado para estilização

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="error-message">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
