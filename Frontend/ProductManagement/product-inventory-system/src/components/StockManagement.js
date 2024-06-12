import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [subVariants, setSubVariants] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedSubVariant, setSelectedSubVariant] = useState('');
  const [stockChange, setStockChange] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products/');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  const fetchVariants = async (productId) => {
    try {
      const response = await axios.get(`/products/${productId}/variants/`);
      setVariants(response.data);
    } catch (err) {
      setError('Failed to fetch variants');
    }
  };

  const fetchSubVariants = async (variantId) => {
    try {
      const response = await axios.get(`/variants/${variantId}/subvariants/`);
      setSubVariants(response.data);
    } catch (err) {
      setError('Failed to fetch sub-variants');
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);
    fetchVariants(productId);
    setVariants([]);
    setSubVariants([]);
    setSelectedVariant('');
    setSelectedSubVariant('');
    setError(null);
    setSuccess(null);
  };

  const handleVariantChange = (e) => {
    const variantId = e.target.value;
    setSelectedVariant(variantId);
    fetchSubVariants(variantId);
    setSubVariants([]);
    setSelectedSubVariant('');
    setError(null);
    setSuccess(null);
  };

  const handleSubVariantChange = (e) => {
    setSelectedSubVariant(e.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleStockChange = async (operation) => {
    if (!selectedProduct || !selectedVariant || !selectedSubVariant || stockChange <= 0) {
      setError('All fields are required and stock change must be a positive number');
      return;
    }

    try {
      await axios.post(`/api/subvariants/${selectedSubVariant}/${operation}_stock/`, {
        quantity: stockChange,
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
              <label className="form-label">Product:</label>
              <select className="form-control" value={selectedProduct} onChange={handleProductChange}>
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.product_name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Variant:</label>
              <select className="form-control" value={selectedVariant} onChange={handleVariantChange} disabled={!selectedProduct}>
                <option value="">Select Variant</option>
                {variants.map(variant => (
                  <option key={variant.id} value={variant.id}>{variant.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Sub-Variant:</label>
              <select className="form-control" value={selectedSubVariant} onChange={handleSubVariantChange} disabled={!selectedVariant}>
                <option value="">Select Sub-Variant</option>
                {subVariants.map(subVariant => (
                  <option key={subVariant.id} value={subVariant.id}>{subVariant.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Stock Change:</label>
              <input
                type="number"
                className="form-control"
                value={stockChange}
                onChange={(e) => setStockChange(parseInt(e.target.value, 10))}
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
