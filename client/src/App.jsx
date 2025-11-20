import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/buyer/Home';
import ProductDetails from './pages/buyer/ProductDetails';
import BuyerOrders from './pages/buyer/BuyerOrders';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import CreateProduct from './pages/seller/CreateProduct';
import SellerOrders from './pages/seller/SellerOrders';
import SellerQna from './pages/seller/SellerQna';
import Profile from './pages/profile/Profile';

const App = () => (
  <div className="min-h-screen bg-brand-light">
    <Navbar />
    <main className="max-w-6xl mx-auto px-4 py-6">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/orders"
          element={
            <ProtectedRoute>
              <BuyerOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute requireSeller>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products"
          element={
            <ProtectedRoute requireSeller>
              <SellerProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/create"
          element={
            <ProtectedRoute requireSeller>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute requireSeller>
              <SellerOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/qna"
          element={
            <ProtectedRoute requireSeller>
              <SellerQna />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </div>
);

export default App;

