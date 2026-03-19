const fs = require('fs');
const path = require('path');

// Load environment variables from .env file securely
require('dotenv').config();

const envDir = path.join(__dirname, '../src/environments');

if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Retrieve the Web3Forms key specifically stored in CI/CD pipeline or .env
const key = process.env.WEB3FORMS_ACCESS_KEY || process.env.web3formsKey || '';

// Dynamically generate the environment.ts file that Angular will compile
const envContent = `export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  web3formsKey: '${key}'
};
`;

fs.writeFileSync(path.join(envDir, 'environment.ts'), envContent);

console.log('Successfully injected .env secrets into Angular build environment!');
