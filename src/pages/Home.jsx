import React, { useState, useEffect } from 'react';
import { Car, MapPin, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modelType, setModelType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [cityCars, setCityCars] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/cars')
      .then(res => res.json())
      .then(data => {
        setCars(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cars:', error);
        setLoading(false);
      });
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.car_name.toLowerCase().includes(search.toLowerCase());
    const matchesModel = modelType ? car.type === modelType : true;
    const matchesCity = cityCars ? car.location === cityCars : true;
    const matchesPrice = priceRange
      ? priceRange === 'Cheap'
        ? car.price < 2000000
        : priceRange === 'Avg'
        ? car.price >= 2000000 && car.price <= 20000000
        : car.price > 20000000
      : true;
    return matchesSearch && matchesModel && matchesCity && matchesPrice;
  });

  const availableCars = filteredCars.filter(car => !car.sold);
  const soldCars = filteredCars.filter(car => car.sold);
  const models = [...new Set(cars.map(car => car.type))];
  const cities = [...new Set(cars.map(car => car.location))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search by car name"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
      value={cityCars}
      onChange={e => setCityCars(e.target.value)}
    >
      <option value="">All Cities</option>
      {loading ? (
        <option value="">Loading...</option>
      ) : (
        cities.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))
      )}
    </select>
        <select
      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
      value={modelType}
      onChange={e => setModelType(e.target.value)}
    >
      <option value="">All Types</option>
      {loading ? (
        <option value="">Loading...</option>
      ) : (
        models.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))
      )}
    </select>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
          value={priceRange}
          onChange={e => setPriceRange(e.target.value)}
        >
          <option value="">All Price Ranges</option>
          <option value="Cheap">Cheap</option>
          <option value="Avg">Average</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Available Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCars.map((car, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <motion.img
                src={car.image || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1000'}
                alt={car.car_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{car.car_name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{car.car_year}</p>
                <p className="text-gray-600 dark:text-gray-300">Model: {car.car_model}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5 mr-2" />
                    {car.location}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Car className="h-5 w-5 mr-2" />
                    {car.type}
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-bold">
                    <IndianRupee className="h-5 w-5 mr-2" />
                    {car.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Sold Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soldCars.map((car, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <motion.img
                src={car.image || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1000'}
                alt={car.car_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{car.car_name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{car.car_year}</p>
                <p className="text-gray-600 dark:text-gray-300">Model: {car.car_model}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5 mr-2" />
                    {car.location}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Car className="h-5 w-5 mr-2" />
                    {car.type}
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-bold">
                    <IndianRupee className="h-5 w-5 mr-2" />
                    {car.price.toLocaleString()}
                  </div>
                  <div className="mt-2">
                    <span className="text-red-600 font-bold">Sold</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
