import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-brand-light bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-black text-brand-pink">
          Modket
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <NavLink to="/" className="text-brand-dark hover:text-brand-pink">
            Explore
          </NavLink>
          {user && (
            <>
              <NavLink to="/buyer/orders" className="hover:text-brand-pink">
                My Orders
              </NavLink>
              {user.isSeller && (
                <NavLink to="/seller/dashboard" className="hover:text-brand-pink">
                  Seller
                </NavLink>
              )}
              <NavLink to="/profile" className="hover:text-brand-pink">
                Profile
              </NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/signup')}>Sign up</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

