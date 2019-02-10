import React, {Component} from 'react';
import axios from 'axios';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Order: {}
        };
        this.commandValidate = this.commandValidate.bind(this);
        this.commandCancelled = this.commandCancelled.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    /*** FetchData onLoad ***/
    getData() {
        var id = localStorage.getItem('id');
        axios.get(`http://localhost:8000/command/` + id)
            .then(data => {
                if (data.status === 200) {
                    this.setState({Order: data.data})
                } else if (data.status === 400) {
                    alert('An error occured.')
                }
            }).catch((err) => {
            console.log(err);
        })
    };

    commandValidate(id) {
        axios.post(`http://localhost:8000/treat/0`, {
            Analyse: 0,
            id: id
        }).then(data => {
            if (data.status === 200) {
                console.log(data);
                window.location.reload()
            } else if (data.status === 400) {
                console.log(data);
                alert('An error occured.')
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    commandCancelled(id) {
        axios.post(`http://localhost:8000/treat/1`, {
            Analyse: 1,
            id: id
        }).then(data => {
            if (data.status === 200) {
                console.log(data);
                window.location.reload()
            } else if (data.status === 400) {
                console.log(data);
                alert('An error occured.');
            }
        }).catch((err) => {
            console.log(err);
        });
    }


    render() {
        const command = this.state.Order;
        return (
            <React.Fragment>
                <div className="account-first-section">
                    <div className="account-info">
                        <div className="container-md">

                            <div className="card text-center">
                                <div className="card-header">
                                    COMMANDE N° {command._id}
                                </div>
                                <div className="card-body">
                                    <h3>Statut de la commande : {command.demande}</h3>
                                    <hr/>
                                    <div className="form-group">
                                        <p>Prenom: {command.prenom}</p>
                                        <p>Nom: {command.name}</p>
                                        <p>Email: {command.email}</p>
                                        <p>Tel: {command.telephone}</p>
                                    </div>
                                    <hr/>
                                    <p>Adresse de livraison: {command.adresse}</p>
                                    <hr/>
                                    <p>a livrer le {command.date}</p>
                                    <p>à {command.horaire} heures</p>

                                    <div className="form-group" style={{padding: 10, margin: 10}}>
                                        <button style={{padding: 10, margin: 10}}
                                                className="btn btn-success"
                                                onClick={() => this.commandValidate(command._id)}
                                        >Valider
                                        </button>

                                        <button style={{padding: 10, margin: 10}}
                                                className="btn btn-danger"
                                                onClick={() => this.commandCancelled(command._id)}
                                        >Refus
                                        </button>
                                    </div>

                                </div>
                                <div className="card-footer text-muted">
                                    commande crée le : {command.createdAt}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}


export default Dashboard

