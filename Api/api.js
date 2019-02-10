/**************************************
 *******  CONFIG & DEPEDENCIES  *******
 *************************************/

/**** Listening on port ****/
const port = 8000;
const ip = "localhost";

/**** MongoDB URL ****/
const mongoDB = 'mongodb://127.0.0.1:27017/Technique';

/**** Const & Require ****/
const cors = require('cors');
const hash = require('bcrypt');
const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const Commands = require("./Schema/Commands");
const Validate = require("./Schema/Treat");
const bodyParser = require("body-parser");
const nodeMailer = require('nodemailer');
const app = express();

/**** Loading CORS Dep, Body-Parser Dep ****/
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.enable('trust proxy');


/**** Connection to MongoDB + Node Promise ****/
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, {useNewUrlParser: true})
    .then(() => console.log('MongoDB = CONNECTED.'))
    .catch((err) => console.error(err));


/**************************************
 ***********  MAIN API ****************
 *************************************/

/**** CONSOLE LOG MOST INFOS FROM REQUEST ****/
app.use(function timeLog(req, res, next) {
    var utc = new Date();
    console.log(
        '*------------------------*' +
        '\n*  Time: ', utc.toLocaleTimeString() +
        '\n*  Function: ' + req.method +
        '\n*  URL: ' + req.originalUrl +
        '\n*  IP Client: ' + req.ip +
        '\n*------------------------*'
    );
    next();
});

/**** TEST ****/
app.get('/', (req, res) => {
    res.render('index');
});

/**** NEW COMMAND ****/
app.post('/new', (req, res) => {
    var command = new Commands({
        prenom: req.body.prenom,
        name: req.body.name,
        email: req.body.email,
        adresse: req.body.adresse,
        telephone: req.body.telephone,
        date: req.body.date,
        horaire: req.body.horaire,
    });
    command.save(function (error) {
        if (error) {
            return res.status(400).send({
                Success: false,
                Message: 'une erreur est survenue.',
                Error: error,
            });
        } else {
            return res.status(200).send({
                Success: true,
                Method: req.method,
                Message: 'commande créé',
                command

            });
        }
    });
});

/**** GET ALL COMMANDS ****/
app.get('/fetch', (req, res) => {
    Commands.find({}, function (err, commands) {
        if (err) {
            throw err
        } else {
            return res.status(200).send(
                commands
            );
        }
    });
});

/**** GET ONE COMMAND ****/
app.get('/command/:id', (req, res) => {
    Commands.findById(req.params.id, function (err, command) {
        if (err) {
            throw err
        } else {
            res.status(200).send(
                command
            );
        }
    });
});

/**** TREAT COMMAND CANCEL ****/
app.post('/treat/1', (req, res) => {
    Commands.findById(req.body.id, function (err, command) {
        if (command.length != 0) {
            var treatment = new Validate({
                _treatment: command._id,
                Analyse: 1
            });
            treatment.save(function (error) {
                if (error) return handleError(error);
            });
            console.log('find and update ' + req.body.id)
            Commands.findOneAndUpdate({_id: command.id}, {
                demande: "refus",
            })
                .exec()
                .then(validCommand => {
                    /*** EMAIL ***/
                    let transporter = nodeMailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'testbrianhagg@gmail.com',
                            pass: 'Azerty9100'
                        },
                        debug: true
                    });
                    transporter.on('log', console.log);
                    let mailOptions = {
                        from: '"Customer Service" <xx@gmail.com>',
                        to: command.email,
                        subject: command._id,
                        text: "Refus",
                        html: "<b>Votre Commande a était refusé. contacter le service pour plus d'information</b>"
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                    });
                    /*** ***/
                    return res.status(200).send({
                        Success: true,
                        message: "Commande refusé",
                        validCommand
                    })
                }).catch(errror => {
                return res.status(400).send({
                    Success: false,
                    Message: {
                        errror
                    }
                })
            });
        }
    });
});

/**** TREAT COMMAND VALIDE ****/
app.post('/treat/0', (req, res) => {
    Commands.findById(req.body.id, function (err, command) {
        if (err) return handleError(err);
        if (command.length != 0) {
            var treatment = new Validate({
                _treatment: command._id,
                Analyse: 0
            });
            treatment.save(function (er) {
                if (er) return handleError(er);
            });
            Commands.findOneAndUpdate({_id: command.id}, {
                demande: "validé",
            })
                .exec()
                .then(validCommand => {
                    let transporter = nodeMailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'testbrianhagg@gmail.com',
                            pass: 'Azerty9100'
                        },
                        debug: true
                    })
                    let mailOptions = {
                        from: '"Customer Service" <xx@gmail.com>',
                        to: command.email,
                        subject: command._id,
                        text: "validé",
                        html: '<p>Chère ' + command.name + '</p>' +
                            '<b>Votre Commande N° ' + command._id + ' a bien était validé.</b>' +
                            '<p>L équipe fait son maximum pour vous livrer le </p>' + command.date
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        } else {
                            return res.status(200).send({
                                Success: true,
                                message: "Commande confirmé",
                                validCommand
                            })
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                        transporter.on('log', console.log);
                    });
                }).catch(e => {
                return res.status(400).send({
                    Success: false,
                    Message: {
                        e
                    }
                })
            });
        }
    });
});

/**** Port Listenner ****/
app.listen(port, ip, () => {
    console.log("Server = http://" + ip + ":" + port);
});

/**** Copyright ****/
console.log('..:: OMG-PROD 2019 ::..');
console.log('..:: NODE--EXPRESS ::..');