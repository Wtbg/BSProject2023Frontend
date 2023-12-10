import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Login} from "./component/Login2";
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';


const router = createBrowserRouter([
    {path: '/', element: <App/>},
    {path: '/detail', element: <AppDetail/>},
    {path: '/login', element: <Login/>},
]);

function AppDetail() {
    return (<div className="App">
        Detail
    </div>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router}/>)


// reportWebVitals();
