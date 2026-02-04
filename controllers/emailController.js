const { appDB } = require('../config/db');

exports.getRecipients = async (req, res) => {
    try {
        const [rows] = await appDB.execute('SELECT * FROM email_recipients ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching recipients:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des destinataires.' });
    }
};

exports.addRecipient = async (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res.status(400).json({ message: 'Email et nom sont requis.' });
    }

    try {
        await appDB.execute('INSERT INTO email_recipients (email, name) VALUES (?, ?)', [email, name]);
        res.status(201).json({ message: 'Destinataire ajouté avec succès.' });
    } catch (error) {
        console.error('Error adding recipient:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
        }
        res.status(500).json({ message: 'Erreur lors de l\'ajout du destinataire.' });
    }
};

exports.deleteRecipient = async (req, res) => {
    const { id } = req.params;

    try {
        await appDB.execute('DELETE FROM email_recipients WHERE id = ?', [id]);
        res.json({ message: 'Destinataire supprimé avec succès.' });
    } catch (error) {
        console.error('Error deleting recipient:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression.' });
    }
};
