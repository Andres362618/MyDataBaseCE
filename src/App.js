import React, { useState } from 'react';

const App = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [accounts, setAccounts] = useState([]);

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
    const newAccount = { email, username, password };
    setAccounts([...accounts, newAccount]);
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const handleLogin = () => {
    const account = accounts.find(
      (acc) => acc.username === username && acc.password === password
    );
    if (account) {
      setIsLoggedIn(true);
      alert('Inicio de sesión exitoso');
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
        <h2>Bienvenido</h2>
        <button onClick={handleLogout}>Cerrar Sesión</button>
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
