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
                                             alt="wacommerce"/></NavLink>
                        <div className="d-flex">
                            <div className="auth-header">
                                <div>
                                    <i className="fas fa-shopping-basket"></i>
                                    <a href="http://127.0.0.1:3000/index">
                                        <button>Formulaire<i className="fas fa-angle-right"></i></button>
                                    </a>
                                </div>
                                <div>
                                    <i className="fas fa-tools"></i>
                                    <a href="http://127.0.0.1:3000/dashboard">
                                        <button>Dashboard<i className="fas fa-angle-right"></i></button>
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
