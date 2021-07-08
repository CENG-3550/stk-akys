import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

class EditNeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            need: '',
            user: ''
        }
    }

    delNeed(id) {

        const Tubu = require("@tubu/tubuio-sdk-node")
        const app = new Tubu('174c7b93-3792-4a66-bd95-fccd73a120d3')
        const contract = app.contract('67c30c7a86be4e60')

        // New tubuio connection
        contract.send('cancelNeed', { args: [id] })
            .then((response) => {
                const transaction = response.data;
                console.log(transaction);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    async getUserData() {
        const url = '/api/getUser';
        fetch(url)
            .then((response) => response.json())
            .then((data) => this.setState({ user: data.user }))
    }

    componentDidMount() {

        const Tubu = require("@tubu/tubuio-sdk-node")
        const app = new Tubu('174c7b93-3792-4a66-bd95-fccd73a120d3')
        const contract = app.contract('67c30c7a86be4e60')

        // New tubuio connection
        contract.call('showNeed', { args: [this.state.id] })
            .then(async (response) => {
                const result = response.data;
                this.setState({ need: result })
                await this.getUserData()
            })
            .catch((err) => {
                console.log(err);
            })

    }

    handleSubmit(id) {
        return event => {
            event.preventDefault()

            //New tubuio connection
            const Tubu = require("@tubu/tubuio-sdk-node")
            const app = new Tubu('174c7b93-3792-4a66-bd95-fccd73a120d3')
            const contract = app.contract('67c30c7a86be4e60')

            // New tubuio connection
            contract.send('approveNeed', { args: [id] })
                .then((response) => {
                    const transaction = response.data;
                    console.log(transaction);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    render() {
        let need = this.state.need;
        let user = this.state.user;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 mt-3 mx-auto ">
                        <form onSubmit={this.handleSubmit(need[0])} method="POST" className="text-center border border-light p-5 rounded bg-blue">
                            <p className="h1 mb-4">İhtiyaç Formu</p>
                            <div className="row">
                                <div className="col-lg-6 mt-3">
                                    <p className="m-0 p-0">ID</p>
                                    <input type="text" name="id" placeholder="Name*" required="true" value={need[0]} readonly="true" className="form-control mb-4"></input>
                                    <p className="m-0 p-0">Kişisel Veri Hash Değeri</p>
                                    <input type="text" name="datahash" placeholder="Surname*" required="true" value={need[1]} readonly="true" className="form-control mb-4"></input>
                                    <p className="m-0 p-0">İhtiyaç Tipi</p>
                                    <input type="text" name="needType" placeholder="Need Type*" required="true" value={need[2]} readonly="true" className="form-control mb-4"></input>
                                    <p className="m-0 p-0">Miktar</p>
                                    <input type="number" name="amount" placeholder="Amount*" required="true" value={need[3]} readonly="true" className="form-control mb-4"></input>
                                </div>
                                <div className="col-lg-6 mt-3">
                                    <p className="m-0 p-0">Onaylayan İsim Soyisim</p>
                                    <input type="text" name="NameSurname" placeholder="" required="true" value={user.firstname + " " + user.lastname} readonly="true" className="form-control mb-4"></input>
                                    <input type="text" name="confirmName" placeholder="" required="true" value={user.firstname} readonly="true" className="form-control mb-4 d-none"></input>
                                    <input type="text" name="confirmSurname" placeholder="" required="true" value={user.lastname} readonly="true" className="form-control mb-4 d-none"></input>
                                    <p className="m-0 p-0">Onaylayan STK</p>
                                    <input type="text" name="confirmSTK" placeholder="" required="true" value={user.stk} readonly="true" className="form-control mb-4"></input>
                                    <p className="m-0 p-0">Aciliyet Durumu*</p>
                                    <select name="urgency" required="true" className="browser-default custom-select mb-4">
                                        <option selected className="d-none"></option>
                                        <option value="Yüksek">Yüksek</option>
                                        <option value="Normal">Normal</option>
                                        <option value="Düşük">Düşük</option>
                                    </select>
                                    <p className="m-0 p-0">Durum*</p>
                                    <select name="status" required="true" className="browser-default custom-select mb-4">
                                        <option selected className="d-none"></option>
                                        <option value="Onaylandı">Onaylandı</option>
                                        <option value="Ulaşım Aşaması">Ulaşım Aşaması</option>
                                        <option value="Kullanımda">Kullanımda</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success btn-block mt-3 w-50 mx-auto">Onayla</button>
                        </form>
                        <a onClick={() => { this.delNeed(need[0]) }} className="btn btn-danger btn-block mt-3 w-50 mx-auto">Sil</a>
                    </div>
                </div>
            </div>
        )
    };
}

export default EditNeed;