import { useEffect, useState } from 'react';
import './DashBoardStyles.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function DashBoard(){
    const [shelves, setShelves] = useState([]);
    const [bookCounts, setBookCounts] = useState({});
    const [shelveName, setShelveName] = useState('');
    const [isAddShelveOpen, setIsAddShelveOpen] = useState(false);

    const token = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).Token : "";

    const apiBaseUrl = 'http://localhost:5029/api/Shelve';
    const apiBooksBaseUrl = 'http://localhost:5029/api/Books';
    const navigate = useNavigate();

    const getShelvesData = async() =>{
        try {
            const response =await axios.get(apiBaseUrl, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            setShelves(response.data);

            const counts = {};
            for (const shelf of response.data) {
                const countResponse = await axios.get(`${apiBooksBaseUrl}/${shelf.Id}/bookCount`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                counts[shelf.Id] = countResponse.data;
            }
            setBookCounts(counts);
        } catch (error) {
            console.error(error);
        }
    }

    const addShelve = async () => {
        try {
            await axios.post(apiBaseUrl, { shelveName }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            closeAddShelve();
            getShelvesData();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getShelvesData();
    }, []);

    const openAddShelve = () => {
        setIsAddShelveOpen(true);
    };

    const closeAddShelve = () => {
        setIsAddShelveOpen(false);
        setShelveName('');
    };

    const logOut = () => {
        localStorage.removeItem("userData");
        navigate('/login');
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return(
        <div>
            <div className='navbar'>
                <h1>Books Inventory System</h1>
                <div>
                    <button id='addNewShelve' onClick={openAddShelve}>Add New Shelve</button>
                    <button onClick={logOut}>Logout</button>
                </div>
            </div>

            <div className='addNewShelve'>
                {isAddShelveOpen && (
                    <div className="add-shelve-popup">
                        <span id='addShelve'>Add Shelve</span>
                        <input
                            value={shelveName}
                            onChange={(e) => setShelveName(e.target.value)}
                        />
                        <div className="buttons">
                            <button className="addButton" onClick={addShelve}>Add</button>
                            <button className="cancelButton" onClick={closeAddShelve}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            <div className='shelvesContainer'>
                {shelves.map(({ Id, ShelveName }) => (
                    <Link to={`/shelve/${Id}`} key={Id} className="shelve-link">
                        <div className='shelveCard'>
                            <div className="shelve-nav" style={{ backgroundColor: getRandomColor() }}></div>
                            <h2>{ShelveName}</h2>
                            <h3 className="book-count">Books Count : {bookCounts[Id] || 0}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default DashBoard;