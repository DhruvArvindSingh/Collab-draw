import pkg from 'pg';
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the correct directory
const envPath = path.resolve(__dirname, '../../.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.log('Error loading .env file:', result.error);
}

const { Client } = pkg;

// Debug logging
console.log('Current directory:', __dirname);
console.log('Env variables after loading:', {
    CLIENT_LINK: process.env.CLIENT_LINK,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
});

// Ensure we have the required env variable
if (!process.env.CLIENT_LINK) {
    throw new Error('CLIENT_LINK is not defined in environment variables');
}

const client = new Client(process.env.CLIENT_LINK);

try {
    await client.connect();
    console.log("Connected to database successfully");

    await client.query(`CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(200),
        email VARCHAR(255),
        password VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`);
} catch (e) {
    console.error("Unable to connect to database:", e);
}

export default client;

