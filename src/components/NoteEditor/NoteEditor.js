import React, { useState, useEffect } from 'react';
import './NoteEditor.css';

function NoteEditor() {
  // Initialize state with localStorage data or empty array
  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = localStorage.getItem('notes');
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      console.error("Failed to parse notes from localStorage", error);
      return [];
    }
  });
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save notes to localStorage", error);
    }
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (editingId) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === editingId ? { 
          ...note, 
          title, 
          content,
          updatedAt: formattedDate 
        } : note
      ));
    } else {
      // Add new note
      const newNote = {
        id: Date.now(),
        title,
        content,
        createdAt: formattedDate,
        updatedAt: formattedDate
      };
      setNotes([...notes, newNote]);
    }

    // Reset form
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this note permanently?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  return (
    <div className="note-editor">
      <h1>{editingId ? 'Edit Note' : 'Add New Note'}</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="note-title-input"
          required
        />
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          className="note-content-input"
          rows="5"
          required
        />
        
        <button type="submit" className="save-btn">
          {editingId ? 'Update Note' : 'Save Note'}
        </button>
        
        {editingId && (
          <button 
            type="button" 
            onClick={() => {
              setTitle('');
              setContent('');
              setEditingId(null);
            }}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="notes-list">
        <h2>Your Notes ({notes.length})</h2>
        
        {notes.length === 0 ? (
          <p className="empty-notes">No notes yet. Add one above!</p>
        ) : (
          notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map(note => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                <div className="note-actions">
                  <button 
                    onClick={() => handleEdit(note)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(note.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="note-content">{note.content}</p>
              <div className="note-dates">
                <small>Created: {note.createdAt}</small>
                {note.createdAt !== note.updatedAt && (
                  <small> | Updated: {note.updatedAt}</small>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NoteEditor;