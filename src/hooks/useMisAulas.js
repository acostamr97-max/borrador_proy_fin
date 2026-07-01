import { useState, useEffect } from 'react'
import { obtenerMisAulas } from '../services/aulaService.js'
import { useAuth } from './useAuth.js'

export function useMisAulas() {
    const { token } = useAuth()

    const [aulas, setAulas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const cargar = async () => {
            setCargando(true)
            setError(null)
            try {
                const respuesta = await obtenerMisAulas(token)
                if (respuesta.ok) {
                    setAulas(respuesta.data.aulas)
                } else {
                    setError(respuesta.message)
                }
            } catch (problema) {
                console.error(problema)
                setError('No se pudieron cargar tus aulas')
            } finally {
                setCargando(false)
            }
        }
        cargar()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { aulas, cargando, error }
}