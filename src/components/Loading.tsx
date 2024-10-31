import React from 'react';
import { BeatLoader } from 'react-spinners';
import './Loading.css';

const Loading: React.FC = () => {
  return (
    <div className="loading">
      <BeatLoader color="var(--primary-color)" loading={true} size={30} />
      <p className="loading__text">Loading...</p>
    </div>
  );
};

export default Loading;
