const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../lib/data.json'); 

const registerUser = (req, res) => {
    const { firstName,lastName, email, password,confirmPassword } = req.body;

    // Debugging: Check the path to data.json
    console.log('Data file path:', dataFilePath);

    // Check if the data.json file exists
    fs.exists(dataFilePath, (exists) => {
        if (!exists) {
            return res.status(500).send('data.json file does not exist');
        }
    });

    // Read the existing data from the JSON file
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);  // More detailed error
            return res.status(500).send('Error reading data file');
        }

        let users = JSON.parse(data).users;

        // Check if the user already exists
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            return res.status(201).json({
                success: false,
                message: 'Email address already exists'
            });
        }

        // Add new user data
        const newUser = { firstName,lastName, email, password,confirmPassword };
        users.push(newUser);

        // Save the updated data back to the JSON file
        fs.writeFile(dataFilePath, JSON.stringify({ users }, null, 2), (err) => {
            if (err) {
                console.error('Error saving user data:', err);
                return res.status(500).send('Error saving user data');
            }

            return res.status(201).json({
                success: true,
                message: 'Registered successfully',
                data: {
                    email: newUser.email,
                    name: newUser.firstName 
                }
            });
        });
    });
}

module.exports = { registerUser };
