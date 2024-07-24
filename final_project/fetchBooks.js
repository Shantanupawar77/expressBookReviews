const axios = require('axios');

// Function to fetch books using async-await
async function fetchBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log('Books:', response.data);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Call the function to test
fetchBooks();
