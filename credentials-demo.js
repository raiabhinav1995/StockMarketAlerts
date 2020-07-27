const nodemailer=require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yourmail@gmail.com',
      pass: 'yourPassword'
    }
  });

const mailOptions = {
    from: 'youremail@domain.com',
    to: 'recepientemail@domain.com',
    subject: 'whatever heck the subject is ',
    text: 'whatever you wanna send'
  };


  exports.transporter=transporter;
  exports.mailOptions=mailOptions;
