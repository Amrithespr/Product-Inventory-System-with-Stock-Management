// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import StockManagement from './components/StockManagement';
import NotFound from './pages/NotFound';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar /><br></br>
        </header>
        <main className="container mt-5">
          <Routes>
            <Route path="/register" element={<RegisterForm />} />
            <Route path="" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/product-form" element={<ProductForm />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/stock-management" element={<StockManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


// import React from 'react';
// import './App.css';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from "./components/Navbar";
// import NotFound from "./pages/NotFound";
// import ProductForm from './components/ProductForm';
// import ProductList from './components/ProductList';
// import StockManagement from './components/StockManagement';

// function App() {
//   return (
//  <Router>
// <Navbar/>
// <Routes>
//   <Route exact path="/">
//     <ProductForm/>
//   </Route>
//   <Route path="/productlist">
//     <ProductList/>
//   </Route>
//   <Route path="/stockmanagement">
//     <StockManagement/>
//   </Route>
//   <Route path="*">
//     <NotFound />
//   </Route> 

//   <Route exact path="/" component={ProductForm} />
//    <Route exact path="/productlist" component={ProductList} />

//   <Route path="/" element={<ProductForm />} />
//   <Route path="/about" element={<ProductList />} />



// </Routes>
// </Router>




// );
// }

// export default App;
