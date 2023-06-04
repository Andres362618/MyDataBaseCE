import React from 'react'

export const Registrar = () => {
  return (
    
    <div className="bg-light" style={{marginTop:20, padding:20}}>

    <div className="h3">
      Formulario De Registro De Pinturas
      <br/>
      <form id="miFormulario"  >
        <div className="row" style={{marginTop:20}}>
          <div className="col-6">
            <input className="form-control form-control-lg text-center" type="text" placeholder="Digite El Título" required  />
          </div>

          <div className="col-6">
            <select className="form-select form-select-lg text-center" required  >
              <option value="">Indique Estilo</option>
              <option value="Retrato">Retrato</option>
              <option value="Paisaje">Paisaje</option>
              <option value="Desnudo">Desnudo</option>
            </select>
          </div>
        </div>
        
        <div className="row" style={{marginTop:20}}>
          <div className="col-6">
            <select className="form-select form-select-lg text-center" required  >
              <option value="">Indique Técnica</option>
              <option value="Óleo">Óleo</option>
              <option value="Acrílico">Acrílico</option>
              <option value="Pastel">Pastel</option>
            </select>
          </div>
          <div className="col-6">
            <input className="form-control form-control-lg text-center" type="number" min="1" max="100000000" placeholder="Digite El Precio" required  />
          </div>
        </div>

        <div className="row" style={{marginTop:20}}>
          <div className="col">
            <button className="btn btn-primary btn-lg">Guardar Datos</button>
          </div>
        </div>
      </form>
    </div>
            
  </div>


  )
}
