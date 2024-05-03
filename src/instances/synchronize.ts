import { sequelize } from "./sequelize";

async function main() {
    try {
        // Sync the models with the database (create tables if not exists)
        await sequelize.sync({ force: true });
                console.log('All models were synchronized successfully.');
        
        // Start your application logic here
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }
}

main();