import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState(null);
  const [username, setUsername] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [newCar, setNewCar] = useState({
    car_name: '',
    car_model: '',
    car_year: '',
    location: '',
    address: '',
    price: '',
    type: '',
    sold: false,
    image: '',
  });

  // Filter states
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    location: '',
    city: ''
  });

  const resetFilters = () => {
    setFilters({
      type: '',
      status: '',
      location: '',
      city: ''
    });
  };

  const handleAddCarToggle = () => {
    setShowAddCarForm(!showAddCarForm);
  };

  const validateCar = (car) => {
    if (car.car_name.length > 50) {
      alert("Car name cannot be more than 10 characters.");
      return false;
    }

    const currentYear = new Date().getFullYear();
    if (car.car_year < 1900 || car.car_year > currentYear) {
      alert("Car year must be between 1900 and the current year.");
      return false;
    }

    const imageUrlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)|.*)$/i;
    if (!imageUrlPattern.test(car.image)) {
      alert("Image URL must be a valid URL.");
      return false;
    }

    return true;
  };

  const handleAddCarSubmit = async () => {
    if (!validateCar(newCar)) return;

    try {
      const response = await fetch('http://localhost:3001/api/addcar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar),
      });

      if (response.ok) {
        setShowAddCarForm(false);
        fetchCars();
      } else {
        const errorData = await response.json();
        alert(`Error adding car: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding car:', error);
      alert('An unexpected error occurred.');
    }
  };

  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/cars');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminInfo = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@example.com', password: 'adminPassword' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.username) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching admin info:', error);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchAdminInfo();
  }, []);

  const handleEdit = (car) => {
    setEditingCar({ ...car });
  };

  const handleSave = async () => {
    if (!validateCar(editingCar)) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/cars/${editingCar.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingCar),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorData;

        if (contentType && contentType.includes('application/json')) {
          try {
            errorData = await response.json();
          } catch (jsonError) {
            console.error('Error parsing JSON response:', jsonError);
            errorData = { message: 'Invalid JSON response from server' };
          }
        } else {
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          errorData = { message: errorText || `HTTP error ${response.status}` };
        }

        console.error('Error updating car:', errorData.message);
        alert(`Error updating car: ${errorData.message}`);
        return;
      }

      setEditingCar(null);
      fetchCars();
    } catch (error) {
      console.error('Error during fetch or update:', error);
      alert('An unexpected error occurred.');
    }
  };

  const handleDelete = async (carId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this car?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3001/api/cars/${carId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchCars();
        } else {
          const errorData = await response.json();
          alert(`Error deleting car: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error deleting car:', error);
        alert('An unexpected error occurred.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  // Filter cars based on selected filters
  const filteredCars = cars.filter(car => {
    return (
      (filters.type === '' || car.type === filters.type) &&
      (filters.status === '' || 
        (filters.status === 'available' && !car.sold) || 
        (filters.status === 'sold' && car.sold)
      ) &&
      (filters.location === '' || car.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.city === '' || car.location === filters.city)  // Add this line for city filtering
    );
  });

  const totalCars = cars.length;
  const availableCars = cars.filter(car => !car.sold).length;
  const soldCars = cars.filter(car => car.sold).length;
  const models = [...new Set(cars.map(car => car.type))];
  const cities = [...new Set(cars.map(car => car.location))];

  const CarTable = ({ cars, title }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 dark:text-white">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
              <th className="px-6 py-3 text-left">Car Name</th>
              <th className="px-6 py-3 text-left">Model</th>
              <th className="px-6 py-3 text-left">Year</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-b dark:border-gray-700 dark:text-white">
                <td className="px-6 py-4">{car.car_name}</td>
                <td className="px-6 py-4">{car.car_model}</td>
                <td className="px-6 py-4">{car.car_year}</td>
                <td className="px-6 py-4">{car.location}</td>
                <td className="px-6 py-4 flex items-center">
                  <span className="mr-1">₹</span>{car.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">{car.type}</td>
                <td className="px-6 py-4">{car.sold ? 'Sold' : 'Available'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(car)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Hello {username}, Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-lg font-semibold dark:text-white">Total Cars</p>
          <p className="text-2xl font-bold dark:text-white">{totalCars}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-lg font-semibold dark:text-white">Available Cars</p>
          <p className="text-2xl font-bold text-green-600">{availableCars}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-lg font-semibold dark:text-white">Sold Cars</p>
          <p className="text-2xl font-bold text-blue-600">{soldCars}</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium dark:text-white">Type</label>
            <select
  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
  value={filters.type}
  onChange={e => setFilters({ ...filters, type: e.target.value })}
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
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-white">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div>
  <label className="block text-sm font-medium dark:text-white">City</label>
  <select
    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
    value={filters.city}
    onChange={e => setFilters({ ...filters, city: e.target.value })}
  >
    <option value="">All Cities...</option>
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
</div>

<div className="mt-4">
  <button
    onClick={resetFilters}
    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
  >
    Reset Filters
  </button>
</div>

        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={handleAddCarToggle}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Car
        </button>
      </div>

      {/* Available Cars Section */}
      <CarTable 
        cars={filteredCars.filter(car => !car.sold)} 
        title="Available Cars" 
      />

      {/* Sold Cars Section */}
      <CarTable 
        cars={filteredCars.filter(car => car.sold)} 
        title="Sold Cars" 
      />

      {/* Add Car Form Modal */}
      {showAddCarForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Car</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newCar.car_name}
                onChange={(e) => setNewCar({ ...newCar, car_name: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Car Name"
              />
              <input
                type="text"
                value={newCar.car_model}
                onChange={(e) => setNewCar({ ...newCar, car_model: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Model"
              />
              <input
                type="number"
                value={newCar.car_year}
                onChange={(e) => setNewCar({ ...newCar, car_year: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Year"
              />
              <input
                type="text"
                value={newCar.location}
                onChange={(e) => setNewCar({ ...newCar, location: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Location"
              />
              <input
                type="text"
                value={newCar.address}
                onChange={(e) => setNewCar({ ...newCar, address: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Address"
              />
              <input
                type="number"
                value={newCar.price}
                onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Price"
              />
              <input
                type="text"
                value={newCar.type}
                onChange={(e) => setNewCar({ ...newCar, type: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Type"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newCar.sold}
                  onChange={(e) => setNewCar({ ...newCar, sold: e.target.checked })}
                  className="mr-2"
                />
                <label>Sold</label>
              </div>
              <input
                type="text"
                value={newCar.image}
                onChange={(e) => setNewCar({ ...newCar, image: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Image URL"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleAddCarToggle}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCarSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Add Car
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Car</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={editingCar.car_name}
                onChange={(e) => setEditingCar({ ...editingCar, car_name: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Car Name"
              />
              <input
                type="text"
                value={editingCar.car_model}
                onChange={(e) => setEditingCar({ ...editingCar, car_model: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Model"
              />
              <input
                type="number"
                value={editingCar.car_year}
                onChange={(e) => setEditingCar({ ...editingCar, car_year: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Year"
              />
              <input
                type="text"
                value={editingCar.location}
                onChange={(e) => setEditingCar({ ...editingCar, location: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Location"
              />
              <input
                type="text"
                value={editingCar.address}
                onChange={(e) => setEditingCar({ ...editingCar, address: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Address"
              />
              <input
                type="number"
                value={editingCar.price}
                onChange={(e) => setEditingCar({ ...editingCar, price: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Price"
              />
              <input
                type="text"
                value={editingCar.type}
                onChange={(e) => setEditingCar({ ...editingCar, type: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Type"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingCar.sold}
                  onChange={(e) => setEditingCar({ ...editingCar, sold: e.target.checked })}
                  className="mr-2"
                />
                <label>Sold</label>
              </div>
              <input
                type="text"
                value={editingCar.image}
                onChange={(e) => setEditingCar({ ...editingCar, image: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Image URL"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingCar(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}