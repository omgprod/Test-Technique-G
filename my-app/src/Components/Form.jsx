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
        };
        this.handleChangePrenom = this.handleChangePrenom.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeAdresse = this.handleChangeAdresse.bind(this);
        this.handleChangeTel = this.handleChangeTel.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeHoraire = this.handleChangeHoraire.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(event) {
        var command = {
            prenom: this.state.prenom,
            name: this.state.name,
            email: this.state.email,
            adresse: this.state.adresse,
            telephone: this.state.telephone,
            date: this.state.date,
            horaire: this.state.horaire,
        }

        axios.post("http://localhost:8000/new", command
        ).then(data => {
            if (data.status === 200) {
                alert('Command sent');
                window.location.reload();
            } else {
                alert('an error occured');
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
                    <form className="account-info" style={{backgroundColor: '#68a3c0'}} onSubmit={this.handleSubmit}>
                        <div className="container"  style={{textAlign:'center'}}>
                            <h2>Informations personnelles</h2>
                            <div className="card text-center">
                                <div className="card-header">
                                    Bon de commande
                                </div>
                                <div className="card-body">

                                    <div className="form-group">
                                        <label htmlFor="firstname">Prenom*<span></span> :</label>
                                        <input id="firstname" name="firstname" type="text"
                                               onChange={this.handleChangePrenom}
                                               value={this.state.prenom} required
                                               minLength={3}
                                               maxLength={20}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="name">Nom*<span></span> :</label>
                                        <input id="name" name="name" type="text"
                                               onChange={this.handleChangeName}
                                               value={this.state.value} required
                                               minLength={3}
                                               maxLength={20}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="tel">Télephone*<span></span> :</label>
                                        <input id="tel" name="tel" type="text" placeholder="+33 .."
                                               onChange={this.handleChangeTel}
                                               value={this.state.telephone} required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email*<span></span> :</label>
                                        <input id="email" name="email" type="text"
                                               onChange={this.handleChangeEmail}
                                               value={this.state.email} required

                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Adresse*<span></span> :</label>
                                        <input id="adresse" name="adresse" type="text"
                                               onChange={this.handleChangeAdresse}
                                               value={this.state.adresse} required
                                        />
                                    </div>


                                    <div className="form-group">
                                        <label htmlFor="age">Date de livraison*<span></span> :</label>
                                        <input id="date" name="date" type="date" placeholder="1997-02-22"
                                               onChange={this.handleChangeDate}
                                               value={this.state.age} required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="horaire">Horaire</label>
                                        <input id="heure" name="heure" type="number" placeholder="18 heures"
                                               onChange={this.handleChangeHoraire}
                                               value={this.state.horaire}
                                               aria-valuemax={2}
                                               min="1" max="24"
                                               required
                                        />
                                    </div>

                                    <button className="btn btn-primary" type="submit">Envoyer</button>
                                </div>
                                <div className="card-footer text-muted">
                                    <span>Champs obligatoires marqué par *</span>
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