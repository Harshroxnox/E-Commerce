import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';


export const seedAdmin = async (db) => {
    try {        
        const [existingSuperAdmin] = await db.execute(`SELECT * FROM AdminRoles WHERE role_name = 'superadmin' LIMIT 1`);
        if (existingSuperAdmin.length > 0) {
            logger.info(`SuperAdmin already exists`);
            return;
        }

        // We need to create the SuperAdmin User
        // Env credentials
        let email = process.env.DEFAULT_ADMIN_EMAIL;
        let password = process.env.DEFAULT_ADMIN_PASSWORD;


        // only one of email and pass exist in .env
        if (!email ^ !password) 
            throw new Error('Incomplete SuperAdmin env variables');

        // both do not exist
        if(!email){
            email = 'admin@gmail.com';
            password = 'Admin@16';
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserting SuperAdmin User
        const [result] = await db.execute(
            "INSERT INTO AdminUsers (email, password) VALUES (?, ?)",
            [ email, hashedPassword ]
        );
        
        const adminID = result.insertId;

        // Make that AdminUser SuperAdmin
        await db.execute(
            "INSERT INTO AdminRoles (adminID, role_name) VALUES (?, ?)",
            [ adminID, 'superadmin' ]
        );

        logger.info(`SuperAdmin successfully created!`);

    } catch (error) {
        // Log the actual error for debugging
        logger.error(error?.message || error);
    }
}