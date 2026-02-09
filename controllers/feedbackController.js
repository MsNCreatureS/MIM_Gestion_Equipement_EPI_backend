const { appDB } = require('../config/db');
const { sendNewRequestEmail } = require('../utils/emailService');

exports.submitFeedback = async (req, res) => {
    const { societe, date, nom, prenom, lieu, type, description, action } = req.body;

    // Basic validation
    if (!societe || !date || !nom || !prenom || !type) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires.' });
    }

    try {
        const query = `
            INSERT INTO remontees 
            (societe_agence, date, nom, prenom, lieu_client, type_probleme, description, causes, consequences, action, status, action_admin) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'En attente', '')
        `;

        const [result] = await appDB.execute(query, [
            societe,
            date,
            nom,
            prenom,
            lieu || '',
            type,
            description || '',
            req.body.causes || '',
            req.body.consequences || '',
            action || ''
        ]);

        const remonteeId = result.insertId;

        // Handle file uploads
        if (req.files && req.files.length > 0) {
            const fileValues = req.files.map(file => [
                remonteeId,
                file.path, // Store full path or relative path
                file.originalname,
                file.mimetype,
                file.size
            ]);

            // Construct bulk insert query
            const fileQuery = `
                INSERT INTO remontee_files (remontee_id, file_path, original_name, mime_type, file_size)
                VALUES ?
            `;

            // mysql2 requires a specific format for bulk inserts (array of arrays)
            // But verify if execute supports this or if query is needed. 'query' supports bulk, 'execute' prepared might not.
            // Safe approach: loop or use query. simpler to loop for prepared statement safety if needed, 
            // but mysql2 query method handles it.
            // Let's use loop for safety with 'execute' or constructed string.
            // Actually, let's just loop for now, 10 files max is small.
            for (const file of req.files) {
                await appDB.execute(
                    'INSERT INTO remontee_files (remontee_id, file_path, original_name, mime_type, file_size) VALUES (?, ?, ?, ?, ?)',
                    [remonteeId, file.path, file.originalname, file.mimetype, file.size]
                );
            }
        }

        // Send email notification asynchronously (could be updated to include attachments if needed)
        sendNewRequestEmail({ id: remonteeId, societe, date, nom, prenom, lieu, type, description, causes: req.body.causes, consequences: req.body.consequences })
            .then(success => {
                if (success) console.log('Notification email sent successfully');
                else console.warn('Failed to send notification email');
            })
            .catch(err => console.error('Error in email sending process:', err));

        res.status(201).json({ message: 'Remontée d\'information enregistrée avec succès.', id: remonteeId });

    } catch (error) {
        console.error('Submit feedback error:', error);
        const fs = require('fs');
        const logMessage = `[${new Date().toISOString()}] Error: ${error.message}\nStack: ${error.stack}\n\n`;
        // Ensure log file exists or just write
        try { fs.appendFileSync('backend_errors.log', logMessage); } catch (e) { }
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement.' });
    }

};

exports.getAllFeedback = async (req, res) => {
    try {
        const [rows] = await appDB.execute('SELECT * FROM remontees ORDER BY date DESC, created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Get all feedback error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des données.' });
    }
};

exports.getPublicFeedback = async (req, res) => {
    try {
        const [rows] = await appDB.execute('SELECT * FROM remontees ORDER BY date DESC, created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Get public feedback error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des données.' });
    }
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Le statut est requis.' });
    }

    try {
        await appDB.execute('UPDATE remontees SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Statut mis à jour vers ${status}` });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut.' });
    }
};

exports.updateAdminAction = async (req, res) => {
    const { id } = req.params;
    const { action_admin } = req.body;

    try {
        // Automatically set status to 'En cours' when an admin action is saved
        await appDB.execute("UPDATE remontees SET action_admin = ?, status = 'En cours' WHERE id = ?", [action_admin || '', id]);
        res.json({ message: 'Action admin mise à jour avec succès et statut passé à En cours.' });

    } catch (error) {
        console.error('Update admin action error:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'action.' });
    }
};

exports.deleteFeedback = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await appDB.execute('DELETE FROM remontees WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Remontée non trouvée.' });
        }

        res.json({ message: 'Remontée supprimée avec succès.' });
    } catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression.' });
    }
};


exports.getFeedbackById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await appDB.execute('SELECT * FROM remontees WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Remontée non trouvée.' });
        }

        const [files] = await appDB.execute('SELECT * FROM remontee_files WHERE remontee_id = ?', [id]);

        const feedback = rows[0];
        feedback.files = files;

        res.json(feedback);
    } catch (error) {
        console.error('Get feedback by id error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des données.' });
    }
};

