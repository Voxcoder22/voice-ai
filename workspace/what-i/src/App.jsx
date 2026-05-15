import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        setResult(eval(input).toString())
      } catch (error) {
        setResult('Error')
      }
    } else if (value === 'C') {
      setInput('')
      setResult('')
    } else if (value === '⌫') {
      setInput(input.slice(0, -1))
    } else {
      setInput(input + value)
    }
  }

  const handleKeyPress = (e) => {
    const key = e.key
    if (key === 'Enter') {
      handleButtonClick('=')
    } else if (key === 'Escape') {
      handleButtonClick('C')
    } else if (key === 'Backspace') {
      handleButtonClick('⌫')
    } else if (/^[0-9+\-*/.]$/.test(key)) {
      handleButtonClick(key)
    }
  }

  return (
    <div className="calculator" tabIndex="0" onKeyDown={handleKeyPress}>
      <div className="display">
        <input type="text" value={input} readOnly />
        <div className="result">{result}</div>
      </div>
      <div className="buttons">
        <button onClick={() => handleButtonClick('7')}>7</button>
        <button onClick={() => handleButtonClick('8')}>8</button>
        <button onClick={() => handleButtonClick('9')}>9</button>
        <button onClick={() => handleButtonClick('/')} className="operator">/</button>
        <button onClick={() => handleButtonClick('4')}>4</button>
        <button onClick={() => handleButtonClick('5')}>5</button>
        <button onClick={() => handleButtonClick('6')}>6</button>
        <button onClick={() => handleButtonClick('*')} className="operator">*</button>
        <button onClick={() => handleButtonClick('1')}>1</button>
        <button onClick={() => handleButtonClick('2')}>2</button>
        <button onClick={() => handleButtonClick('3')}>3</button>
        <button onClick={() => handleButtonClick('-')} className="operator">-</button>
        <button onClick={() => handleButtonClick('0')}>0</button>
        <button onClick={() => handleButtonClick('.')}>.</button>
        <button onClick={() => handleButtonClick('=')}>=</button>
        <button onClick={() => handleButtonClick('+')} className="operator">+</button>
        <button onClick={() => handleButtonClick('⌫')} className="backspace">⌫</button>
        <button onClick={() => handleButtonClick('C')} className="clear">C</button>
      </div>
    </div>
  )
}

export default App