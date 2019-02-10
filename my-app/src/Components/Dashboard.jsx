import React, {Component} from 'react';
import axios from 'axios';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: 0,
            Data: [],
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    /*** FetchData onLoad ***/
    async getData() {
        await axios.get(`http://localhost:8000/fetch`)
            .then(data => {
                if (data.status === 200) {
                    this.setState({Data: data.data});
                } else if (data.status === 400) {
                    alert('An error occured on fetching data');
                }
            }).catch((err) => {
            console.log(err);
        });
    };

    handleClick(id) {
        localStorage.setItem('id', id);
        console.log(localStorage.getItem('id'));
        this.props.history.push('/treat');
    }

    render() {
        const command = this.state.Data;
        return (
            <React.Fragment>
                <div className="account-first-section">
                        <div className="container-responsive-lg" style={{textAlign: 'center'}}>
                            <h2>Dashboard</h2>
                            <table className="table table-responsive-lg table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Id</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Code Postal</th>
                                    <th scope="col">Pays</th>
                                    <th scope="col">Telephone</th>
                                    <th scope="col">Date de livraison</th>
                                    <th scope="col">Horaire de livraison</th>
                                    <th scope="col">Situation</th>
                                    <th scope="col">Traitement</th>
                                </tr>
                                </thead>

                                <tbody>
                                {command.map((item, i) => {
                                    return [
                                        <tr>
                                            <th scope="row">{i}</th>
                                            <td>{item._id}</td>
                                            <td>{item.prenom}</td>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.adresse}</td>
                                            <td>{item.postal}</td>
                                            <td>{item.pays}</td>
                                            <td>{item.telephone}</td>
                                            <td>{item.date}</td>
                                            <td>{item.horaire}</td>
                                            <td>
                                                {item.demande === "validé" ?
                                                <span style={{color: "green"}}>{item.demande}</span>
                                                :null}
                                                {item.demande === "refus" ?
                                                    <span style={{color: "red"}}>{item.demande}</span>
                                                    :null}
                                                {item.demande === "EN COURS DE TRAITEMENT" ?
                                                    <span>{item.demande}</span>
                                                    :null}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => this.handleClick(item._id)}>
                                                    <i className="fas fa-wrench" style={{color: 'white'}}></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ]
                                })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
            </React.Fragment>
        );
    }
}


export default Dashboard

