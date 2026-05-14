import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notes')
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return

    try {
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newNote }),
      })

      if (!response.ok) {
        throw new Error('Failed to add note')
      }

      const data = await response.json()
      setNotes([...notes, data])
      setNewNote('')
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete note')
      }

      setNotes(notes.filter(note => note.id !== id))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const startEditing = (note) => {
    setEditingNote(note.id)
    setEditContent(note.content)
  }

  const updateNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editContent }),
      })

      if (!response.ok) {
        throw new Error('Failed to update note')
      }

      const updatedNote = await response.json()
      setNotes(notes.map(note => note.id === id ? updatedNote : note))
      setEditingNote(null)
      setEditContent('')
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Notes App</h1>
          <div className="note-form">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note"
            />
            <button onClick={addNote}>Add Note</button>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>Your Notes</h2>
          <ul className="note-list">
            {notes.map(note => (
              <li key={note.id} className="note-item">
                {editingNote === note.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button onClick={() => updateNote(note.id)}>Save</button>
                    <button onClick={() => setEditingNote(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="note-content">
                    <span>{note.content}</span>
                    <div className="note-actions">
                      <button onClick={() => startEditing(note)}>Edit</button>
                      <button onClick={() => deleteNote(note.id)}>Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App