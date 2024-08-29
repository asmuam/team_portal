import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service_account.json');
const PARENT_FOLDER_ID = '1Z8lZlwxoSKnJBAyAooGA1yI3UbzA1ksZ';

async function authenticate() {
    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_FILE,
        scopes: SCOPES,
    });

    const authClient = await auth.getClient();
    return google.drive({ version: 'v3', auth: authClient });
}

async function createFolder(folderName, parentFolderId = PARENT_FOLDER_ID) {
    const drive = await authenticate();

    const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId],
    };

    try {
        const response = await drive.files.create({
            resource: fileMetadata,
            fields: 'id',
        });

        console.log(`Folder created successfully, Folder ID: ${response.data.id}`);
        return response.data.id;
    } catch (error) {
        console.error('Error creating folder:', error);
        throw error;
    }
}

async function uploadFile(filePath, fileName, folderId) {
    const drive = await authenticate();

    const fileMetadata = {
        name: fileName,
        parents: [folderId],
    };

    const media = {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(filePath),
    };

    try {
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        console.log(`File uploaded successfully, File ID: ${response.data.id}`);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

export { createFolder, uploadFile };
