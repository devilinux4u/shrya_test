import React from "react";

const Filter = ({ filters, setFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Make</h3>
        <select
          name="make"
          value={filters.make}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Makes</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Ford">Ford</option>
          {/* Add more options as needed */}
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Model</h3>
        <select
          name="model"
          value={filters.model}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Models</option>
          <option value="Camry">Camry</option>
          <option value="Civic">Civic</option>
          <option value="Mustang">Mustang</option>
          {/* Add more options as needed */}
        </select>
      </div>
    </div>
  );
};

export default Filter;