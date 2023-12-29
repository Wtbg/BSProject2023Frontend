import React from 'react';
import './index.css';
import {UserService} from "./component/user/UserService";
import {MyLayout} from "./component/Layout";
import {BrowserRouter, Route, Routes,} from 'react-router-dom';
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./utils/store";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";


const root = (document.getElementById('root'));
render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MyLayout/>}/>
                <Route path="/login" element={<DevSupport ComponentPreviews={ComponentPreviews}
                                                          useInitialHook={useInitial}
                >
                    <UserService/>
                </DevSupport>}/>
            </Routes>
        </BrowserRouter>
    </Provider>
    , root
);


// reportWebVitals();
