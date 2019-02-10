import React, {Component} from 'react';
import axios from 'axios';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Order: {},
            alert: 0,
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
                this.setState({alert: 1});
                console.log(data);
                window.location.reload();
            } else if (data.status === 400) {
                this.setState({alert: 2});
                window.location.reload();
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
                this.setState({alert: 3});
                console.log(data);
                window.location.reload();
            } else if (data.status === 400) {
                this.setState({alert: 2});
                window.location.reload();
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
                        <div className="container" style={{textAlign: 'center'}}>
                            <h2>Traitement</h2>

                            {this.state.alert == 1 ?
                                <div id="succes-alert" className="alert alert-success" role="alert">
                                    La commande a était validé, un mail as était envoyé avec succès.
                                </div>
                                : null}
                            {this.state.alert == 2 ?
                                <div id="error-alert" className="alert alert-danger" role="alert">
                                    Une Erreur est survenue.
                                </div>
                                : null}
                            {this.state.alert == 3 ?
                                <div id="succes-alert" className="alert alert-success" role="alert">
                                    La commande a était réfusé, un mail as était envoyé avec succès.
                                </div>
                                : null}


                            <div className="card text-center">
                                <div className="card-header">
                                    COMMANDE N° {command._id}
                                </div>
                                <div className="card-body">
                                    <h3>Statut de la commande : {command.demande}</h3>
                                    <hr/>
                                    <div className="form-row">
                                        <div className="col">
                                            <p><strong>Prénom: </strong>{command.prenom}</p>
                                        </div>
                                        <div className="col">
                                            <p><strong>E-mail: </strong>{command.email}</p>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col">
                                            <p><strong>Nom: </strong>{command.name}</p>
                                        </div>
                                        <div className="col">
                                            <p><strong>Téléphone: </strong>{command.telephone}</p>
                                        </div>
                                    </div>
                                    <hr/>

                                    <p><strong>Adresse de livraison: </strong><br/> {command.adresse}</p>
                                    <div className="form-row">
                                        <div className="col">
                                            <p><strong>Code Postal: </strong>{command.postal}</p>
                                        </div>
                                        <div className="col">
                                            <p><strong>Pays: </strong>{command.pays}</p>
                                        </div>
                                    </div>


                                    <hr/>
                                    <hr/>
                                    <p><strong>Date de  préférence de livraison : </strong>{command.date}</p>
                                    <p><strong>De préference à :</strong> {command.horaire} heures</p>

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
                                    <strong>Commande crée le :</strong> {command.createdAt}
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

