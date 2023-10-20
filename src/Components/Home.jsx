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
    
  return (
    <div>
        <h2>Books Inventory System</h2>
        <ul>
            {books.map((book) => (
            <li key={book.id}>
                {book.title} by {book.author} 
            </li>
            ))}
        </ul>

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