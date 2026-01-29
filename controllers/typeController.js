const { appDB } = require('../config/db');

// Public: Get all active problem types
exports.getAllTypes = async (req, res) => {
    try {
        const [rows] = await appDB.execute(
            'SELECT * FROM problem_types WHERE is_active = TRUE ORDER BY label ASC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Get all types error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des types.' });
    }
};

// Admin: Get all types (including inactive)
exports.getAdminTypes = async (req, res) => {
    try {
        const [rows] = await appDB.execute(
            'SELECT * FROM problem_types ORDER BY label ASC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Get admin types error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des types.' });
    }
};

// Admin: Create a new type
exports.createType = async (req, res) => {
    const { label } = req.body;
    if (!label) {
        return res.status(400).json({ message: 'Le libellé est requis.' });
    }

    try {
        await appDB.execute(
            'INSERT INTO problem_types (label, is_active) VALUES (?, TRUE)',
            [label]
        );
        res.status(201).json({ message: 'Type créé avec succès.' });
    } catch (error) {
        console.error('Create type error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Ce type existe déjà.' });
        }
        res.status(500).json({ message: 'Erreur lors de la création du type.' });
    }
};

// Admin: Update type (label or status)
exports.updateType = async (req, res) => {
    const { id } = req.params;
    const { label, is_active } = req.body;

    try {
        if (label !== undefined && is_active !== undefined) {
            await appDB.execute(
                'UPDATE problem_types SET label = ?, is_active = ? WHERE id = ?',
                [label, is_active, id]
            );
        } else if (label !== undefined) {
            await appDB.execute(
                'UPDATE problem_types SET label = ? WHERE id = ?',
                [label, id]
            );
        } else if (is_active !== undefined) {
            await appDB.execute(
                'UPDATE problem_types SET is_active = ? WHERE id = ?',
                [is_active, id]
            );
        }

        res.json({ message: 'Type mis à jour avec succès.' });
    } catch (error) {
        console.error('Update type error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Ce libellé existe déjà.' });
        }
        res.status(500).json({ message: 'Erreur lors de la mise à jour du type.' });
    }
};

// Admin: Delete type
exports.deleteType = async (req, res) => {
    const { id } = req.params;

    try {
        await appDB.execute('DELETE FROM problem_types WHERE id = ?', [id]);
        res.json({ message: 'Type supprimé avec succès.' });
    } catch (error) {
        console.error('Delete type error:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du type.' });
    }
};
