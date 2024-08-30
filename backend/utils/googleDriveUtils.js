import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service_account.json');

async function authenticate() {
    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_FILE,
        scopes: SCOPES,
    });

    const authClient = await auth.getClient();
    return google.drive({ version: 'v3', auth: authClient });
}

async function createFolder(folderName, parentFolderId) {
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

        const folderId = response.data.id;
        const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

        console.log(`Folder created successfully, Folder URL: ${folderUrl}`);
        return folderUrl;
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

// Fungsi untuk membuat shortcut
async function createShortcut(targetFileURL, parentFolderId) {
    const drive = await authenticate();
    const targetFileId = extractFolderIdFromUrl(targetFileURL);

    if (!targetFileId) {
        console.error('Invalid target file URL:', targetFileURL);
        throw new Error('Invalid target file URL');
    }

    // Retrieve the name of the target file
    let targetFileName;
    try {
        const fileResponse = await drive.files.get({
            fileId: targetFileId,
            fields: 'name',
        });
        targetFileName = fileResponse.data.name;
    } catch (error) {
        console.error('Error retrieving target file name:', error);
        throw error;
    }

    // Create shortcut metadata
    const shortcutMetadata = {
        name: targetFileName,
        mimeType: 'application/vnd.google-apps.shortcut',
        parents: [parentFolderId],
        shortcutDetails: {
            targetId: targetFileId,
        },
    };

    try {
        const response = await drive.files.create({
            resource: shortcutMetadata,
            fields: 'id',
        });

        console.log(`Shortcut created successfully, Shortcut ID: ${response.data.id}`);
        return response.data.id;
    } catch (error) {
        console.error('Error creating shortcut:', error);
        throw error;
    }
}

/**
 * Extracts the folder ID from a Google Drive folder link.
 * @param {string} url - The Google Drive folder URL.
 * @returns {string|null} - The folder ID if found, otherwise null.
 */
function extractFolderIdFromUrl(url) {
    // Define a regex to match Google Drive folder IDs from various URL formats
    const regex = /\/folders\/([a-zA-Z0-9_-]+)|\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/;
    const match = url.match(regex);
    return match ? (match[1] || match[2]) : null;
}

export { createFolder, uploadFile, createShortcut, extractFolderIdFromUrl };
