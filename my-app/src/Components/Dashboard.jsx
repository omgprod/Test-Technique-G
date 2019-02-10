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
        axios.get(`http://localhost:8000/fetch`)
            .then(data => {
                if (data.status === 200) {
                    this.setState({Data: data.data});
                } else if (data.status === 400) {

                }
            }).catch((err) => {
            console.log(err);
        })
    };

    handleClick(id) {
        console.log('this is:' + id);
        localStorage.setItem('id', id);
        console.log(localStorage.getItem('id'));
        this.props.history.push('/treat');
    }

    render() {
        const command = this.state.Data;
        return (
            <React.Fragment>
                <div className="account-first-section">
                    <div className="account-info">
                        <div className="container-lg">
                            <h2>Dashboard</h2>
                            <div style={{maxWidth: '100%'}}>
                                <table className="table table-responsive-lg table-hover">
                                    <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Id</th>
                                        <th scope="col">Prénom</th>
                                        <th scope="col">Nom</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Adresse</th>
                                        <th scope="col">Telephone</th>
                                        <th scope="col">Livraison</th>
                                        <th scope="col">Horaire</th>
                                        <th scope="col">Traitement</th>
                                        <th scope="col">Traiter</th>
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
                                                <td>{item.telephone}</td>
                                                <td>{item.date}</td>
                                                <td>{item.horaire}</td>
                                                <td>{item.demande}</td>
                                                <td>
                                                    <button onClick={() => this.handleClick(item._id)}>
                                                        traiter la commande
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
                    </div>
                </div>

            </React.Fragment>
        );
    }
}



export default Dashboard

