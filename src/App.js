import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function App() {
    return (<div className="App">
        Hello World!
        <Jump/>
        <List/>
    </div>);
}

function List() {
    const [items, setItems] = useState([1, 2, 3, 4, 5]);
    //hook component init
    useEffect(() => {
        alert("component init");
    }, []);
    return (<ul>
        {items.map((item, index) => ListItem(item, index, setItems))}
    </ul>);
}

function ListItem(item, index, setItems) {
    return (<li key={index}>
        {item}
        <button onClick={() => {
            setItems((items) => {
                return items.filter((_, i) => i !== index);
            });
        }}>Delete
        </button>
    </li>);
}

//button link to /detail
function Jump() {
    return (<div>
        <ul>
            <li>
                <Link to="/detail">Detail</Link>
            </li>
            <li>
                <Link to="/login">Login</Link>
            </li>
        </ul>
    </div>);
}

export default App;
