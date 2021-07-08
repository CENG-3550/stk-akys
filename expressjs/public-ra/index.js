const Tubu = require("@tubu/tubuio-sdk-node")
const app = new Tubu('174c7b93-3792-4a66-bd95-fccd73a120d3')
const contract = app.contract('67c30c7a86be4e60')

contract.send('approveNeed', {args: ['1625057410533']})
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    })