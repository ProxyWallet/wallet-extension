import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Mnemonics.css';

export const Mnemonics: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mnemonics">
      <div className="mnemonics__el">
        <button
          className="button"
          // TODO: move to subroutes
          onClick={() => navigate('/create-wallet')}
        >
          Create new Mnemonic
        </button>

        <button
          className="button"
          // TODO: move to subroutes
          onClick={() => navigate('/login-page')}
        >
          Use existing Mnemonic
        </button>
      </div>
    </div>
  );
};
