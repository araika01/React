import React, { useState } from 'react';
import './App.css';

// Child Component 
function BookCard({
  book,
  index,
  onStatusChange,
  onRemove,
  onEditBook,
  onNotesChange,
  onResetNotes,
}) {
  console.log(`BookCard rendered: ${book.title} (id: ${book.id})`);

  // LOCAL STATE inside the child
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: book.title,
    author: book.author,
    year: book.year,
  });

  const startEdit = () => {
    setDraft({ title: book.title, author: book.author, year: book.year });
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (!draft.title.trim()) return;
    onEditBook(book.id, {
      title: draft.title.trim(),
      author: draft.author.trim() || 'unknown',
      year: Number(draft.year) || book.year,
    });
    setIsEditing(false);
  };

  const cancelEdit = () => setIsEditing(false);

  const statusColors = {
    available: '#7fb98f',
    borrowed: '#e6b576',
    reserved: '#7ea8c4',
    lost: '#d68a8a',
  };

  return (
    <div className="book-card">
      {/* Header */}
      <div className="book-header">
        {isEditing ? (
          <div className="edit-form">
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
                if (e.key === 'Escape') cancelEdit();
              }}
              placeholder="title"
              autoFocus
            />
            <input
              value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
                if (e.key === 'Escape') cancelEdit();
              }}
              placeholder="author"
            />
            <input
              type="number"
              value={draft.year}
              onChange={(e) => setDraft({ ...draft, year: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
                if (e.key === 'Escape') cancelEdit();
              }}
              placeholder="year"
            />
            <div className="edit-actions">
              <button onClick={handleSubmit} className="btn-small">Save</button>
              <button onClick={cancelEdit} className="btn-small outline">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="book-display">
            <h3 onClick={startEdit} className="book-title" title="click to edit">
              {book.title}
            </h3>
            <p className="book-author">
              {book.author} · {book.year}
            </p>
          </div>
        )}
        <button onClick={() => onRemove(book.id)} className="btn-remove" title="remove">
          ✕
        </button>
      </div>

      {/* Status */}
      <div className="status-row">
        <span className="status-label">Status:</span>
        <select
          value={book.status}
          onChange={(e) => onStatusChange(book.id, e.target.value)}
        >
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
          <option value="reserved">Reserved</option>
          <option value="lost">Lost</option>
        </select>
        <span
          className="status-badge"
          style={{ backgroundColor: statusColors[book.status] }}
        >
          {book.status}
        </span>
      </div>

      {/* Notes — LOCAL STATE */}
      <div className="notes-section">
        <label>Notes:</label>
        <input
          type="text"
          value={book.notes}
          onChange={(e) => onNotesChange(book.id, e.target.value)}
          placeholder="Add a note..."
          className="notes-input"
        />
        <button onClick={() => onResetNotes(book.id)} className="btn-small outline">
          Reset
        </button>
      </div>

      <div className="card-footer">
        <small>Card #{index + 1}</small>
        {book.status === 'lost' && <span className="lost-indicator">Lost</span>}
      </div>
    </div>
  );
}

// Parent Component 
export default function App() {
  console.log('App rendered');

  const initialBooks = [
    { id: 'b1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, status: 'available', notes: '' },
    { id: 'b2', title: '1984', author: 'George Orwell', year: 1949, status: 'borrowed', notes: 'Due next week' },
    { id: 'b3', title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, status: 'available', notes: '' },
    { id: 'b4', title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, status: 'reserved', notes: 'For book club' },
    { id: 'b5', title: 'Fahrenheit 451', author: 'Ray Bradbury', year: 1953, status: 'lost', notes: '' },
  ];

  const [books, setBooks] = useState(initialBooks);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('original');

  // Handlers
  const addBook = () => {
    const newBook = {
      id: `b${Date.now()}`,
      title: 'New Book',
      author: 'Unknown Author',
      year: new Date().getFullYear(),
      status: 'available',
      notes: '',
    };
    setBooks([newBook, ...books]);
  };

  const removeBook = (id) => setBooks(books.filter((b) => b.id !== id));

  const changeStatus = (id, newStatus) =>
    setBooks(books.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));

  // General edit 
  const editBook = (id, patch) =>
    setBooks(books.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const changeNotes = (id, newNotes) =>
    setBooks(books.map((b) => (b.id === id ? { ...b, notes: newNotes } : b)));

  const resetNotes = (id) =>
    setBooks(books.map((b) => (b.id === id ? { ...b, notes: '' } : b)));

  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === 'original' ? 'reversed' : 'original'));

  // Derived list
  let displayedBooks = [...books];
  if (filterStatus !== 'all')
    displayedBooks = displayedBooks.filter((b) => b.status === filterStatus);
  if (sortOrder === 'reversed') displayedBooks = displayedBooks.reverse();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Library Dashboard</h1>
        <p className="subhead">Manage your book collection</p>
      </header>

      <div className="controls">
        <div className="control-group">
          <button onClick={addBook} className="btn-primary">+ Add Book</button>
          <button onClick={toggleSortOrder} className="btn-secondary">
            {sortOrder === 'original' ? 'Reverse Order' : 'Original Order'}
          </button>
        </div>

        <div className="control-group filter-group">
          <label>Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="reserved">Reserved</option>
            <option value="lost">Lost</option>
          </select>
          <span className="count-badge">{displayedBooks.length} books</span>
        </div>
      </div>

      <div className="book-grid">
        {displayedBooks.length === 0 ? (
          <p className="empty-message">No books match the current filter.</p>
        ) : (
          displayedBooks.map((book, index) => (
            <BookCard
              key={book.id}
              book={book}
              index={index}
              onStatusChange={changeStatus}
              onRemove={removeBook}
              onEditBook={editBook}
              onNotesChange={changeNotes}
              onResetNotes={resetNotes}
            />
          ))
        )}
      </div>
    </div>
  );
}