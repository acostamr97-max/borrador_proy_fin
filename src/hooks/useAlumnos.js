import { useState, useEffect } from 'react'
import { obtenerAlumnosDeAula, crearAlumno, eliminarAlumno } from '../services/alumnoService.js'
import { useAuth } from './useAuth.js'


export function useAlumnos(aulaId) {
    const { token } = useAuth()
    const [alumnos, setAlumnos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

   
    const cargarAlumnos = async () => {
        if (!aulaId) return   
        setCargando(true)
        setError(null)
        try {
            const respuesta = await obtenerAlumnosDeAula(token, aulaId)
            if (respuesta.ok) {
                setAlumnos(respuesta.data.alumnos)
            } else {
                setError(respuesta.message)
            }
        } catch (problema) {
            console.error(problema)
            setError('No se pudieron cargar los alumnos')
        } finally {
            setCargando(false)
        }
    }

   
    useEffect(() => {
        cargarAlumnos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aulaId])

    const agregarAlumno = async (datos) => {
        try {
            const respuesta = await crearAlumno(token, { ...datos, aula: aulaId })
            if (!respuesta.ok) {
                setError(respuesta.message)
                return false
            }
            await cargarAlumnos()
            return true
        } catch (problema) {
            console.error(problema)
            setError('No se pudo agregar el alumno')
            return false
        }
    }

    /* Quitar un alumno */
    const quitarAlumno = async (alumnoId) => {
        try {
            const respuesta = await eliminarAlumno(token, alumnoId)
            if (!respuesta.ok) {
                setError(respuesta.message)
                return
            }
            await cargarAlumnos()
        } catch (problema) {
            console.error(problema)
            setError('No se pudo quitar el alumno')
        }
    }

    return { alumnos, cargando, error, agregarAlumno, quitarAlumno }
}