import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from './Componentes/Login'

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
