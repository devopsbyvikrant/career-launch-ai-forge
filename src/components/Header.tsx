import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isLandingPage = location.pathname === '/';
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <NavLink to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-purple">PortfolioAI</span>
        </NavLink>
        
        <nav className="hidden md:flex space-x-6 mx-4">
          {!isLandingPage && user && (
            <>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  isActive ? "text-purple font-medium" : "text-gray-600 hover:text-purple"
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/portfolio" 
                className={({ isActive }) => 
                  isActive ? "text-purple font-medium" : "text-gray-600 hover:text-purple"
                }
              >
                Portfolio
              </NavLink>
              <NavLink 
                to="/resume" 
                className={({ isActive }) => 
                  isActive ? "text-purple font-medium" : "text-gray-600 hover:text-purple"
                }
              >
                Resume
              </NavLink>
              <NavLink 
                to="/cover-letter" 
                className={({ isActive }) => 
                  isActive ? "text-purple font-medium" : "text-gray-600 hover:text-purple"
                }
              >
                Cover Letter
              </NavLink>
              <NavLink 
                to="/interview" 
                className={({ isActive }) => 
                  isActive ? "text-purple font-medium" : "text-gray-600 hover:text-purple"
                }
              >
                Interview Prep
              </NavLink>
            </>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button asChild variant="outline" className="border-purple text-purple hover:bg-purple-light">
                <NavLink to="/profile">My Profile</NavLink>
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-gray-600 hover:text-purple"
              >
                Sign Out
              </Button>
            </>
          ) : (
            isLandingPage ? (
              <>
                <Button asChild variant="ghost" className="text-gray-600 hover:text-purple">
                  <NavLink to="/auth">Sign In</NavLink>
                </Button>
                <Button asChild variant="default" className="bg-purple hover:bg-purple-dark">
                  <NavLink to="/auth?tab=signup">Get Started</NavLink>
                </Button>
              </>
            ) : (
              <Button asChild variant="default" className="bg-purple hover:bg-purple-dark">
                <NavLink to="/auth">Sign In</NavLink>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;