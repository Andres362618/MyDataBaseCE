import React, { useState, useEffect } from 'react';
import { compressPassword } from './huffman';
import './styles.css';

const App = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const [selectedCell, setSelectedCell] = useState(null);
  const [editedCellValue, setEditedCellValue] = useState('');

  useEffect(() => {
    const storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    }

    // Initialize databases and tables
    const initialDatabases = [
      {
        name: 'MyDatabase',
        tables: [
          {
            name: 'Users',
            columns: ['id', 'username', 'email', 'password'],
            rows: [
              [1, 'JohnDoe', 'john@example.com', 'password123'],
              [2, 'JaneDoe', 'jane@example.com', 'password456'],
            ],
          },
          // Add more tables if needed
        ],
      },
    ];

    setDatabases(initialDatabases);
    setSelectedDatabase(initialDatabases[0]);
    setTables(initialDatabases[0].tables);
    setSelectedTable(initialDatabases[0].tables[0]);
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
    if (email.trim() === '' || username.trim() === '' || password.trim() === '') {
      alert('Debes llenar el formulario.');
      return;
    }

    alert('Cuenta creada exitosamente!');
    const compressedPassword = compressPassword(password);
    const newAccount = { email, username, password: compressedPassword };
    setAccounts([...accounts, newAccount]);
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      alert('Debes llenar el formulario.');
      return;
    }

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

  const handleCreateDatabase = () => {
    const databaseName = prompt('Ingrese el nombre de la base de datos:');
    if (databaseName) {
      const newDatabase = {
        name: databaseName,
        tables: [],
      };
      setDatabases([...databases, newDatabase]);
      setSelectedDatabase(newDatabase);
      setTables([]);
    }
  };

  const handleSelectDatabase = (database) => {
    setSelectedDatabase(database);
    setTables(database.tables);
    setSelectedTable(null); // Reset selected table when switching databases
  };

  const handleCreateTable = () => {
    if (!selectedDatabase) {
      alert('Debe seleccionar una base de datos antes de crear una tabla.');
      return;
    }

    const tableName = prompt('Ingrese el nombre de la tabla:');
    if (tableName) {
      const newTable = {
        name: tableName,
        columns: [],
        rows: [],
      };
      const updatedDatabase = {
        ...selectedDatabase,
        tables: [...tables, newTable],
      };
      setDatabases(
        databases.map((database) => (database === selectedDatabase ? updatedDatabase : database))
      );
      setTables(updatedDatabase.tables);
      setSelectedTable(newTable);
    }
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
    setSelectedCell(null); // Reset selected cell when switching tables
  };

  const handleCellClick = (rowIndex, columnIndex, value) => {
    setSelectedCell({ rowIndex, columnIndex });
    setEditedCellValue(value);
  };

  const handleCellChange = (event) => {
    setEditedCellValue(event.target.value);
  };

  const handleCellBlur = () => {
    if (selectedCell) {
      const { rowIndex, columnIndex } = selectedCell;
      const updatedRows = [...selectedTable.rows];
      updatedRows[rowIndex][columnIndex] = editedCellValue;

      const updatedTable = {
        ...selectedTable,
        rows: updatedRows,
      };

      const updatedTables = tables.map((table) =>
        table === selectedTable ? updatedTable : table
      );

      setSelectedTable(updatedTable);
      setTables(updatedTables);
      setSelectedCell(null);
    }
  };

  const renderDatabaseList = () => {
    return databases.map((database) => (
      <li key={database.name} onClick={() => handleSelectDatabase(database)}>
        {database.name}
      </li>
    ));
  };

  const renderTableList = () => {
    return tables.map((table) => (
      <li key={table.name} onClick={() => handleSelectTable(table)}>
        {table.name}
      </li>
    ));
  };

  const renderTableContent = () => {
    if (!selectedTable) {
      return <div>No table selected</div>;
    }

    const { columns, rows } = selectedTable;

    return (
      <div>
        <h3>{selectedTable.name}</h3>
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, columnIndex) => (
                  <td
                    key={columnIndex}
                    onClick={() => handleCellClick(rowIndex, columnIndex, cell)}
                  >
                    {selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.columnIndex === columnIndex ? (
                      <input
                        type="text"
                        value={editedCellValue}
                        onChange={handleCellChange}
                        onBlur={handleCellBlur}
                      />
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoggedIn) {
    return (
      <div>
        <h2>Bienvenido MyDataBaseCE</h2>
        <div className="mysql-interface">
          <div className="mysql-sidebar">
            <ul>
              <li>
                <strong>Databases</strong>
                <ul>
                  {renderDatabaseList()}
                  <li onClick={handleCreateDatabase}>Crear nueva base de datos</li>
                </ul>
              </li>
              <li>
                <strong>Tables</strong>
                <ul>
                  {renderTableList()}
                  <li onClick={handleCreateTable}>Crear nueva tabla</li>
                </ul>
              </li>
              <li onClick={handleLogout}>Logout</li>
            </ul>
          </div>
          <div className="mysql-content">{renderTableContent()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ background: 'lightgray', marginTop: 20, padding: 20 }}>
      <div>
        <h1 style={{ color: 'blue', textAlign: 'center' }}>Iniciar Sesión</h1>
        <div>
          <label>
            <strong>Email:</strong>
          </label>
          <input type="email" className="form-control" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label>
            <strong>Username:</strong>
          </label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label>
            <strong>Password:</strong>
          </label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <br />
        <div>
          <button onClick={handleLogin} style={{ marginRight: '10px' }}>
            Iniciar Sesión
          </button>
          <button onClick={handleRegister}>Crear Cuenta</button>
        </div>
      </div>
    </div>
  );
};

export default App;
