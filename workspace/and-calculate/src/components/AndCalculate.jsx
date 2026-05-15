import { useState } from 'react';

const AndCalculate = () => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const num1 = parseFloat(input1);
    const num2 = parseFloat(input2);

    if (!isNaN(num1) && !isNaN(num2)) {
      setResult(num1 & num2);
    } else {
      setResult('Invalid input');
    }
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>AND Calculator</h2>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Input 1:</label>
        <input
          type="number"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          style={{ padding: '5px', width: '100px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Input 2:</label>
        <input
          type="number"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          style={{ padding: '5px', width: '100px' }}
        />
      </div>
      <button
        onClick={handleCalculate}
        style={{
          padding: '8px 16px',
          backgroundColor: '#aa3bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Calculate AND
      </button>
      {result !== null && (
        <div style={{ marginTop: '15px' }}>
          <h3>Result: {result}</h3>
        </div>
      )}
    </div>
  );
};

export default AndCalculate;