import React, { useState } from 'react';
import SignUpForm from "./components/SignUpForm";
import SignInForm from './components/SignInForm';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  const handleSignUp = (userData) => {
    console.log('Sign up successful:', userData); // Debug log
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleSignIn = (userData) => {
    console.log('Sign in successful:', userData); // Debug log
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleNavigateToLogin = () => {
    console.log('Navigating to login'); // Debug log
    setCurrentPage('login');
  };

  const handleNavigateToSignUp = () => {
    console.log('Navigating to signup'); // Debug log
    setCurrentPage('signup');
  };

  console.log('Current page:', currentPage); // Debug log

  return (
    <div>
      {currentPage === 'signup' && (
        <SignUpForm 
          onSignUp={handleSignUp}
          onNavigateToLogin={handleNavigateToLogin}
        />
      )}
      {currentPage === 'login' && (
        <SignInForm 
          onSignIn={handleSignIn}
          onNavigateToSignUp={handleNavigateToSignUp}
        />
      )}
      {currentPage === 'dashboard' && (
        <div className="p-4">
          <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
          <button 
            onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('userId');
              setUser(null);
              setCurrentPage('login');
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;