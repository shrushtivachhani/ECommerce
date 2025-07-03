const nodemailer = require('nodemailer');

const sendEmail = async (userEmail, productArray) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MY_MAIL,
            pass: process.env.EMAIL_PASS,
        }
    });

    const productDetails = productArray.map((product, index) => {
        return `Product ${index + 1}: ${product.name} - ₹${product.price} - Qty: ${product.quantity}`;
    });

    const mailOptions = {
        from: process.env.MY_MAIL,
        to: userEmail,
        subject: 'Your Order Details',
        text: `🛍️ Thank you for shopping with us!\n\nHere are your order details:\n\n${productDetails.join('\n\n')}\n\nWe hope you enjoy your purchase!`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully');
    } catch (err) {
        console.error('❌ Error sending email:', err);
    }
};

module.exports = sendEmail;
