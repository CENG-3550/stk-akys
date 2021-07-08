import React from "react";
import hand from '../public/images/hand2.png';
import axios from 'axios';
import { useState } from 'react';
import CryptoJS from 'crypto-js';

function NeedForm() {

    const [count, setCount] = useState(0);
    const SECRET = 'MY SECRET KEYYY'

    async function submitNeed(event) {
        event.preventDefault()
        let personalData = { name: '', surname: '', urgency: '', expUr: '', phone: '', address: '' };

        let needType = event.target.elements.needType.value
        let amount = parseInt(event.target.elements.amount.value)
        personalData.name = event.target.elements.name.value
        personalData.surname = event.target.elements.surname.value
        personalData.urgency = event.target.elements.urgency.value
        personalData.expUr = event.target.elements.expUr.value
        personalData.phone = event.target.elements.phone.value
        personalData.address = event.target.elements.address.value

        let text = JSON.stringify(personalData)
        let b64 = CryptoJS.AES.encrypt(text, SECRET).toString();
        let e64 = await CryptoJS.enc.Base64.parse(b64);
        let eHex = await e64.toString(CryptoJS.enc.Hex);
        let hashValue = eHex

        const createHash = async () => {
            axios.post('/api/create-datahash', {
                params: {
                    hashValue: hashValue,
                    operationId: count.toString()
                }
            });
        }

        console.log(count.toString())

        const Tubu = require("@tubu/tubuio-sdk-node")
        const app = new Tubu('174c7b93-3792-4a66-bd95-fccd73a120d3')
        const contract = app.contract('67c30c7a86be4e60')

        // New tubuio connection
        contract.send('createNeed', { args: [count.toString(), hashValue, needType, amount], account: '0xf5A266C7f90973f85e8ef8b23eBa1C46a8Bb3348' })
            .then(async (result) => {
                console.log(result);
                await createHash();
            })
            .catch((err) => {
                console.log(err);
            })

    }

    return (
        <div className="col-lg-6 mt-3">
            <form onSubmit={submitNeed} method="POST" className="text-center border border-light p-5 rounded bg-blue">
                <img src={hand} className="mb-4"></img>
                <p className="h1 mb-4">İhtiyaç Talebi</p>
                <input type="text" name="name" placeholder="İsim*" required className="form-control mb-4"></input>
                <input type="text" name="surname" placeholder="Soyisim*" required className="form-control mb-4"></input>
                <select name="needType" className="browser-default custom-select mb-4" required>
                    <option className="d-none" defaultValue>İhtiyaç Tipi*</option>
                    <option value="Maddi Destek" >Maddi Destek</option>
                    <option value="Taşıma" >Taşıma</option>
                    <option value="Eşya" >Eşya</option>
                    <option value="Konaklama" >Konaklama</option>
                </select>
                <input type="number" name="amount" placeholder="Miktar*" required className="form-control mb-4"></input>
                <select name="urgency" className="browser-default custom-select mb-4">
                    <option className="d-none" defaultValue>Aciliyet*</option>
                    <option value="Yüksek" >Yüksek</option>
                    <option value="Normal" >Normal</option>
                    <option value="Düşük" >Düşük</option>
                </select>
                <input type="text" name="expUr" placeholder="Aciliyet için kısa açıklama*" required className="form-control mb-4"></input>
                <input type="number" name="phone" placeholder="Telefon*" required className="form-control mb-4"></input>
                <input type="text" name="address" placeholder="Adres*" required className="form-control mb-4"></input>
                <button onClick={() => setCount(new Date().valueOf())} type="submit" className="btn bg-dblue btn-block mt-3 c-white" >Gönder</button>
            </form>
        </div>
    )
}

export default NeedForm;