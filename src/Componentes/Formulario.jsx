import "./Formulario.css"
import { useState } from "react"

export function Formulario({ setUser }){
    const [nombre, setNombre] = useState("")
    const [contraseña, setContraseña] = useState("")
    const [error, setError] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (nombre == "" || contraseña == "") {
            setError(true)
            return
        }

        setError(false)

        setUser([nombre])

    }

    return (
        <section>
            <h1>Login</h1>

            <form 
                className="formulario"
                onSubmit={handleSubmit}
            >
                <input 
                    type="text" 
                    value={nombre}
                    onChange={e=>setNombre(e.target.value)}
                />
                <input 
                    type="password" 
                    value={contraseña}
                    onChange={e=>setContraseña(e.target.value)}
                />
                <button>Iniciar sesión</button>
            </form>
            {error && <p>Todos los espacios son obligatorios</p>}
        </section>
    )
}