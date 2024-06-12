import React, { useState } from 'react';
import axios from 'axios';

const StockManagement = () => {
  const [productId, setProductId] = useState('');
  const [variantId, setVariantId] = useState('');
  const [subVariantId, setSubVariantId] = useState('');
  const [stockChange, setStockChange] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError(null); // Clear error message on input change
    setSuccess(null); // Clear success message on input change

    if (name === 'productId') setProductId(value);
    else if (name === 'variantId') setVariantId(value);
    else if (name === 'subVariantId') setSubVariantId(value);
    else if (name === 'stockChange') setStockChange(parseInt(value, 10));
  };

  const handleStockChange = async (operation) => {
    if (!productId || !variantId || !subVariantId || stockChange <= 0) {
      setError('All fields are required and stock change must be a positive number');
      return;
    }

    try {
      await axios.post(`/api/products/${productId}/variants/${variantId}/subVariants/${subVariantId}/stock`, {
        operation,
        amount: stockChange,
      });
      setSuccess(`Stock successfully ${operation === 'add' ? 'added' : 'removed'}`);
      setError(null);
    } catch (err) {
      setError('An error occurred while updating the stock');
      setSuccess(null);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header" style={{ textAlign: 'center' }}>
          <h2>Stock Management</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form>
            <div className="mb-3">
              <label className="form-label">Product ID:</label>
              <input
                type="text"
                className="form-control"
                name="productId"
                value={productId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Variant ID:</label>
              <input
                type="text"
                className="form-control"
                name="variantId"
                value={variantId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Sub-Variant ID:</label>
              <input
                type="text"
                className="form-control"
                name="subVariantId"
                value={subVariantId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Stock Change:</label>
              <input
                type="number"
                className="form-control"
                name="stockChange"
                value={stockChange}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="button" className="btn btn-success me-md-2" onClick={() => handleStockChange('add')}>
                Add Stock
              </button>
              <button type="button" className="btn btn-danger" onClick={() => handleStockChange('remove')}>
                Remove Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
