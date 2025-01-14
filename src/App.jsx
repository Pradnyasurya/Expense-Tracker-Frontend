import React, { useState } from 'react';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import Dashboard from './components/Dashboard';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [userData, setUserData] = useState(null);

  const handleSignUp = (data) => {
    setUserData(data);
    setCurrentPage('dashboard');
  };

  const handleSignIn = (data) => {
    setUserData(data);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    setUserData(null);
    setCurrentPage('login');
  };

  return (
    <div>
      {currentPage === 'signup' && (
        <SignUpForm 
          onSignUp={handleSignUp}
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      )}
      {currentPage === 'login' && (
        <SignInForm 
          onSignIn={handleSignIn}
          onNavigateToSignUp={() => setCurrentPage('signup')}
        />
      )}
      {currentPage === 'dashboard' && (
        <div>
          <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-800">Expense Tracker</h1>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={handleLogout}
                    className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
          <Dashboard userId={userData?.userId || localStorage.getItem('userId')} />
        </div>
      )}
    </div>
  );
};

export default App;