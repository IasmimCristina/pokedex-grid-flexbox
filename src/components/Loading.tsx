// src/components/Loading.tsx
import React from 'react';
import { BeatLoader } from 'react-spinners';
import './Loading.css'; // Crie um arquivo CSS separado para estilização

const Loading: React.FC = () => {
  return (
    <div className="loading">
      <BeatLoader color="#36D7B7" loading={true} size={15} />
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
