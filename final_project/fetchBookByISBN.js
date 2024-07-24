const axios = require('axios');

async function fetchBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log('Book Details:', response.data);
    } catch (error) {
        console.error('Error fetching book details:', error.message);
    }
}

// Test with a sample ISBN
fetchBookByISBN(2);