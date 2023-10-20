import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [books, setBooks] = useState([]);

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
    </div>
  )
}

export default Home