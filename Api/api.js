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
        postal: req.body.postal,
        pays: req.body.pays,
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
    Commands.find({})
        .sort([['createdAt', -1]])
        .exec(function (err, commands) {
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
    console.log(req.body.raison)
    Commands.findById(req.body.id, function (err, command) {
        if (command.length != 0) {
            var treatment = new Validate({
                _treatment: command._id,
                Analyse: 1,
                raison: req.body.raison
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
                    let mailOptions = {
                        from: '"Customer Service" <Hagg@gmail.com>',
                        to: command.email,
                        subject: command._id,
                        text: "Refus",
                        html: `
<style>
body {
    margin: 0;
    padding: 0;
    mso-line-height-rule: exactly;
    min-width: 100%;
}

.wrapper {
    display: table;
    table-layout: fixed;
    width: 100%;
    min-width: 620px;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
}

body, .wrapper {
    background-color: #ffffff;
}

/* Basic */
table {
    border-collapse: collapse;
    border-spacing: 0;
}
table.center {
    margin: 0 auto;
    width: 602px;
}
td {
    padding: 0;
    vertical-align: top;
}

.spacer,
.border {
    font-size: 1px;
    line-height: 1px;
}
.spacer {
    width: 100%;
    line-height: 16px
}
.border {
    background-color: #e0e0e0;
    width: 1px;
}

.padded {
    padding: 0 24px;
}
img {
    border: 0;
    -ms-interpolation-mode: bicubic;
}
.image {
    font-size: 12px;
}
.image img {
    display: block;
}
strong, .strong {
    font-weight: 700;
}
h1,
h2,
h3,
p,
ol,
ul,
li {
    margin-top: 0;
}
ol,
ul,
li {
    padding-left: 0;
}

a {
    text-decoration: none;
    color: #616161;
}
.btn {
    background-color:#2196F3;
    border:1px solid #2196F3;
    border-radius:2px;
    color:#ffffff;
    display:inline-block;
    font-family:Roboto, Helvetica, sans-serif;
    font-size:14px;
    font-weight:400;
    line-height:36px;
    text-align:center;
    text-decoration:none;
    text-transform:uppercase;
    width:200px;
    height: 36px;
    padding: 0 8px;
    margin: 0;
    outline: 0;
    outline-offset: 0;
    -webkit-text-size-adjust:none;
    mso-hide:all;
}

/* Top panel */
.title {
    text-align: left;
}

.subject {
    text-align: right;
}

.title, .subject {
    width: 300px;
    padding: 8px 0;
    color: #616161;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
}

/* Header */
.logo {
    padding: 16px 0;
}

/* Logo */
.logo-image {

}

/* Main */
.main {
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);
    -moz-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);
}

/* Content */
.columns {
    margin: 0 auto;
    width: 600px;
    background-color: #ffffff;
    font-size: 14px;
}

.column {
    text-align: left;
    background-color: #ffffff;
    font-size: 14px;
}

.column-top {
    font-size: 24px;
    line-height: 24px;
}

.content {
    width: 100%;
}

.column-bottom {
    font-size: 8px;
    line-height: 8px;
}

.content h1 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #212121;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
}

.content p {
    margin-top: 0;
    margin-bottom: 16px;
    color: #212121;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
}
.content .caption {
    color: #616161;
    font-size: 12px;
    line-height: 20px;
}

/* Footer */
.signature, .subscription {
    vertical-align: bottom;
    width: 300px;
    padding-top: 8px;
    margin-bottom: 16px;
}

.signature {
    text-align: left;
}
.subscription {
    text-align: right;
}

.signature p, .subscription p {
    margin-top: 0;
    margin-bottom: 8px;
    color: #616161;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
}
</style>

<body class="wrapper">
    <table class="top-panel center" width="602" border="0" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
            <td class="title" width="300">Gustave Company</td>
            <td class="subject" width="300"><a class="strong" href="https://www.mercigustave.co/" target="_blank">Gustave</a></td>
        </tr>
        <tr>
            <td class="border" colspan="2">&nbsp;</td>
        </tr>
        </tbody>
    </table>

    <div class="spacer">&nbsp;</div>
    <table class="main center" width="602" border="0" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
            <td class="column">
                <div class="column-top">&nbsp;</div>
                <table class="content" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                    <tr>
                        <td class="padded">
                          <h1>Chère  ${command.name} , ${command.prenom} </h1>
                          <p>Gustave vous remercie d'utiliser ses <strong>services</strong>.</p>
                          <p>pour la raison : ${req.body.raison}</p>
                          <p>Votre Commande N° <b>${command._id}</b> a malheureusement était réfusé par nos service.</p>
                          <p>Veuillez ré-itérer votre commande avec des horaires plus flexibles, ou un adresse valide</p>
                          <p>L équipe feras son maximum pour convenir a vos besoins </p>
                          <p style="text-align:center;"><a href="http://www.localhost:3000" class="btn">Refaire une commande</a></p>
                          <p style="text-align:center;">
                            <a href="https://www.mercigustave.co/" class="strong">Gustave</a>
                          </p>
                          <p class="caption">Nous sommes désolés pour la gène occasioné</p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="column-bottom">&nbsp;</div>
            </td>
        </tr>
        </tbody>
    </table>

    <div class="spacer">&nbsp;</div>

    <table class="footer center" width="602" border="0" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
            <td class="border" colspan="2">&nbsp;</td>
        </tr>
        <tr>
            <td class="signature" width="300">
                <p>
                    With best regards,<br>
                    Company Gustave<br>
                    +0 (000) 00-00-00, John Doe<br>
                    </p>
                <p>
                    Support: <a class="strong" href="mailto:brian.haggery@epitech.eu" target="_blank">support@gustave.co</a>
                </p>
            </td>
            <td class="subscription" width="300">
                <div class="logo-image">
                    <a href="https://zavoloklom.github.io/material-design-iconic-font/" target="_blank"><img src="https://zavoloklom.github.io/material-design-iconic-font/icons/mstile-70x70.png" alt="logo-alt" width="70" height="70"></a>
                </div>
                <p>
                    <a class="strong block" href="#" target="_blank">
                        Unsubscribe
                    </a>
                    <span class="hide">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    <a class="strong block" href="#" target="_blank">
                        Account Settings
                    </a>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
</body>`
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            return res.status(400).send({
                                Success: false,
                                Message: {
                                    errror
                                }
                            });
                            return;
                        } else {
                            console.log(info);
                            res.render('index').status(200).send({
                                Success: true,
                                message: "Commande refusé",
                                info
                            });
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                        transporter.on('log', console.log);
                        return;
                    });
                    /*** ***/
                }).catch(errror => {
                throw (errror);
            });
        }
    });
});

/**** TREAT COMMAND VALIDE ****/
app.post('/treat/0', (req, res) => {
    Commands.findById(req.body.id, function (err, command) {
        if (command.length != 0) {
            var treatment = new Validate({
                _treatment: command._id,
                Analyse: 0,
            });
            treatment.save(function (error) {
                if (error) return handleError(error);
            });
            console.log('find and update ' + req.body.id)
            Commands.findOneAndUpdate({_id: req.body.id}, {demande: "validé",})
                .exec()
                .then(commandfind => {
                    /*** EMAIL ***/
                    let transporter = nodeMailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'testbrianhagg@gmail.com',
                            pass: 'Azerty9100'
                        },
                        debug: true
                    });
                    let mailOptions = {
                        from: '"Customer Service" <Hagg@gmail.com>',
                        to: command.email,
                        subject: "Votre Commande.",
                        text: "validé",
                        html: `
                        <style>
body {
    margin: 0;
    padding: 0;
    mso-line-height-rule: exactly;
    min-width: 100%;
}

.wrapper {
    display: table;
    table-layout: fixed;
    width: 100%;
    min-width: 620px;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
}

body, .wrapper {
    background-color: #ffffff;
}

/* Basic */
table {
    border-collapse: collapse;
    border-spacing: 0;
}
table.center {
    margin: 0 auto;
    width: 602px;
}
td {
    padding: 0;
    vertical-align: top;
}

.spacer,
.border {
    font-size: 1px;
    line-height: 1px;
}
.spacer {
    width: 100%;
    line-height: 16px
}
.border {
    background-color: #e0e0e0;
    width: 1px;
}

.padded {
    padding: 0 24px;
}
img {
    border: 0;
    -ms-interpolation-mode: bicubic;
}
.image {
    font-size: 12px;
}
.image img {
    display: block;
}
strong, .strong {
    font-weight: 700;
}
h1,
h2,
h3,
p,
ol,
ul,
li {
    margin-top: 0;
}
ol,
ul,
li {
    padding-left: 0;
}

a {
    text-decoration: none;
    color: #616161;
}
.btn {
    background-color:#2196F3;
    border:1px solid #2196F3;
    border-radius:2px;
    color:#ffffff;
    display:inline-block;
    font-family:Roboto, Helvetica, sans-serif;
    font-size:14px;
    font-weight:400;
    line-height:36px;
    text-align:center;
    text-decoration:none;
    text-transform:uppercase;
    width:200px;
    height: 36px;
    padding: 0 8px;
    margin: 0;
    outline: 0;
    outline-offset: 0;
    -webkit-text-size-adjust:none;
    mso-hide:all;
}

/* Top panel */
.title {
    text-align: left;
}

.subject {
    text-align: right;
}

.title, .subject {
    width: 300px;
    padding: 8px 0;
    color: #616161;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
}

/* Header */
.logo {
    padding: 16px 0;
}

/* Logo */
.logo-image {

}

/* Main */
.main {
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);
    -moz-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);
}

/* Content */
.columns {
    margin: 0 auto;
    width: 600px;
    background-color: #ffffff;
    font-size: 14px;
}

.column {
    text-align: left;
    background-color: #ffffff;
    font-size: 14px;
}

.column-top {
    font-size: 24px;
    line-height: 24px;
}

.content {
    width: 100%;
}

.column-bottom {
    font-size: 8px;
    line-height: 8px;
}

.content h1 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #212121;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
}

.content p {
    margin-top: 0;
    margin-bottom: 16px;
    color: #212121;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
}
.content .caption {
    color: #616161;
    font-size: 12px;
    line-height: 20px;
}

/* Footer */
.signature, .subscription {
    vertical-align: bottom;
    width: 300px;
    padding-top: 8px;
    margin-bottom: 16px;
}

.signature {
    text-align: left;
}
.subscription {
    text-align: right;
}

.signature p, .subscription p {
    margin-top: 0;
    margin-bottom: 8px;
    color: #616161;
    font-family: Roboto, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
}
</style>

<body class="wrapper">
    <table class="top-panel center" width="602" border="0" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
            <td class="title" width="300">Gustave Company</td>
            <td class="subject" width="300"><a class="strong" href="https://www.mercigustave.co/" target="_blank">Gustave</a></td>
        </tr>
        <tr>
            <td class="border" colspan="2">&nbsp;</td>
        </tr>
        </tbody>
    </table>

    <div class="spacer">&nbsp;</div>
    <table class="main center" width="602" border="0" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
            <td class="column">
                <div class="column-top">&nbsp;</div>
                <table class="content" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                    <tr>
                        <td class="padded">
                          <h1>Chère  ${command.name} , ${command.prenom} </h1>
                          <p>Gustave vous remercie d'utiliser ses <strong> services</strong>.</p>
                          <p>Nous avons le plaisir de vous informer que</p>
                          <p>Votre Commande N° <b>${command._id}</b> a était prise en compte par nos service.</p>
                          <p>Nos serives font leur maximum pour vous livrer dans les délais indiqués ( ${command.date} )</p>
                          <p>L équipe feras son maximum pour convenir a vos besoins, ne pas hesiter à nous contacter pour toutes questions </p>
                          <p style="text-align:center;"><a href="http://www.localhost:3000" class="btn">Voir son compte</a></p>
                          <p style="text-align:center;">
                            <a href="https://www.mercigustave.co/" class="strong">Gustave</a>
                          </p>
                          <p class="caption">Le staff.</p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="column-bottom">&nbsp;</div>
            </td>
        </tr>
        </tbody>
    </table>

    <div class="spacer">&nbsp;</div>

    <table class="footer center" width="602" border="0" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
            <td class="border" colspan="2">&nbsp;</td>
        </tr>
        <tr>
            <td class="signature" width="300">
                <p>
                    With best regards,<br>
                    Company Gustave<br>
                    +0 (000) 00-00-00, John Doe<br>
                    </p>
                <p>
                    Support: <a class="strong" href="mailto:brian.haggery@epitech.eu" target="_blank">support@gustave.co</a>
                </p>
            </td>
            <td class="subscription" width="300">
                <div class="logo-image">
                    <a href="https://zavoloklom.github.io/material-design-iconic-font/" target="_blank"><img src="https://zavoloklom.github.io/material-design-iconic-font/icons/mstile-70x70.png" alt="logo-alt" width="70" height="70"></a>
                </div>
                <p>
                    <a class="strong block" href="#" target="_blank">
                        Unsubscribe
                    </a>
                    <span class="hide">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    <a class="strong block" href="#" target="_blank">
                        Account Settings
                    </a>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
</body>`};
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            return res.status(400).send({
                                Success: false,
                                Message: {
                                    errror
                                }
                            });
                            return;
                        } else {
                            console.log(info);
                            res.render('index').status(200).send({
                                Success: true,
                                message: "Commande validé",
                                info
                            });
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                        transporter.on('log', console.log);
                        return;
                    });
                    /*** ***/
                }).catch(errror => {
                throw (errror);
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