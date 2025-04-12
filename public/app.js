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

    function displayDishes(dishes) {
        dishesTableBody.innerHTML = '';

        dishes.forEach(dish => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = dish.name;
            row.appendChild(nameCell);

            const ingredientsCell = document.createElement('td');
            ingredientsCell.textContent = dish.ingredients.join(', ');
            row.appendChild(ingredientsCell);

            const preparationsStepsCell = document.createElement('td');
            preparationsStepsCell.textContent = dish.preparationsSteps.join(', ');
            row.appendChild(preparationsStepsCell);

            const cookingTimeCell = document.createElement('td');
            cookingTimeCell.textContent = dish.cookingTime;
            row.appendChild(cookingTimeCell);

            const originCell = document.createElement('td');
            originCell.textContent = dish.origin;
            row.appendChild(originCell);

            const spiceLevelCell = document.createElement('td');
            spiceLevelCell.textContent = dish.spiceLevel;
            row.appendChild(spiceLevelCell);

            const actionsCell = document.createElement('td');

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.onclick = () => editDish(dish._id);
            actionsCell.appendChild(updateButton);

            row.appendChild(actionsCell);

            dishesTableBody.appendChild(row);
        })
    }
