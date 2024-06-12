// import React, { useState } from 'react';
// import axios from 'axios';

// const ProductForm = () => {
//   const [product, setProduct] = useState({ name: '', variants: [{ name: '', subVariants: [''] }] });
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleInputChange = (e, index, subIndex = null) => {
//     const { name, value } = e.target;
//     if (subIndex !== null) {
//       const newVariants = [...product.variants];
//       newVariants[index].subVariants[subIndex] = value;
//       setProduct({ ...product, variants: newVariants });
//     } else if (index !== null) {
//       const newVariants = [...product.variants];
//       newVariants[index][name] = value;
//       setProduct({ ...product, variants: newVariants });
//     } else {
//       setProduct({ ...product, [name]: value });
//     }
//   };

//   const handleAddVariant = () => {
//     setProduct({ ...product, variants: [...product.variants, { name: '', subVariants: [''] }] });
//   };

//   const handleAddSubVariant = (index) => {
//     const newVariants = [...product.variants];
//     newVariants[index].subVariants.push('');
//     setProduct({ ...product, variants: newVariants });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate product name
//     if (!product.name.trim()) {
//       setError('Product name is required');
//       return;
//     }

//     // Validate variants and sub-variants
//     for (let i = 0; i < product.variants.length; i++) {
//       if (!product.variants[i].name.trim()) {
//         setError(`Variant ${i + 1} name is required`);
//         return;
//       }
//       for (let j = 0; j < product.variants[i].subVariants.length; j++) {
//         if (!product.variants[i].subVariants[j].trim()) {
//           setError(`Sub-variant ${j + 1} of variant ${i + 1} is required`);
//           return;
//         }
//       }
//     }

//     setError(null);
//     setSuccess(null);

//     try {
//       await axios.post('/api/products', product);
//       setSuccess('Product created successfully!');
//       setProduct({ name: '', variants: [{ name: '', subVariants: [''] }] }); // Reset form
//     } catch (err) {
//       setError('An error occurred while creating the product');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="card">
//         <div className="card-header" style={{ textAlign: 'center' }}>
//           <h2>Create New Product</h2>
//         </div>
//         <div className="card-body">
//           {error && <div className="alert alert-danger">{error}</div>}
//           {success && <div className="alert alert-success">{success}</div>}
//           <form onSubmit={handleSubmit}>
//             <div className="form-group mb-3">
//               <label>Product Name:</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="name"
//                 value={product.name}
//                 onChange={(e) => handleInputChange(e, null)}
//                 required
//               />
//             </div>
//             {product.variants.map((variant, index) => (
//               <div key={index} className="mb-3">
//                 <div className="form-group mb-2">
//                   <label>Variant Name:</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="name"
//                     value={variant.name}
//                     onChange={(e) => handleInputChange(e, index)}
//                     required
//                   />
//                 </div>
//                 {variant.subVariants.map((subVariant, subIndex) => (
//                   <div key={subIndex} className="form-group mb-2">
//                     <label>Sub-Variant:</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={subVariant}
//                       onChange={(e) => handleInputChange(e, index, subIndex)}
//                       required
//                     />
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   className="btn btn-secondary mb-2"
//                   onClick={() => handleAddSubVariant(index)}
//                 >
//                   Add Sub-Variant
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               className="btn btn-secondary mb-2"
//               onClick={handleAddVariant}
//             >
//               Add Variant
//             </button>
//             <button type="submit" className="btn btn-primary">Create Product</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;


import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [product, setProduct] = useState({ name: '', variants: [{ name: '', subVariants: [''] }] });
  const [error, setError] = useState(null);

  const handleInputChange = (e, index, subIndex = null) => {
    const { name, value } = e.target;
    if (subIndex !== null) {
      const newVariants = [...product.variants];
      newVariants[index].subVariants[subIndex] = value;
      setProduct({ ...product, variants: newVariants });
    } else if (index !== null) {
      const newVariants = [...product.variants];
      newVariants[index][name] = value;
      setProduct({ ...product, variants: newVariants });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleAddVariant = () => {
    setProduct({ ...product, variants: [...product.variants, { name: '', subVariants: [''] }] });
  };

  const handleAddSubVariant = (index) => {
    const newVariants = [...product.variants];
    newVariants[index].subVariants.push('');
    setProduct({ ...product, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name) {
      setError('Product name is required');
      return;
    }
    for (let variant of product.variants) {
      if (!variant.name) {
        setError('All variant names are required');
        return;
      }
    }
    setError(null);
    try {
      await axios.post('/api/products/', product);
      // handle success (e.g., reset form, show success message)
    } catch (err) {
      setError('An error occurred while creating the product');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h2>Create New Product</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Product Name:</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={product.name}
                onChange={(e) => handleInputChange(e, null)}
                required
              />
            </div>
            {product.variants.map((variant, index) => (
              <div key={index} className="mb-3">
                <div className="form-group mb-2">
                  <label>Variant Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={variant.name}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                  />
                </div>
                {variant.subVariants.map((subVariant, subIndex) => (
                  <div key={subIndex} className="form-group mb-2">
                    <label>Sub-Variant:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={subVariant}
                      onChange={(e) => handleInputChange(e, index, subIndex)}
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary mb-2"
                  onClick={() => handleAddSubVariant(index)}
                >
                  Add Sub-Variant
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary mb-2"
              onClick={handleAddVariant}
            >
              Add Variant
            </button>
            <button type="submit" className="btn btn-primary">Create Product</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
