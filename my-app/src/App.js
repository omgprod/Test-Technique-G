import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Dashboard from "./Components/Dashboard.jsx";
import Header from "./Components/Header.jsx";
import Form from "./Components/Form.jsx";
import Treat from "./Components/Treatment.jsx";
import './App.css';

class App extends Component {
    render() {
        return (
            <Router>
                <React.Fragment>
                    <Header/>
                    <Route path={"/dashboard"} component={Dashboard}/>
                    <Route path={"/index"} component={Form}/>
                    <Route path={"/treat"} component={Treat}/>
                </React.Fragment>
            </Router>
        );
    }
}

export default App;
