import { useState, useEffect } from 'react'
import { obtenerAulas, crearAula, actualizarAula, eliminarAula } from '../services/aulaService.js'
import { obtenerDocentes } from '../services/usuarioService.js'
import { useAuth } from './useAuth.js'

export function useAulas() {
    const { token } = useAuth()   

    const [aulas, setAulas] = useState([])
    const [docentes, setDocentes] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)


    const cargarAulas = async () => {
        setCargando(true)
        setError(null)
        try {
            const respuesta = await obtenerAulas(token)
            if (respuesta.ok) {
                setAulas(respuesta.data.aulas)
            } else {
                setError(respuesta.message)
            }
        } catch (problema) {
            console.error(problema)
            setError('No se pudieron cargar las aulas')
        } finally {
            setCargando(false)
        }
    }

   
    const cargarDocentes = async () => {
        try {
            const respuesta = await obtenerDocentes(token)
            if (respuesta.ok) {
                setDocentes(respuesta.data.docentes)
            }
        } catch (problema) {
            console.error(problema)
        }
    }


    useEffect(() => {
        cargarAulas()
        cargarDocentes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const guardarAula = async (datos, aulaId) => {
        try {
            let respuesta
            if (aulaId) {
                respuesta = await actualizarAula(token, aulaId, datos)
            } else {
                respuesta = await crearAula(token, datos)
            }

            if (!respuesta.ok) {
                setError(respuesta.message)
                return false
            }

            await cargarAulas()
            return true

        } catch (problema) {
            console.error(problema)
            setError('No se pudo guardar el aula')
            return false
        }
    }

    const borrarAula = async (aulaId) => {
        try {
            const respuesta = await eliminarAula(token, aulaId)
            if (!respuesta.ok) {
                setError(respuesta.message)
                return
            }
            await cargarAulas()
        } catch (problema) {
            console.error(problema)
            setError('No se pudo eliminar el aula')
        }
    }

    return {
        aulas,
        docentes,
        cargando,
        error,
        guardarAula,
        borrarAula
    }
}