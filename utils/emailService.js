const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendNewRequestEmail = async (data) => {
    const { societe, date, nom, prenom, lieu, type, description } = data;

    const logoPath = path.join(__dirname, '../assets/logo_MIM.png');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Arial', sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
            .header { background-color: #f97316; padding: 20px; text-align: center; }
            .header img { max-width: 150px; background-color: white; padding: 10px; border-radius: 4px; }
            .content { padding: 30px; background-color: #ffffff; }
            .h2 { color: #c2410c; margin-top: 0; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; color: #555; }
            .footer { background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e0e0e0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="cid:logo_mim" alt="MIM Logo">
            </div>
            <div class="content">
                <h2 class="h2">Nouvelle Remontée d'Information</h2>
                <p>Une nouvelle demande a été soumise via l'application.</p>
                
                <div class="field"><span class="label">Société/Agence:</span> ${societe}</div>
                <div class="field"><span class="label">Date:</span> ${date}</div>
                <div class="field"><span class="label">Demandeur:</span> ${prenom} ${nom}</div>
                <div class="field"><span class="label">Lieu/Client:</span> ${lieu || 'Non spécifié'}</div>
                <div class="field"><span class="label">Type de problème:</span> ${type}</div>
                
                <div class="field">
                    <div class="label">Description:</div>
                    <p style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #f97316; border-radius: 4px; margin-top: 5px;">
                        ${description || 'Aucune description fournie.'}
                    </p>
                </div>
            </div>
            <div class="footer">
                Ceci est un message automatique envoyé depuis l'application MIM Gestion Équipement & EPI.
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"MIM Notification" <${process.env.EMAIL_USER}>`,
        to: 'erwan.gimenez@foselev.fr',
        subject: `[MIM] Nouvelle Remontée - ${societe} - ${type}`,
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
