const express = require('express');
const { readUserData, writeUserData } = require('./File');

const app = express();
const port = 3005;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

// Register a new user
app.post("/register_user", (req, res) => {
    const users = readUserData();

    let user_id = users.length === 0 ? 1 : users[users.length - 1].id + 1;

    const new_user = {
        id: user_id,
        name: req.body.name,
        age: req.body.age,
        password: req.body.password
    };

    users.push(new_user);
    writeUserData(users);

    res.status(200).json({ message: "User registered successfully." });
});

// Update user details
app.put("/update_user/:id", (req, res) => {
    const users = readUserData();  // Read users from file
    const user_id = parseInt(req.params.id);

    const userIndex = users.findIndex(user => user.id === user_id);
    if (userIndex === -1) {
        return res.status(400).json({ message: "User not found." });
    }

    users[userIndex].name = req.body.name;
    users[userIndex].age = req.body.age;
    users[userIndex].password = req.body.password;

    writeUserData(users);  // Save updated users list

    res.status(200).json({ message: "User updated successfully." });
});

// Delete a user
app.delete("/delete_user/:id", (req, res) => {
    const users = readUserData();  // Read users from file
    const user_id = parseInt(req.params.id);

    const updatedUsers = users.filter(user => user.id !== user_id);

    if (users.length === updatedUsers.length) {
        return res.status(400).json({ message: "User not found." });
    }

    writeUserData(updatedUsers);  // Save updated users list

    res.status(200).json({ message: "User deleted successfully." });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
