import React, { useState } from 'react';
import './NoteEditor.css';

function NoteEditor() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addNote = () => {
    if (!title.trim() || !content.trim()) return;
    
    const newNote = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toLocaleString()
    };
    
    setNotes([...notes, newNote]);
    setTitle('');
    setContent('');
  };

  return (
    <div className="note-editor">
      <h1>Notes</h1>
      <div className="note-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="note-title-input"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          className="note-content-input"
          rows="5"
        />
        <button onClick={addNote} className="add-note-btn">
          Add Note
        </button>
      </div>
      <div className="notes-list">
        {notes.map(note => (
          <div key={note.id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>{note.createdAt}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoteEditor;