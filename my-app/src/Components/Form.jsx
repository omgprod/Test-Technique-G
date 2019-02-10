import React, {Component} from 'react';
import axios from 'axios';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prenom: "",
            nom: "",
            adresse: "",
            telephone: "",
            email: "",
            date: "",
            horaire: "",
            code: 0,
            pays: "",
            alert: 0,
        };
        this.handleChangePrenom = this.handleChangePrenom.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeAdresse = this.handleChangeAdresse.bind(this);
        this.handleChangeTel = this.handleChangeTel.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeHoraire = this.handleChangeHoraire.bind(this);
        this.handleChangeCP = this.handleChangeCP.bind(this);
        this.handleChangePays = this.handleChangePays.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.setState({alert: 0});
    }

    handleChangePrenom(event) {
        this.setState({
            prenom: event.target.value,
        });
    }

    handleChangeName(event) {
        this.setState({
            name: event.target.value,
        });
    }

    handleChangeEmail(event) {
        this.setState({
            email: event.target.value,
        });
    }

    handleChangeAdresse(event) {
        this.setState({
            adresse: event.target.value,
        });
    }

    handleChangeDate(event) {
        this.setState({
            date: event.target.value,
        });
    }

    handleChangeTel(event) {
        this.setState({
            telephone: event.target.value,
        });
    }

    handleChangeHoraire(event) {
        this.setState({
            horaire: event.target.value,
        });
    }

    handleChangeCP(event) {
        this.setState({
            code: event.target.value,
        });
    }

    handleChangePays(event) {
        this.setState({
            pays: event.target.value,
        });
    }

    handleSubmit(event) {
        var command = {
            prenom: this.state.prenom,
            name: this.state.name,
            email: this.state.email,
            adresse: this.state.adresse,
            telephone: this.state.telephone,
            date: this.state.date,
            horaire: this.state.horaire,
            postal: this.state.code,
            pays: this.state.pays,
        }

        axios.post("http://localhost:8000/new", command
        ).then(data => {
            if (data.status === 200) {
                this.setState({alert: 1});
                setTimeout(function() {
                    window.location.reload();
                }, 3000);
            } else {
                this.setState({alert: 2});
                setTimeout(function() {
                    alert('an error occured');
                }, 3000);
            }
        }).catch(error => {
            alert(error);
        });
        event.preventDefault();
    }

    render() {
        return (
            <React.Fragment>
                <div className="account-first-section">
                    <form className="account-info" onSubmit={this.handleSubmit}>
                        <div className="container"  style={{textAlign:'center'}}>
                            <h2>Informations personnelles</h2>

                            {this.state.alert == 1 ?
                                <div id="succes-alert" className="alert alert-success" role="alert">
                                    Votre bon de commande vas bientot être pris en compte par nos service.
                                </div>
                            :null}
                            {this.state.alert == 2 ?
                                <div id="error-alert" className="alert alert-danger" role="alert">
                                    Une Erreur est survenue, vérifier vos champs saisie.
                                </div>
                            :null}

                            <div className="card text-center">
                                <div className="card-header">
                                    Bon de commande
                                </div>
                                <div className="card-body">


                                    <div className="form-row">
                                        <div className="col">
                                            <label htmlFor="firstname"><strong>Prenom</strong><span style={{color :'red'}}>*</span> :</label>
                                            <input id="firstname" name="firstname" type="text"
                                                   onChange={this.handleChangePrenom}
                                                   value={this.state.prenom} required
                                                   minLength={3}
                                                   maxLength={20}
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="name"><strong>Nom</strong><span style={{color :'red'}}>*</span> :</label>
                                            <input id="name" name="name" type="text"
                                                   onChange={this.handleChangeName}
                                                   value={this.state.value} required
                                                   minLength={3}
                                                   maxLength={20}
                                            />
                                        </div>
                                    </div>


                                    <div className="form-row">
                                        <div className="col">
                                            <label htmlFor="tel"><strong>Télephone</strong><span style={{color :'red'}}>*</span> :</label>
                                            <input id="tel" name="tel" type="text" placeholder="+33 .."
                                                   onChange={this.handleChangeTel}
                                                   value={this.state.telephone} required
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="email"><strong>Email</strong><span style={{color :'red'}}>*</span> :</label>
                                            <input id="email" name="email" type="text"
                                                   onChange={this.handleChangeEmail}
                                                   value={this.state.email} required

                                            />
                                        </div>
                                    </div>
                                    <hr/>

                                    <div className="form-group">
                                        <label htmlFor="adresse"><strong>Adresse</strong><span style={{color :'red'}}>*</span> :</label>
                                        <input id="adresse" name="adresse" type="text"
                                               onChange={this.handleChangeAdresse}
                                               value={this.state.adresse} required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="col">
                                            <label htmlFor="postal"><strong>Code Postal</strong><span style={{color :'red'}}>*</span> :</label>
                                            <input id="postal" name="postal" type="number"
                                                   onChange={this.handleChangeCP}
                                                   value={this.state.code} required
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="pays"><strong>Pays</strong><span style={{color :'red'}}>*</span> :</label>
                                            <input id="pays" name="pays" type="text"
                                                onChange={this.handleChangePays}
                                                   placeholder="France"
                                                   value={this.state.pays} required
                                            />
                                        </div>
                                    </div>

                                    <hr/>

                                    <div className="form-row">
                                        <div className="col">
                                            <label htmlFor="date"><strong>Date de livraison</strong><span style={{color :'red'}}>*</span> :</label>
                                            <input id="date" name="date" type="date" placeholder="1997-02-22"
                                                   onChange={this.handleChangeDate}
                                                   value={this.state.date} required
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="horaire"><strong>Horaire de livraison souhaité</strong>:</label>
                                            <input id="heure" name="heure" type="number" placeholder="18 heures"
                                                   onChange={this.handleChangeHoraire}
                                                   value={this.state.horaire}
                                                   min="1" max="24"
                                                   required
                                            />

                                        </div>
                                    </div>

                                    <div className="form-group">

                                    </div>

                                    <button className="btn btn-primary" type="submit">Envoyer</button>
                                </div>
                                <div className="card-footer text-muted">
                                    <span>Champs obligatoires marqués par <span style={{color :'red'}}>*</span></span>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        )
    };
}

export default Form