const fs = require('fs');
const path = require('path');

const Users_Data = path.join(__dirname, "Users.json");

// Function to read user data
const readUserData = () => {
    if (!fs.existsSync(Users_Data)) {
        fs.writeFileSync(Users_Data, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(Users_Data, 'utf-8'));
};

// Function to write user data
const writeUserData = (data) => {
    fs.writeFileSync(Users_Data, JSON.stringify(data, null, 2));
};

module.exports = { readUserData, writeUserData };
