import React, { useEffect, useState } from 'react'

const RateHistory = () => {
    const [exchangeRate, setExchangeRate] = useState({})
    const [baseCurrency, setBaseCurrency] = useState('USD')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [displayMode, setDisplayMode] = useState('common') // 'common' or 'all'
    
    useEffect(() => {
        setIsLoading(true)
        const url = `https://v6.exchangerate-api.com/v6/16878a320787653ffaf36cb4/latest/${baseCurrency}`
    
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    setExchangeRate(data.conversion_rates)
                } else {
                    setError('Failed to get exchange rates')
                }
                setIsLoading(false)
            })
            .catch(err => {
                console.error("Error fetching exchange rates:", err)
                setError('Failed to fetch exchange rates')
                setIsLoading(false)
            })
    }, [baseCurrency]);
    
    const handleCurrencyChange = (e) => {
        setBaseCurrency(e.target.value)
    }
    
    // List of common currencies to display with friendly names
    const commonCurrencies = [
        { code: 'USD', name: 'US Dollar' },
        { code: 'EUR', name: 'Euro' },
        { code: 'GBP', name: 'British Pound' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'CHF', name: 'Swiss Franc' },
        { code: 'CNY', name: 'Chinese Yuan' },
        { code: 'INR', name: 'Indian Rupee' },
        { code: 'BRL', name: 'Brazilian Real' }
    ]

    // Get flag emoji for currency
    const getCurrencyFlag = (currencyCode) => {
        const flagEmojis = {
            'USD': '🇺🇸',
            'EUR': '🇪🇺',
            'GBP': '🇬🇧',
            'JPY': '🇯🇵',
            'CAD': '🇨🇦',
            'AUD': '🇦🇺',
            'CHF': '🇨🇭',
            'CNY': '🇨🇳',
            'INR': '🇮🇳',
            'BRL': '🇧🇷',
            'RUB': '🇷🇺',
            'KRW': '🇰🇷',
            'SGD': '🇸🇬',
            'NZD': '🇳🇿',
            'MXN': '🇲🇽',
            'HKD': '🇭🇰',
            'TRY': '🇹🇷',
            'ZAR': '🇿🇦',
            'SEK': '🇸🇪',
            'NOK': '🇳🇴'
        }
        return flagEmojis[currencyCode] || '🌐'
    }

    return (
        <div className="rate-history-container">
            <div className="rate-history-header">
                <h2>
                    <span className="currency-icon">💱</span>
                    Currency Exchange Rates
                </h2>
                
                <div className="currency-selector">
                    <label htmlFor="baseCurrency">Base Currency:</label>
                    <div className="select-wrapper">
                        <select 
                            id="baseCurrency" 
                            value={baseCurrency} 
                            onChange={handleCurrencyChange}
                            className="currency-select"
                        >
                            {commonCurrencies.map(currency => (
                                <option key={currency.code} value={currency.code}>
                                    {getCurrencyFlag(currency.code)} {currency.code} - {currency.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading exchange rates...</p>
                </div>
            ) : error ? (
                <div className="error-message">
                    <p>⚠️ {error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Retry
                    </button>
                </div>
            ) : (
                <div className="exchange-rates-container">
                    <div className="view-toggle">
                        <button 
                            className={`toggle-button ${displayMode === 'common' ? 'active' : ''}`}
                            onClick={() => setDisplayMode('common')}
                        >
                            Common Currencies
                        </button>
                        <button 
                            className={`toggle-button ${displayMode === 'all' ? 'active' : ''}`}
                            onClick={() => setDisplayMode('all')}
                        >
                            All Currencies
                        </button>
                    </div>
                    
                    <div className="base-currency-display">
                        <span className="flag-emoji">{getCurrencyFlag(baseCurrency)}</span>
                        <span className="base-label">1 {baseCurrency} equals</span>
                    </div>
                    
                    {displayMode === 'common' ? (
                        <div className="rate-cards">
                            {commonCurrencies
                                .filter(currency => currency.code !== baseCurrency)
                                .map(currency => (
                                    <div key={currency.code} className="rate-card">
                                        <div className="rate-card-header">
                                            <span className="flag-emoji">{getCurrencyFlag(currency.code)}</span>
                                            <span className="currency-code">{currency.code}</span>
                                        </div>
                                        <div className="rate-value">
                                            {exchangeRate[currency.code]?.toFixed(4) || 'N/A'}
                                        </div>
                                        <div className="currency-name">{currency.name}</div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="all-rates-container">
                            <div className="search-container">
                                <input 
                                    type="text" 
                                    placeholder="Search currency..." 
                                    className="search-input"
                                />
                            </div>
                            <div className="rates-grid">
                                {Object.entries(exchangeRate)
                                    .filter(([currency]) => currency !== baseCurrency)
                                    .map(([currency, rate]) => (
                                        <div key={currency} className="rate-item">
                                            <div className="rate-item-header">
                                                <span className="flag-emoji mini">{getCurrencyFlag(currency)}</span>
                                                <span className="currency-code">{currency}</span>
                                            </div>
                                            <div className="rate-amount">{rate.toFixed(4)}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                    
                    <div className="data-source">
                        <small>Data source: Exchange Rate API • Last updated: {new Date().toLocaleString()}</small>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RateHistory