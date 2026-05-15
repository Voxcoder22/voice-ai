import { useState } from 'react';

const Greeting = () => {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');

  const handleGreet = () => {
    if (name.trim()) {
      setGreeting(`Hello, ${name}!`);
    } else {
      setGreeting('Please enter your name.');
    }
  };

  return (
    <div className="greeting">
      <h2>Greeting App</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleGreet}>Greet</button>
      {greeting && <p>{greeting}</p>}
    </div>
  );
};

export default Greeting;