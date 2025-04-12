document.addEventListener('DOMContentLoaded', () => {
    const dishesTableBody = document.querySelector('#dishesTable tbody');
    const addDishForm = document.querySelector('#addDishForm');

    const API_BASE_URL = 'http://localhost:5000/api/dishes';

    async function fetchDishes() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const dishes = await response.json();
            displayDishes(dishes);
        } catch (error) {
            console.error('Error fetching dishes:', error);
            alert('Error fetcting dishes: ' + error.message);
        }
    }
    