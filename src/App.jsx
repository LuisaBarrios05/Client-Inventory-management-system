import './App.css'
import './index.css'
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar.jsx'
import Home from './Views/Home/Home.jsx';
import Products from './Views/Products/Products.jsx'
import Detail from './Views/DetailProduct/Detail.jsx';
import CreateProductView from './Views/CreateProduct/CreateProductView.jsx'
import Login from './Views/Login/Login.jsx'
import EditProductView from './Views/EditProduct/EditProductView.jsx';
import CostPercentagesView from './Views/CostPercentages/CostPercentagesView.jsx';
import ProtectedRoute from './Components/Auth/ProtectedRoute.jsx';
import AdminRoute from './Components/Auth/AdminRoute.jsx';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <>
      {location.pathname !== "/login" && <NavBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/detail/:id" element={<ProtectedRoute><Detail /></ProtectedRoute>} />
        <Route path="/create" element={<AdminRoute><CreateProductView /></AdminRoute>} />
        <Route path='/costpercentages' element={<AdminRoute><CostPercentagesView/></AdminRoute>}/>
        <Route path="/edit/:id" element={<AdminRoute><EditProductView/></AdminRoute>} />
      </Routes>
    </>
  )
}

export default App
