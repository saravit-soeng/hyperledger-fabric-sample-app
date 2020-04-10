
var tuna = require('./controller');

module.exports = (app) => {
    app.get('/get_tuna/:id', (req, res) => {
        tuna.get_tuna(req, res);
    });

    app.get('/add_tuna/:tuna', (req, res)=>{
        tuna.add_tuna(req, res);
    })
    app.get('/get_all_tuna', (req, res) => {
        tuna.get_all_tuna(req, res);
    });
    
    app.get('/change_holder/:holder', (req, res) => {
        tuna.change_holder(req, res);
    });
}