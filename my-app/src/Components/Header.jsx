import React, {Component} from 'react';
import {NavLink} from "react-router-dom";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    };

    render() {
        return (
            <React.Fragment>
                <header>
                    <div className="container">
                        <NavLink to="/"><img className="" src="http://localhost:3000/img/logo.png"
                                             alt="Test-Technique"/></NavLink>
                        <div className="d-flex">
                            <div className="auth-header">
                                <div>
                                    <i className="fas fa-shopping-basket" style={{color: 'white'}}></i>
                                    <a href="http://127.0.0.1:3000/index">
                                        <button><span style={{color: 'white'}}>Formulaire</span><i className="fas fa-angle-right" style={{color: 'white'}}></i></button>
                                    </a>
                                </div>
                                <div>
                                    <i className="fas fa-tools" style={{color: 'white'}}></i>
                                    <a href="http://127.0.0.1:3000/dashboard">
                                        <button><span style={{color: 'white'}}>Dashboard</span><i className="fas fa-angle-right" style={{color: 'white'}}></i></button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </React.Fragment>
        );
    }
}
