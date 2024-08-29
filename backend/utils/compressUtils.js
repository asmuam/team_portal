import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import path from 'path';

async function compressImage(filePath) {
    const files = await imagemin([filePath], {
        destination: path.dirname(filePath),
        plugins: [
            imageminMozjpeg({ quality: 75 }),
            imageminPngquant({ quality: [0.6, 0.8] })
        ]
    });
    return files[0].destinationPath;
}

export { compressImage };
