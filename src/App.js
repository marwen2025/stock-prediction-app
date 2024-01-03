import React, { useState, useEffect } from 'react';
import ReactHighcharts from 'react-highcharts/ReactHighstock.src';
import moment from 'moment';
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import Image from './assets/8474109.png'


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
  const [open, setOpen] = useState(false);

  return (
<>
<div className="flex flex-col h-screen">
  <div className="bg-gray-800 text-white py-8">
    <div className="container mx-auto flex items-center justify-center">
      <a href="/#" className="block">
        <img
          src={Image}
          alt="logo"
          className="w-50 h-40 object-contain"
        />
      </a>
    </div>
  </div>

  <div className="container mx-auto mt-8 flex-grow">
    <label className="block text-xl font-bold mb-2 text-gray-800">
      Select Stock Model:
    </label>
    <select
      onChange={(e) => setSelectedModel(e.target.value)}
      className="w-full p-2 border rounded-md"
    >
      <option value="tesla">Tesla</option>
      {/*<option value="netflix">Netflix</option>*/}
      {/*<option value="amazon">Amazon</option>*/}        
      <option value="samsung">Samsung</option>
      {/* <option value="apple">Apple</option> */}
      <option value="meta">Meta</option>
    </select>

    <div className="mt-8">
      <ReactHighcharts config={configPrice}></ReactHighcharts>
    </div>
  </div>

  <footer className="bg-gray-800 text-white py-4">
    <div className="container mx-auto flex items-center justify-center">
      <p className="text-sm">© 2024 TrendCraft. All rights reserved.</p>
    </div>
  </footer>
</div>

</>




  );
};

export default App;
