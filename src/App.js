import React, { useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
//import PhotoGallery from '.components/PhotoGallery';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      {isLogin ? <Login /> : <Signup />}
      <div>
        <button onClick={toggleForm}>
          {isLogin ? 'Sign up here.' : 'Log in here.'}
        </button>
      </div>
    </div>
  );
}

export default App;
