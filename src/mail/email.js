const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')

// initialize nodemailer
var transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth:{
            user: 'adebola.rb.js@gmail.com',
            pass: 'password_for_your_email_address'
        }
    }
);

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('../../views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('../../views/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))


var mailOptions = {
    from: '"Naksa" <adebola.rb.js@gmail.com>', // sender address
    to: 'pmrk8707@gmail.com', // list of receivers
    subject: 'Welcome!',
    template: 'email', // the name of the template file i.e email.handlebars
    context:{
        name: "Adebola", // replace {{name}} with Adebola
        company: 'My Company' // replace {{company}} with My Company
    }
};

// trigger the sending of the E-mail
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});