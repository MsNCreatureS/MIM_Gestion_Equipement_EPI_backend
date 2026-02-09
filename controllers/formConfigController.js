const mysql = require('mysql2/promise');
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'MIM_Feedback'
};

// Helper to get DB connection
async function getConnection() {
    return await mysql.createConnection(dbConfig);
}

exports.getFormConfig = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM form_fields ORDER BY order_index ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching form config:', error);
        res.status(500).json({ message: 'Failed to fetch form configuration' });
    } finally {
        if (connection) await connection.end();
    }
};

exports.updateFormConfig = async (req, res) => {
    const { id } = req.params;
    const { label, is_visible, is_required } = req.body;
    let connection;

    try {
        connection = await getConnection();

        // Build query dynamically based on provided fields
        // Note: field_key should generally not be changed to break frontend logic
        const updates = [];
        const values = [];

        if (label !== undefined) {
            updates.push('label = ?');
            values.push(label);
        }
        if (is_visible !== undefined) {
            updates.push('is_visible = ?');
            values.push(is_visible);
        }
        if (is_required !== undefined) {
            updates.push('is_required = ?');
            values.push(is_required);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(id);
        const query = `UPDATE form_fields SET ${updates.join(', ')} WHERE id = ?`;

        await connection.query(query, values);
        res.json({ message: 'Field updated successfully' });

    } catch (error) {
        console.error('Error updating form config:', error);
        res.status(500).json({ message: 'Failed to update form configuration' });
    } finally {
        if (connection) await connection.end();
    }
};
