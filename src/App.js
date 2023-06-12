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

  const [searchConditions, setSearchConditions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [newColumnName, setNewColumnName] = useState('');
  const [newRow, setNewRow] = useState([]);

  const handleDeleteDatabase = (database) => {
    const updatedDatabases = databases.filter((db) => db !== database);
    setDatabases(updatedDatabases);

    // Clear the selected database and tables if the deleted database was selected
    if (selectedDatabase === database) { 
      setSelectedDatabase(null);
      setTables([]); // Esta parte del código es la encargada de setear las tablas como lista vacía, el error se reporta en la documentacion escrita
      setSelectedTable(null);
    }
  };

  const handleDeleteTable = (table) => {
    const updatedTables = tables.filter((t) => t !== table);
    setTables(updatedTables);
    setSelectedTable(null); // If the deleted table was selected, clear the selected table
  };
  
  const handleAddColumn = () => {
    if (newColumnName.trim() === '') {
      alert('Favor ingresar el nombre de la columna.');
      return;
    }
  
    const updatedColumns = [...selectedTable.columns, newColumnName];
    const updatedTable = { ...selectedTable, columns: updatedColumns };
    const updatedTables = tables.map((table) => (table === selectedTable ? updatedTable : table));
  
    const updatedRows = selectedTable.rows.map((row) => [...row, '']);
    updatedTable.rows = updatedRows;

    setTables(updatedTables);
    setSelectedTable(updatedTable);
    setNewColumnName('');
  };
  
  const handleAddRow = () => {
    if (newRow.length !== selectedTable.columns.length) {
      alert('Favor ingresar datos para todas las columnas.');
      return;
    }
  
    const updatedRows = [...selectedTable.rows, newRow];
    const updatedTable = { ...selectedTable, rows: updatedRows };
    const updatedTables = tables.map((table) => (table === selectedTable ? updatedTable : table));
  
    setTables(updatedTables);
    setSelectedTable(updatedTable);
    setNewRow([]);
  };  

  const handleSearch = () => {
    if (searchConditions.length === 0) {
      alert('Ingrese al menos una condición de búsqueda.');
      return;
    }
  
    const matchedRows = selectedTable.rows.filter((row) => {
      for (const condition of searchConditions) {
        const [columnName, operator, value] = condition;
  
        const columnIndex = selectedTable.columns.indexOf(columnName);
  
        if (columnIndex === 0) {
          // Special handling for the first column
          const cellValue = row[0].toString();
  
          if (operator === '=' && cellValue === value) {
            continue;
          } else if (operator === '!=' && cellValue !== value) {
            continue;
          }
        } else {
          const cellValue = row[columnIndex];
  
          if (operator === '=' && cellValue === value) {
            continue;
          } else if (operator === '!=' && cellValue !== value) {
            continue;
          }
        }
  
        return false;
      }
  
      return true;
    });
  
    setSearchResults(matchedRows);
  };

  const handleAddCondition = () => {
    if (searchConditions.length >= 3) {
      alert('Solo se permiten hasta 3 condiciones de búsqueda.');
      return;
    }

    const newCondition = ['', '=', ''];
    setSearchConditions([...searchConditions, newCondition]);
  };

  const handleRemoveCondition = (index) => {
    const updatedConditions = searchConditions.filter((_, i) => i !== index);
    setSearchConditions(updatedConditions);
  };

  const handleConditionChange = (index, column, operator, value) => {
    const updatedConditions = [...searchConditions];
    updatedConditions[index] = [column, operator, value];
    setSearchConditions(updatedConditions);
  };

  const renderSearchConditions = () => {
    return searchConditions.map((condition, index) => (
      <div key={index} style={{ marginBottom: '10px' }}>
        <select
          value={condition[0]}
          onChange={(e) => handleConditionChange(index, e.target.value, condition[1], condition[2])}
        >
          {selectedTable.columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
        <select
          value={condition[1]}
          onChange={(e) => handleConditionChange(index, condition[0], e.target.value, condition[2])}
        >
          <option value="=">=</option>
          <option value="!=">!=</option>
        </select>
        <input
          type="text"
          value={condition[2]}
          onChange={(e) => handleConditionChange(index, condition[0], condition[1], e.target.value)}
        />
        <button onClick={() => handleRemoveCondition(index)}>Eliminar</button>
      </div>
    ));
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return <div>No se encontraron resultados.</div>;
    }
  
    return (
      <div>
        <h3>Resultados de búsqueda</h3>
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {selectedTable.columns.map((column) => (
                <th key={column} style={{ border: '1px solid black', padding: '8px' }}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {searchResults.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  

  useEffect(() => {
    const storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    }

    const initialDatabases = [
      {
        name: 'MyDatabase',
        tables: [
          {
            name: 'Miembros',
            columns: ['id', 'nombre', 'apellido', 'email', 'password'],
            rows: [
              [2023397041, 'Julia', 'Harlander', 'mharlander@estudiantec.cr', 'julia123'],
              [201058559, 'Claudio', 'Arce', 'claarce@estudiantec.cr', 'claudio456'],
              [2021572460, 'Andrés', 'Vega', 'anmadrigalv@estudiantec.cr', 'andres789'],
            ],
          },
          {
            name: 'Familiares',
            columns: ['id', 'nombre', 'apellido', 'email', 'password'],
            rows: [
              [2023842691, 'Vanessa', 'Harlander', 'vharlander@gmail.com', 'vane123'],
              [201073142, 'Jorge', 'Arce', 'jraarce@gmail.com', 'jorge456'],
              [2021687519, 'Tatiana', 'Vega', 'gfa@gmail.com', 'gfa789'],
            ],
          }
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
    setSelectedTable(null);
  };

  const handleCreateTable = () => {
    if (!selectedDatabase) {
      alert('Debe seleccionar una base de datos antes de crear una tabla.');
      return;
    }
  
    const tableName = prompt('Ingrese el nombre de la tabla:');
    if (tableName) {
      const attributes = [];
      let attributeName;
      while (true) {
        attributeName = prompt('Ingrese un atributo (deje en blanco para finalizar):');
        if (attributeName === null || attributeName.trim() === '') {
          break;
        }
        attributes.push(attributeName.trim());
      }
  
      const newTable = {
        name: tableName,
        columns: attributes,
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
    setSelectedCell(null);
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
        <button style={{marginLeft:"10px"}} onClick={() => handleDeleteDatabase(database)}>Eliminar</button>
      </li>
    ));
  };

  const renderTableList = () => {
    return tables.map((table) => (
      <li key={table.name} onClick={() => handleSelectTable(table)}>
        {table.name}
        <button style={{marginLeft:"10px"}} onClick={() => handleDeleteTable(table)}>Delete</button>
      </li>
    ));
  };

  const handleSaveChanges = () => {
    alert("Se guardaron los cambios con éxito");
    // Perform save operation here
    // You can update the state or send the updated data to a backend server
  
    // For example, you can update the local state with the modified tables
    const updatedDatabase = {
      ...selectedDatabase,
      tables: tables.map((table) => (table === selectedTable ? selectedTable : table)),
    };
  
    const updatedDatabases = databases.map((database) =>
      database === selectedDatabase ? updatedDatabase : database
    );
  
    setDatabases(updatedDatabases);
  };

  const renderTableContent = () => {
    if (!selectedTable) {
      return <div>No table selected</div>;
    }
  
    const { columns, rows } = selectedTable;
  
    return (
      <div>
        <h3>{selectedTable.name}</h3>
        {/* Add column form */}
      <div>
        <h4>Añadir Columna</h4>
        <input
          type="text"
          placeholder="Nombre de la columna"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
        />
        <button style={{marginLeft:"10px"}} onClick={handleAddColumn}>Añadir Columna</button>
      </div>

      {/* Add row form */}
      <div>
        <h4>Añadir Fila</h4>
        {selectedTable.columns.map((column, columnIndex) => (
          <input
            key={columnIndex}
            type="text"
            placeholder={column}
            value={newRow[columnIndex] || ''}
            onChange={(e) => {
              const updatedRow = [...newRow];
              updatedRow[columnIndex] = e.target.value;
              setNewRow(updatedRow);
            }}
          />
        ))}
        <br/><button style={{marginTop:"10px", marginBottom:"10px"}}onClick={handleAddRow}>Añadir Fila</button>
      </div>

      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} style={{ border: '1px solid black', padding: '5px' }}>
                {column}
              </th>
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
                  style={{ border: '1px solid black', padding: '5px' }}
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
      <button style={{marginTop:"10px"}} onClick={handleSaveChanges}>Guardar Cambios</button>
      <div style={{ marginBottom: '10px' }}>
          <h4>Buscar registros</h4>
          {renderSearchConditions()}
          <button onClick={handleSearch}>Buscar</button>
          <button style={{marginLeft:"10px"}} onClick={handleAddCondition}>Agregar Condición</button>
      </div>
      {renderSearchResults()}
      </div>
    );
  };      

  if (isLoggedIn) {
    return (
      <div>
        <h2>Bienvenido a MyDataBaseCE</h2>
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
              <li onClick={handleLogout}><strong>Logout</strong></li>
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
