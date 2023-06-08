import React, { useState, useEffect } from 'react';
import { compressPassword } from './huffman'; 
import './styles.css';

const App = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRegister = () => {
    alert('Cuenta creada exitosamente!');
    const compressedPassword = compressPassword(password);
    const newAccount = { email, username, password: compressedPassword };
    setAccounts([...accounts, newAccount]);
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const handleLogin = () => {
    const compressedPassword = compressPassword(password);
  
    const account = accounts.find(
      (acc) => acc.username === username && acc.password === compressedPassword
    );
  
    if (account) {
      setIsLoggedIn(true);
    } else {
      alert('Credenciales inválidas');
    }
  
    setEmail('');
    setUsername('');
    setPassword('');
  };
  

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <div>
        <h2>Bienvenido MyDataBaseCE</h2>
        <div className="mysql-interface">
          <div className="mysql-sidebar">
            <ul>
              <li>Databases</li>
              <li>Tables</li>
              <li>Queries</li>
              <li>Settings</li>
              <li onClick={handleLogout}>Logout</li>
            </ul>
          </div>
          <div className="mysql-content">
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="container" style={{background:"lightgray", marginTop:20, padding:20}}>
      <div>
        <h1 style={{color:"blue", textalign:"center"}}>Iniciar Sesión</h1>
        <div>
          <label><strong>Email:</strong></label>
          <input type="email" className="form-control" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label><strong>Username:</strong></label>
          <input type="text" className="form-control" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label><strong>Password:</strong></label>
          <input type="password" className="form-control" value={password} onChange={handlePasswordChange} />
        </div><br/>
        <div>
          <button onClick={handleLogin}>Iniciar Sesión</button>
          <button onClick={handleRegister}>Crear Cuenta</button>
        </div>
      </div>
    </div>
  );
};

export default App;
