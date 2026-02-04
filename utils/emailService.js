const nodemailer = require('nodemailer');
const path = require('path');
const { appDB } = require('../config/db');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendNewRequestEmail = async (data) => {
    const { id, societe, date, nom, prenom, lieu, type, description } = data;

    const logoPath = path.join(__dirname, '../assets/logo_MIM.png');
    const feedbackUrl = `https://information.mim-foselev.fr/admin/feedback/${id}`;

    // Fetch recipients from DB
    let recipients = [];
    try {
        const [rows] = await appDB.execute('SELECT email FROM email_recipients');
        recipients = rows.map(row => row.email);
    } catch (error) {
        console.error('Error fetching email recipients:', error);
        // Fallback to default if DB fails
        recipients = ['erwan.gimenez@foselev.fr'];
    }

    if (recipients.length === 0) {
        console.log('No email recipients configured.');
        return false;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Arial', sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
            .header { background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #f97316; }
            .header img { max-width: 120px; }
            .content { padding: 30px; background-color: #ffffff; }
            .h2 { color: #c2410c; margin-top: 0; font-size: 20px; border-left: 4px solid #f97316; padding-left: 10px; }
            .field { margin-bottom: 8px; font-size: 14px; }
            .label { font-weight: bold; color: #777; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { font-weight: 500; color: #333; }
            .description-box { background-color: #f8f8f8; padding: 15px; border-radius: 6px; border: 1px solid #eee; margin-top: 5px; color: #444; }
            .button-container { text-align: center; margin-top: 30px; }
            .button { background-color: #f97316; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }
            .footer { background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="cid:logo_mim" alt="MIM Logo">
            </div>
            <div class="content">
                <h2 class="h2">Nouveau Ticket Support (#${id})</h2>
                
                <div class="field">
                    <div class="label">Société/Agence</div>
                    <div class="value">${societe}</div>
                </div>
                <div class="field">
                    <div class="label">Date</div>
                    <div class="value">${date}</div>
                </div>
                <div class="field">
                    <div class="label">Créé par</div>
                    <div class="value">${prenom} ${nom}</div>
                </div>
                <div class="field">
                    <div class="label">Lieu/Client</div>
                    <div class="value">${lieu || 'Non spécifié'}</div>
                </div>
                 <div class="field">
                    <div class="label">Type de problème</div>
                    <div class="value">${type}</div>
                </div>
                
                <div class="field" style="margin-top: 20px;">
                    <div class="label">Description</div>
                    <div class="description-box">
                        ${description || 'Aucune description fournie.'}
                    </div>
                </div>

                <div class="button-container">
                    <a href="${feedbackUrl}" class="button">Voir la demande</a>
                </div>
            </div>
            <div class="footer">
                Notification automatique - MIM Gestion Équipement & EPI
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"MIM Support" <${process.env.EMAIL_USER}>`,
        to: recipients.join(', '),
        subject: `[MIM] Nouveau Ticket - ${societe} - ${type}`,
        html: htmlContent,
        attachments: [
            {
                filename: 'logo_MIM.png',
                path: logoPath,
                cid: 'logo_mim'
            }
        ]
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendNewRequestEmail };
