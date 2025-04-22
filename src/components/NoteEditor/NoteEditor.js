import React, { useState, useEffect } from 'react';
import './NoteEditor.css';

function NoteEditor() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === editingId ? { ...note, title, content } : note
      ));
    } else {
      // Add new note
      const newNote = {
        id: Date.now(),
        title,
        content,
        createdAt: new Date().toLocaleString()
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
          notes.map(note => (
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
              <p>{note.content}</p>
              <small>Created: {note.createdAt}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NoteEditor;