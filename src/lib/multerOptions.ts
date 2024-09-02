import { Request } from 'express';
import { extname } from 'path';

// Function to filter image files
export const imageFileFilter = (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    const allowedExtensions = /\.(jpg|jpeg|png)$/i;  // Use /i for case-insensitive matching
    if (!file.originalname.match(allowedExtensions)) {
        return callback(new Error("Only image files (jpg, jpeg, png) are allowed"), false);
    }
    callback(null, true);
};

// Function to edit file name to prevent overwriting and ensure unique file names
export const editFileName = (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
    const fileExtName = extname(file.originalname);  // Use extname from 'path' module for safer extension extraction
    const timeStamp = Date.now(); // Ensure unique filename using timestamp
    callback(null, `${timeStamp}${fileExtName}`);
};
