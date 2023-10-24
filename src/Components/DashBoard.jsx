import { useEffect, useState } from 'react'
import './DashBoardStyles.css'
import axios from 'axios'
import { Link } from 'react-router-dom';

function DashBoard(){
    const [shelve, setShelve] = useState({
        shelveName:''
    });
    const [isAddShelveOpen, setIsAddShelveOpen] = useState(false);

    const getShelvesData = async() =>{
        try {
            const response =await axios.get(apiBaseUrl);
            setShelve(response);
        } catch (error) {
            
        }
    }

    const addShelve = async () => {
        try {
            await axios.post(apiBaseUrl, shelve);
            closeAddShelve();
            getShelvesData();
        } catch (error) {
            console.log(error);
        }
    }

    const apiBaseUrl = 'http://localhost:5029/api/Shelve';

    useEffect(()=>{
        getShelvesData();
    },[])

    const openAddShelve = () => {
        setIsAddShelveOpen(true);
    };

    const closeAddShelve = () => {
        setIsAddShelveOpen(false);
    };

    console.log(shelve.data)

    return(
        <div>
            <div className='navbar'>
                <h2>Books Inventory System</h2>
                <button onClick={openAddShelve}>Add New Shelve</button>
            </div>

            <div className='addNewShelve'>
                {isAddShelveOpen && (
                    <div className="add-shelve-popup">
                        <span>Add Shelve</span><input value={shelve.shelveName} onChange={(e) => setShelve({...shelve, shelveName: e.target.value})}/>
                        <div className="buttons">
                            <button className="addButton" onClick={addShelve}>Add</button>
                            <button className="cancelButton" onClick={closeAddShelve}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            <div className='shelvesContainer'>
                {shelve.data?.map(({Id, ShelveName}) => (<Link to={`/shelve/${Id}`} key={Id}><div className='shelveCard'><h4>{ShelveName}</h4></div></Link>))}
            </div>
        </div>
    )
}

export default DashBoard