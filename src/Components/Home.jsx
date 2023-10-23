import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeStyles.css'
import { useParams } from 'react-router-dom';

function Home() {

    const { id: shelveId } = useParams();
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        publicationDate: '',
        shelveId: '',
        shelve: {
            id: '',
            shelveName: ''
        }
    });
    const [shelve, setShelve] = useState({
        id: '',
        shelveName:''
    });
    const [updateBook, setUpdateBook] = useState({});
    const [selectedBook, setSelectedBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddBookPopupOpen, setIsAddBookPopupOpen] = useState(false);

    const apiBaseUrl = 'http://localhost:5029/api/Books';

    const getAllBooks = async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/byShelve/${shelveId}`);
          setBooks(response.data);
        } catch (error) {
          console.error(error);
        }
    };

    const getShelveData = async() => {
        try {
            const response = await axios.get(`http://localhost:5029/api/Shelve/${shelveId}`);
            setShelve(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllBooks();
        getShelveData();
    }, []);

    const addBook = async () => {
        newBook.shelveId = shelveId;
        newBook.shelve.id = shelveId;
        newBook.shelve.shelveName = shelve.shelveName
        console.log(newBook);
        try {
          await axios.post(apiBaseUrl, newBook);
          setNewBook({});
          getAllBooks();
          closeAddBookPopup();
        } catch (error) {
          console.error(error);
        }
    };

    const deleteBook = async (id) => {
        const confirmDelete = window.confirm('Are you sure to delete this book?');
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
            setIsEditing(false); 
          } catch (error) {
            console.error(error);
          }
        }
    };

    const openAddBookPopup = () => {
        setIsAddBookPopupOpen(true);
    };

    const closeAddBookPopup = () => {
        setIsAddBookPopupOpen(false);
    };
    
  return (
    <div>
        <div className='navbar'>
            <h2>Books Inventory System</h2>
            <button onClick={openAddBookPopup}>Add Book</button>
        </div>

        <div className='addnewbook'>
            {isAddBookPopupOpen && (
                <div className="add-book-popup">
                    <h2>Add New Book to {shelve.shelveName}</h2>
                    <div className="input-group">
                        <input type="text" placeholder="Title" value={newBook.title || ''} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}/>
                        <input type="text" placeholder="Author" value={newBook.author || ''} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}/>
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="ISBN" value={newBook.isbn || ''} onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}/>
                        <input type="date" placeholder="Publication Date" value={newBook.publicationDate || ''} onChange={(e) => setNewBook({ ...newBook, publicationDate: e.target.value })}/>
                    </div>
                    <div className="buttons">
                        <button onClick={addBook}>Add Book</button>
                        <button onClick={closeAddBookPopup} className="cancel">Cancel</button>
                    </div>
                </div>
            )}
        </div>

        <div className='addnewbook'>
            {isEditing && (
                <div className="add-book-popup">
                    <h2>Edit Book</h2>
                    <div className="input-group">
                        <input type="text" placeholder="Title" value={updateBook.title || ''} onChange={(e) => setUpdateBook({ ...updateBook, title: e.target.value })} />
                        <input type="text" placeholder="Author" value={updateBook.author || ''} onChange={(e) => setUpdateBook({ ...updateBook, author: e.target.value })}/>
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="ISBN" value={updateBook.isbn || ''} onChange={(e) => setUpdateBook({ ...updateBook, isbn: e.target.value })}/>
                        <input type="date" placeholder="Publication Date" value={updateBook.publicationDate || ''} onChange={(e) => setUpdateBook({ ...updateBook, publicationDate: e.target.value })}/>
                    </div>
                    <div className="buttons">
                        <button onClick={updateSelectedBook}>Update Book</button>
                        <button onClick={cancelEdit} className="cancel">Cancel</button>
                    </div>
                </div>
            )}
            
        </div>

        <div className='booktable'>
            <table>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                {books.map((book) => (
                <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>
                        <button className="edit-button" onClick={() => editBook(book)}>Edit</button>
                    </td>
                    <td>
                        <button className="delete-button" onClick={() => deleteBook(book.id)}>Delete</button>
                    </td>
                </tr>
                ))}
            </table>
        </div>
    </div>
  )
}

export default Home