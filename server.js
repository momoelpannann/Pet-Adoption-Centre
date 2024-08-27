const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'assets')));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Define routes for each page
app.get('/', (req, res) => {
    res.redirect('/home');
});
app.get('/home', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    const message = ''; 
    res.render('home', { loggedIn, message });});

app.get('/find', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    const message = ''; 
    res.render('find', { loggedIn, message });});

app.get('/contact', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    const message = ''; 
    res.render('contact', { loggedIn, message });});

app.get('/dog-care', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    const message = ''; 
    res.render('dog-care', { loggedIn, message });
});

app.get('/cat-care', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    const message = ''; 
    res.render('cat-care', { loggedIn, message });});

app.get('/give-away', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    const message = ''; 
    res.render('give-away', { loggedIn, message})});

app.get('/privacy', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    const message = ''; 
    res.render('privacy', { loggedIn, message });});

// Define file paths
const LOGIN_FILE = path.join(__dirname, 'logins.txt');
const PETS_FILE = path.join(__dirname, 'pets.txt');

// Ensure the login file exists; if not, create it
if (!fs.existsSync(LOGIN_FILE)) {
    fs.writeFileSync(LOGIN_FILE, '', 'utf-8');
    console.log('logins.txt file created');
}

// Ensure the pets file exists; if not, create it
if (!fs.existsSync(PETS_FILE)) {
    fs.writeFileSync(PETS_FILE, '', 'utf-8');
    console.log('pets.txt file created');
}

// Utility function to read a file
async function readFile(filePath) {
    return fs.promises.readFile(filePath, 'utf-8');
}

// Utility function to write to a file
async function writeFile(filePath, data) {
    return fs.promises.writeFile(filePath, data, 'utf-8');
}

// Route for the registration page
app.get('/register', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    const message = '';
    res.render('register', { loggedIn, message });});

// Handle registration form submission
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Server-side validation
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

    if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
        return res.render('register', { loggedIn: req.session.loggedIn || false, message: 'Invalid username or password format.' });
    }

    try {
        // Read the existing logins file
        let logins = await readFile(LOGIN_FILE);
        const users = logins.split('\n').map(line => line.split(':')[0]);

        // Check if username already exists
        if (users.includes(username)) {
            return res.render('register', { loggedIn: req.session.loggedIn || false, message: 'Username already exists. Please choose another one.' });
        }

        // Add new user to logins file
        logins += `${username}:${password}\n`;
        await writeFile(LOGIN_FILE, logins);
        return res.render('register', { loggedIn: req.session.loggedIn || false, message: 'Account successfully created! You are now ready to login.' });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).render('register', { loggedIn: req.session.loggedIn || false, message: 'An error occurred while processing your request.' });
    }
});

app.get('/login', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    const message = req.query.message || ''; // Capture the message from the query parameter
    res.render('login', { formAction: '/login', message: '', loggedIn });
});

app.get('/login-give-away', (req, res) => {
    const loggedIn = req.session.loggedIn || false;
    const message = '';
    res.render('login', { formAction: '/login-give-away', message: '', loggedIn });
});

// Handle login form submission
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Read the existing logins file
        const logins = await readFile(LOGIN_FILE);

        // Check if the login is valid
        const validLogin = logins.split('\n').some(line => line === `${username}:${password}`);

        if (validLogin) {
            req.session.loggedIn = true;
            req.session.username = username;
            res.redirect('/home');
        } else {
            res.render('login', { formAction: '/login', message: 'Invalid username or password. Please try again.', loggedIn: req.session.loggedIn || false });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

// Handle login for give-away
app.post('/login-give-away', async (req, res) => {
    const { username, password } = req.body;

    // Example: Validate username and password here
    const logins = await readFile(LOGIN_FILE);
    const validLogin = logins.split('\n').some(line => line === `${username}:${password}`);

    if (validLogin) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/give-away'); // Redirect to the give-away page after successful login
    } else {
        res.render('login', { formAction: '/login-give-away', message: 'Invalid username or password. Please try again.', loggedIn: req.session.loggedIn || false });
    }
});

// Handle pet search functionality
app.post('/search', (req, res) => {
    const { animal, breed, age, gender, location } = req.body;
    const loggedIn = req.session.loggedIn || false; 

    const allPets = [
        { name: 'Buddy', age: '2 years', breed: 'Labrador Retriever', gender: 'Male', description: 'Friendly and playful. Loves to run and fetch.', image: 'https://www.marthastewart.com/thmb/gCXKR-31DYnpsLi7uUj0S4zyfqc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/happy-labrador-retriever-getty-0322-2000-eb585d9e672e47da8b1b7e9d3215a5cb.jpg' },
        { name: 'Whiskers', age: '1 year', breed: 'Domestic Shorthair', gender: 'Female', description: 'Quiet and affectionate. Enjoys napping and cuddling.', image: 'https://www.lifetimepetcover.co.uk/assets/uploads/european_shorthair_6722645_1920_min.jpg' },
        { name: 'Charlie', age: '3 years', breed: 'Golden Retriever', gender: 'Male', description: 'Energetic and loves to swim.', image: 'https://www.vidavetcare.com/wp-content/uploads/sites/234/2022/04/golden-retriever-dog-breed-info.jpeg' },
        { name: 'Luna', age: '2 years', breed: 'Siamese', gender: 'Female', description: 'Very vocal and loves attention.', image: 'https://www.meowingtons.com/cdn/shop/articles/Screen_Shot_2021-01-06_at_3.43.10_PM.png?v=1609965795' },
        { name: 'Max', age: '4 years', breed: 'Beagle', gender: 'Male', description: 'Loves to sniff around and play outdoors.', image: 'https://cdn.britannica.com/80/29280-004-2162B4F7.jpg' },
        { name: 'Molly', age: '5 years', breed: 'Border Collie', gender: 'Female', description: 'Highly intelligent and loves to herd.', image: 'https://image.petmd.com/files/styles/978x550/public/2024-03/border-collie-2.jpg' },
        { name: 'Shadow', age: '3 years', breed: 'Black Labrador', gender: 'Male', description: 'Loyal and protective. Great with kids.', image: 'https://cdn.britannica.com/82/232782-050-8062ACFA/Black-labrador-retriever-dog.jpg' },
        { name: 'Bella', age: '2 years', breed: 'Ragdoll', gender: 'Female', description: 'Gentle and loving. Loves to be held.', image: 'https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/5b65b849-841f-4370-8030-95227c3d461e/ragdoll_cat_01401.jpg' },
        { name: 'Rex', age: '6 years', breed: 'German Shepherd', gender: 'Male', description: 'Brave and strong. Excellent guard dog.', image: 'https://cdn.britannica.com/79/232779-050-6B0411D7/German-Shepherd-dog-Alsatian.jpg' },
        { name: 'Simba', age: '4 years', breed: 'Maine Coon', gender: 'Male', description: 'Large and fluffy. A gentle giant.', image: 'https://image.petmd.com/files/styles/863x625/public/2023-04/Maine-coon-cat.jpg' },
        { name: 'Ruby', age: '2 years', breed: 'Shih Tzu', gender: 'Female', description: 'Affectionate and friendly. Great lap dog.', image: 'https://www.forbes.com/advisor/wp-content/uploads/2023/11/shih-tzu-temperament.jpeg.jpg' },
        { name: 'Oscar', age: '1 year', breed: 'Russian Blue', gender: 'Male', description: 'Quiet and reserved. Prefers calm environments.', image: 'https://www.petplace.com/article/cats/pet-behavior-training/cat-behavior-training/media_1041b79647ed81e66bcb0355b52e85c81eb403a51.jpeg?width=750&format=jpeg&optimize=medium' },
        { name: 'Coco', age: '3 years', breed: 'Cocker Spaniel', gender: 'Female', description: 'Happy and energetic. Loves to play.', image: 'https://www.akc.org/wp-content/uploads/2017/11/English-Cocker-Spaniel-Slide03.jpg' }
    ];

    // Filter pets based on search criteria
    const filteredPets = allPets.filter(pet => {
        return (animal === 'any' || pet.breed.toLowerCase().includes(breed.toLowerCase())) &&
               (gender === 'any' || pet.gender.toLowerCase() === gender.toLowerCase());
    });

    // Render the find.ejs view with the filtered pets
    res.render('find', { pets: filteredPets, loggedIn, message: '' });
});

// Handle pet submission
app.post('/submit-pet', async (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/give-away');
    }

    const { username } = req.session;
    const { 'pet-type': petType, 'pet-breed': petBreed, 'pet-age': petAge, 'pet-gender': petGender, 'gets-along-dogs': getsAlongDogs, 'gets-along-cats': getsAlongCats, 'suitable-for-children': suitableForChildren, comments, 'owner-name': ownerName, 'owner-email': ownerEmail } = req.body;

    const petInfo = `${username}:${petType}:${petBreed}:${petAge}:${petGender}:${getsAlongDogs}:${getsAlongCats}:${suitableForChildren}:${comments}:${ownerName}:${ownerEmail}`;

    let petsData = await readFile(PETS_FILE);
    const petID = petsData.split('\n').filter(line => line).length + 1; // Calculate next pet ID
    petsData += `${petID}:${petInfo}\n`;

    await writeFile(PETS_FILE, petsData);

    // Redirect to home page with success message
    res.redirect('/home?message=Your pet has been successfully submitted for adoption!');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to log out.');
        }
        res.redirect('/login?message=You have successfully logged out.');

    });
});

//start the server
const port = 8000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`);
});