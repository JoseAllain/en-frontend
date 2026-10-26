import { useCallback, useEffect, useRef, useState } from 'react'

const API_BASE_URL = 'https://en-backend-p3na.onrender.com'

function emptyNoteForm() {
  return {
    title: '',
    content: '',
  }
}

function buildApiUrl(path) {
  return new URL(path, API_BASE_URL).toString()
}

export function useBackendApp() {
  const bootstrappedUserRef = useRef('')
  const [sessionUser, setSessionUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [notes, setNotes] = useState([])
  const [noteForm, setNoteForm] = useState(emptyNoteForm())
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const request = useCallback(
    async (path, options = {}) => {
      const { body, headers, ...rest } = options
      const response = await fetch(buildApiUrl(path), {
        ...rest,
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      })

      if (response.status === 204) {
        return null
      }

      const contentType = response.headers.get('content-type') || ''
      const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text()

      if (!response.ok) {
        const errorMessage =
          typeof payload === 'string'
            ? payload
            : payload?.message || payload?.error || 'Se produjo un error inesperado'
        throw new Error(errorMessage)
      }

      return payload
    },
    [],
  )

  const logout = useCallback(() => {
    bootstrappedUserRef.current = ''
    setCurrentUser(null)
    setSessionUser(null)
    setNotes([])
    setEditingNoteId(null)
    setNoteForm(emptyNoteForm())
    setMessage('')
  }, [])

  const loadNotes = useCallback(
    async (userId, filter = 'all', categoryName = '') => {
      if (!userId) {
        setNotes([])
        return []
      }

      const endpointByFilter = {
        all: `/api/users/${userId}/notes`,
        active: `/api/users/${userId}/notes/active`,
        archived: `/api/users/${userId}/notes/archived`,
      }

      const normalizedCategory = categoryName.trim()

      if (normalizedCategory) {
        const notesByCategory = await request(
          `/api/notes/category/${encodeURIComponent(normalizedCategory)}`,
        )

        const notesForCurrentUser = notesByCategory.filter((note) => note.userId === userId)

        const notesByFilter =
          filter === 'active'
            ? notesForCurrentUser.filter((note) => !note.archived)
            : filter === 'archived'
              ? notesForCurrentUser.filter((note) => note.archived)
              : notesForCurrentUser

        setNotes(notesByFilter)
        return notesByFilter
      }

      const notesResponse = await request(endpointByFilter[filter] || endpointByFilter.all)
      setNotes(notesResponse)
      return notesResponse
    },
    [request],
  )

  const bootstrap = useCallback(
    async (nextSessionUser) => {
      const bootstrapKey = `${nextSessionUser?.userId || ''}`

      if (!nextSessionUser?.userId || bootstrappedUserRef.current === bootstrapKey) {
        return
      }

      setLoading(true)

      try {
        setCurrentUser(nextSessionUser)

        if (nextSessionUser.userId) {
          await loadNotes(nextSessionUser.userId, 'all')
        } else {
          setNotes([])
        }

        setMessage('')
        bootstrappedUserRef.current = bootstrapKey
      } catch (error) {
        logout()
        setMessage(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [loadNotes, logout],
  )

  useEffect(() => {
    if (!sessionUser?.userId) {
      return
    }

    const timer = setTimeout(() => {
      void bootstrap(sessionUser).catch(() => {})
    }, 0)

    return () => clearTimeout(timer)
  }, [bootstrap, sessionUser])

  const login = useCallback(
    async (credentials) => {
      setLoading(true)
      setMessage('')

      try {
        const response = await request('/api/auth/login', {
          method: 'POST',
          body: credentials,
        })

        const nextSessionUser = {
          userId: response.userId,
          email: response.email,
        }

        setSessionUser(nextSessionUser)
        await bootstrap(nextSessionUser)
        return response
      } catch (error) {
        setMessage(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [bootstrap, request],
  )

  const registerUser = useCallback(
    async (payload) => {
      setLoading(true)
      setMessage('')

      try {
        const response = await request('/api/users', {
          method: 'POST',
          body: payload,
        })

        setMessage(`Usuario creado: ${response.email}. Ya puedes iniciar sesión.`)
        return response
      } catch (error) {
        setMessage(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [request],
  )

  const createNote = useCallback(
    async (payload) => {
      setLoading(true)
      setMessage('')

      try {
        const response = await request('/api/notes', {
          method: 'POST',
          body: payload,
        })

        setMessage('Nota creada.')
        return response
      } catch (error) {
        setMessage(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [request],
  )

  const updateNote = useCallback(
    async (id, payload) => {
      setLoading(true)
      setMessage('')

      try {
        const response = await request(`/api/notes/${id}`, {
          method: 'PUT',
          body: payload,
        })

        setMessage('Nota actualizada.')
        return response
      } catch (error) {
        setMessage(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [request],
  )

  const deleteNote = useCallback(
    async (id) => {
      setLoading(true)
      setMessage('')

      try {
        await request(`/api/notes/${id}`, {
          method: 'DELETE',
        })

        setMessage('Nota eliminada.')
      } catch (error) {
        setMessage(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [request],
  )

  const toggleArchive = useCallback(
    async (id, archived) => {
      setLoading(true)
      setMessage('')

      try {
        const response = await request(`/api/notes/${id}/${archived ? 'unarchive' : 'archive'}`, {
          method: 'PATCH',
        })

        setMessage(archived ? 'Nota restaurada.' : 'Nota archivada.')
        return response
      } catch (error) {
        setMessage(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [request],
  )

  const addCategoryToNote = useCallback(
    async (id, categoryName) => {
      setLoading(true)
      setMessage('')

      try {
        const response = await request(`/api/notes/${id}/categories`, {
          method: 'POST',
          body: { categoryName },
        })

        setMessage('Categoría agregada.')
        return response
      } catch (error) {
        setMessage(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [request],
  )

  const removeCategoryFromNote = useCallback(
    async (id, categoryName) => {
      setLoading(true)
      setMessage('')

      try {
        const response = await request(`/api/notes/${id}/categories/${encodeURIComponent(categoryName)}`, {
          method: 'DELETE',
        })

        setMessage('Categoría removida.')
        return response
      } catch (error) {
        setMessage(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [request],
  )

  return {
    sessionUser,
    currentUser,
    notes,
    noteForm,
    setNoteForm,
    editingNoteId,
    setEditingNoteId,
    loading,
    message,
    setMessage,
    login,
    registerUser,
    logout,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    toggleArchive,
    addCategoryToNote,
    removeCategoryFromNote,
    bootstrap,
  }
}
