import React, { useState, useEffect } from 'react';
import ReactHighcharts from 'react-highcharts/ReactHighstock.src';
import moment from 'moment';

const App = () => {
  const [selectedModel, setSelectedModel] = useState('tesla');
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    // Fetch stock prediction data from Flask server
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ model_name: selectedModel }),
        });

        const data = await response.json();
        setStockData(data);
      } catch (error) {
        console.error('Error fetching stock prediction data:', error);
      }
    };

    fetchData();
  }, [selectedModel]); // Re-run effect when selectedModel changes

  const options = { style: 'currency', currency: 'USD' };
  const numberFormat = new Intl.NumberFormat('en-US', options);

  const configPrice = {
    // ... existing chart configuration ...

    title: {
      text: `Stock Price and Predictions for ${selectedModel}`,
    },

    series: [
      {
        name: 'Price',
        type: 'spline',
        data: stockData.map((item) => ({
          x: new Date(item.date).getTime(),
          y: item.close,
        })),
        tooltip: {
          valueDecimals: 2,
        },
      },
      {
        name: 'Predicted Price',
        type: 'spline',
        data: stockData.map((item) => ({
          x: new Date(item.date).getTime(),
          y: item.predicted,
        })),
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
  };

  return (
    <div>
      <label>Select Stock Model:</label>
      <select onChange={(e) => setSelectedModel(e.target.value)}>
        <option value="tesla">Tesla</option>
        <option value="netflix">Netflix</option>
        <option value="amazon">Amazon</option>
        <option value="samsung">Samsung</option>
        <option value="apple">Apple</option>
        <option value="meta">Meta</option>
      </select>
      <ReactHighcharts config={configPrice}></ReactHighcharts>
    </div>
  );
};

export default App;
