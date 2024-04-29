const fs = require('fs').promises;
const path = require('path');

async function listDirectories(directoryPath, indent) {
    try {
        const files = await fs.readdir(directoryPath);

        for (const fileName of files) {
            const filePath = path.join(directoryPath, fileName);
            const stats = await fs.stat(filePath);

            if (stats.isDirectory()) {                
                const prefix = indent === 0 ? '' : '│   '.repeat(indent - 1) + '├── ';
                console.log(prefix + fileName);

                await listDirectories(filePath, indent + 1);
            }
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

listDirectories(process.cwd(), 0);
