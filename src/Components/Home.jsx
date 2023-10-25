import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeStyles.css';
import { useParams, useNavigate } from 'react-router-dom';

function Home() {

    const { id: shelveId } = useParams();
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        Title: '',
        Author: '',
        ISBN: '',
        PublicationDate: '',
        ShelveId: '',
        ImageUrl: '',
        Shelve: {
            ID: '',          
            ShelveName: ''
        }
    });
    const [shelve, setShelve] = useState({
        ID: '',
        ShelveName:''
    });
    const [updateBook, setUpdateBook] = useState({});
    const [selectedBook, setSelectedBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddBookPopupOpen, setIsAddBookPopupOpen] = useState(false);

    const token = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).Token : "";

    const apiBaseUrl = 'http://localhost:5029/api/Books';
    const navigate = useNavigate();

    const getAllBooks = async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/byShelve/${shelveId}`, {
            headers: {
                Authorization: `Bearer ${token}` 
            }
          });
          setBooks(response.data);
        } catch (error) {
          console.error(error);
        }
    };

    const getShelveData = async() => {
        try {
            const response = await axios.get(`http://localhost:5029/api/Shelve/${shelveId}`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
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
        newBook.ShelveId = shelveId;
        newBook.Shelve.ID = shelveId;
        newBook.Shelve.ShelveName = shelve.ShelveName

        try {
          await axios.post(apiBaseUrl, newBook, {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });
          setNewBook({
            Title: '',
            Author: '',
            ISBN: '',
            PublicationDate: '',
            ShelveId: '',
            ImageUrl: '',
            Shelve: {
              ID: '',
              ShelveName: ''
            }});

          getAllBooks();
          closeAddBookPopup();
        } catch (error) {
          console.error(error);
        }
    };

    const deleteBook = async (ID) => {
        const confirmDelete = window.confirm('Are you sure to delete this book?');
        if (confirmDelete) {
            try {
                axios.delete(`${apiBaseUrl}/${ID}`, {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                }).then(() => {
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
            await axios.put(`${apiBaseUrl}/${selectedBook.ID}`, updateBook, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
              });
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

    const logOut = () => {
        localStorage.removeItem("userData");
        navigate('/login');
    }
    
  return (
    <div>
        <div className='navbar'>
            <h1>Books Inventory System</h1>
            <div>
                <button id='addNewShelve' onClick={openAddBookPopup}>Add Book</button>
                <button onClick={logOut}>Logout</button>
            </div>
        </div>

        <div className='addnewbook'>
            {isAddBookPopupOpen && (
                <div className="add-book-popup">
                    <h2>Add New Book to {shelve.ShelveName}</h2>
                    <div className="input-group">
                        <input type="text" placeholder="Title" value={newBook.Title || ''} onChange={(e) => setNewBook({ ...newBook, Title: e.target.value })}/>
                        <input type="text" placeholder="Author" value={newBook.Author || ''} onChange={(e) => setNewBook({ ...newBook, Author: e.target.value })}/>
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="ISBN" value={newBook.ISBN || ''} onChange={(e) => setNewBook({ ...newBook, ISBN: e.target.value })}/>
                        <input type="date" placeholder="Publication Date" value={newBook.PublicationDate || ''} onChange={(e) => setNewBook({ ...newBook, PublicationDate: e.target.value })}/>
                    </div>
                    <div className="input-group">
                        <input id="imageUrl" type="text" placeholder="Image Url" value={newBook.ImageUrl || ''} onChange={(e) => setNewBook({ ...newBook, ImageUrl: e.target.value })}/>
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
                        <input type="text" placeholder="Title" value={updateBook.Title || ''} onChange={(e) => setUpdateBook({ ...updateBook, Title: e.target.value })} />
                        <input type="text" placeholder="Author" value={updateBook.Author || ''} onChange={(e) => setUpdateBook({ ...updateBook, Author: e.target.value })}/>
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="ISBN" value={updateBook.ISBN || ''} onChange={(e) => setUpdateBook({ ...updateBook, ISBN: e.target.value })}/>
                        <input type="date" placeholder="Publication Date" value={updateBook.PublicationDate || ''} onChange={(e) => setUpdateBook({ ...updateBook, PublicationDate: e.target.value })}/>
                    </div>
                    <div className="input-group">
                        <input id="imageUrl" type="text" placeholder="Image Url" value={updateBook.ImageUrl || ''} onChange={(e) => setUpdateBook({ ...updateBook, ImageUrl: e.target.value })}/>
                    </div>
                    <div className="buttons">
                        <button onClick={updateSelectedBook}>Update Book</button>
                        <button onClick={cancelEdit} className="cancel">Cancel</button>
                    </div>
                </div>
            )}
            
        </div>

        <div className='bookcards'>
                {books.map((book) => (
                    <div className="book-card" key={book.ID}>
                        <div className="book-image" style={{ backgroundImage: `url(${book.ImageUrl})` }}>
                            <div className="book-details">
                                <h3 id='homeBookTitle'>{book.Title}</h3>
                                <h5>{book.Author}</h5>
                                <span>ISBN: {book.ISBN}</span>
                                <span>Publication Date: {book.PublicationDate}</span>
                                <div className="buttons">
                                    <button className="edit-button" onClick={() => editBook(book)}>Edit</button>
                                    <button className="delete-button" onClick={() => deleteBook(book.ID)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    </div>
  )
}

export default Home