import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        publicationDate: ''
    });
    const [updateBook, setUpdateBook] = useState({});
    const [selectedBook, setSelectedBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const apiBaseUrl = 'http://localhost:5029/api/Books';

    const getAllBooks = async () => {
        try {
          const response = await axios.get(apiBaseUrl);
          setBooks(response.data);
        } catch (error) {
          console.error(error);
        }
    };

    useEffect(() => {
        getAllBooks();
    }, []);

    const addBook = async () => {
        try {
          await axios.post(apiBaseUrl, newBook);
          setNewBook({});
          getAllBooks();
        } catch (error) {
          console.error(error);
        }
    };

    const deleteBook = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this book?');
        if (confirmDelete) {
            try {
                axios.delete(`${apiBaseUrl}/${id}`).then(() => {
                    getAllBooks();
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const editBook = (book) => {
        setSelectedBook(book);
        setUpdateBook(book);
        setIsEditing(true); 
    };

    const cancelEdit = () => {
        setSelectedBook(null);
        setIsEditing(false); 
    };
    
    const updateSelectedBook = async () => {
        if (selectedBook) {
          try {
            await axios.put(`${apiBaseUrl}/${selectedBook.id}`, updateBook);
            setUpdateBook({});
            setSelectedBook(null);
            getAllBooks();
          } catch (error) {
            console.error(error);
          }
        }
    };
    
  return (
    <div>
        <h2>Books Inventory System</h2>
        <ul>
            {books.map((book) => (
            <li key={book.id}>
                {book.title} by {book.author} 
                <button onClick={() => editBook(book)}>Edit</button>
                <button onClick={() => deleteBook(book.id)}>Delete</button>
            </li>
            ))}
        </ul>

        {isEditing && (
            <div>
            <h2>Edit Book</h2>
            <input
                type="text"
                placeholder="Title"
                value={updateBook.title || ''}
                onChange={(e) => setUpdateBook({ ...updateBook, title: e.target.value })}
            />
            <input
                type="text"
                placeholder="Author"
                value={updateBook.author || ''}
                onChange={(e) => setUpdateBook({ ...updateBook, author: e.target.value })}
            />
            <input
                type="text"
                placeholder="ISBN"
                value={updateBook.isbn || ''}
                onChange={(e) => setUpdateBook({ ...updateBook, isbn: e.target.value })}
            />
            <input
                type="date"
                placeholder="Publication Date"
                value={updateBook.publicationDate || ''}
                onChange={(e) => setUpdateBook({ ...updateBook, publicationDate: e.target.value })}
            />
            
            <button onClick={updateSelectedBook}>Update Book</button>
            <button onClick={cancelEdit}>Cancel</button>
            </div>
        )}

        <h2>Add New Book</h2>
        <input type="text" placeholder="Title" value={newBook.title || ''} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}/>
        <input type="text" placeholder="Author" value={newBook.author || ''} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}/>
        <input type="text" placeholder="ISBN" value={newBook.isbn || ''} onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}/>
        <input type="date" placeholder="Publication Date" value={newBook.publicationDate || ''} onChange={(e) => setNewBook({ ...newBook, publicationDate: e.target.value })}/>
        <button onClick={addBook}>Add Book</button>
    </div>
  )
}

export default Home