import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currencies, setCurrencies] = useState([])
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [exchangeRate, setExchangeRate] = useState(1)
  const [amount, setAmount] = useState(1)
  const [convertedAmount, setConvertedAmount] = useState(1)
  //fetch currencies available currencies on component mount
  useEffect(() => {
    fetch('https://v6.exchangerate-api.com/v6/16878a320787653ffaf36cb4/latest/USD')
      .then(res => res.json())
      .then
      (data => {
        const currencyList = Object.keys(data.conversion_rates)
        setCurrencies(currencyList)
      }).catch(error => console.error('Error fetching data:', error));

  }, [])

  //update exchange rates when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(`https://v6.exchangerate-api.com/v6/16878a320787653ffaf36cb4/latest/${fromCurrency}`)
        .then(res => res.json())
        .then(data => {
          const rate = data.conversion_rates[toCurrency];
          setExchangeRate(rate)
          if (amount !== "") {
            setConvertedAmount((amount* rate)).toFixed(2)
          }
        }).catch(error => console.error('Error fetching exchange rate:', error));
    }
  }, [fromCurrency, toCurrency, amount])

  const handleAmountChange = (e) => {
    const input = e.target.value;
    setAmount(input);
    if (exchangeRate && input !== '') {
      setConvertedAmount((input * exchangeRate).toFixed(2));
    } else {
      setConvertedAmount(null);
    }
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value)
  }

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value)
  }
  return (
    <div className='app'>
      <h1 className='title'>Currency Converter</h1>
      <div>
        <input type="number" className='amount' onChange={handleAmountChange} value={amount} min="0" />
      </div>
      <select className='fromCurrency' value={fromCurrency} onChange={handleFromCurrencyChange}>
        {
         currencies.map((currency) => <option value={currency} key={currency}>{currency}</option>)
        }
      </select>
      <h1 className='equals'>=</h1>
      <select className='toCurrency' value={toCurrency} onChange={handleToCurrencyChange} >
        {
          currencies.map((currency) => <option value={currency} key={currency}>{currency}</option>)
        }
      </select>
      <div>
        <h1>{convertedAmount}{toCurrency}</h1>
        <p>{amount} {fromCurrency}=  {convertedAmount}{toCurrency}</p>
      </div>
    </div>
  );
}

export default App;
