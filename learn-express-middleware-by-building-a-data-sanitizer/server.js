const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

const inputCleaner = (req, res, next) => {
    console.log('[Middleware 1] Cleaning/Modifying data...');
    if (req.body.username) {
        req.body.username = req.body.username.toLowerCase();
    }
    if (req.body.comment) {
        req.body.comment = req.body.comment.replace(/<[^>]*>/g, '');
    }
    next();
};

const inputValidator = (req, res, next) => {
    console.log('[Middleware 2] Validating data...');
    const { username, comment } = req.body;

    if (!username || username.length < 3) {
        console.log('[Middleware 2] Validation FAILED: Username too short.');
        return res.redirect('/form?error=Username must be at least 3 characters.');
    }


    console.log('[Middleware 2] Validation PASSED.');
    next();
};

app.use('/form', express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/form');
});

app.post('/submit', 
    inputCleaner,      
    inputValidator,    
    (req, res) => {    
        const { username, comment } = req.body;
        
        res.status(200).send(`
            <h1>✅ Submission Successful!</h1>
            <p>Middleware cleaned and validated your data:</p>
            <p><strong>Username:</strong> ${username} (Now lowercase)</p>
            <p><strong>Comment:</strong> ${comment} (Now sanitized)</p>
            <hr>
            <a href="/form">Submit another form</a>
        `);
    }
);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Open in browser: http://localhost:${PORT}/form`);
});