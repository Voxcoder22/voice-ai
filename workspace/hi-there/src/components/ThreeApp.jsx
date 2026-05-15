import { useState } from 'react';
import Calculator from './Calculator';
import Greeting from './Greeting';

const ThreeApp = () => {
  const [activeApp, setActiveApp] = useState('calculator');

  return (
    <div className="three-app">
      <div className="app-selector">
        <button
          className={activeApp === 'calculator' ? 'active' : ''}
          onClick={() => setActiveApp('calculator')}
        >
          Calculator
        </button>
        <button
          className={activeApp === 'greeting' ? 'active' : ''}
          onClick={() => setActiveApp('greeting')}
        >
          Greeting
        </button>
      </div>

      <div className="app-container">
        {activeApp === 'calculator' && <Calculator />}
        {activeApp === 'greeting' && <Greeting />}
      </div>
    </div>
  );
};

export default ThreeApp;