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
    addDishForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addDishForm)
        const newDish = Object.fromEntries(formData)

        newDish.ingredients = newDish.ingredients.split(',').map(item => item.trim());
        newDish.preparationsSteps = newDish.preparationsSteps.split(',').map(item => item.trim());

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDish)
            });
            if (response.ok) {
                alert('Dish added successfully!');
                fetchDishes();
                addDishForm.reset();
            } else if (response.status === 409) {
                alert('Dish already exists!');
            } else {
                const errorData = await response.json();
                alert('Error adding dish: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error adding dish:', error);
            alert('Error adding dish');
        }
    })

    window.editDish = async (_id) => {
        const newName = prompt('Enter new name for the dish:');
        const newIngredients = prompt('Enter new ingredients (comma separated):');
        const newPreparationsSteps = prompt('Enter new preparation steps (comma separated):');
        const newCookingTime = prompt('Enter new cooking time:');
        const newOrigin = prompt('Enter new origin:')
        const newSpiceLevel = prompt('Enter new spice level:');

        try {
            const response = await fetch(`${API_BASE_URL}/${_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName,
                    ingredients: newIngredients.split(',').map(item => item.trim()),
                    preparationsSteps: newPreparationsSteps.split(',').map(item => item.trim()),
                    cookingTime: newCookingTime,
                    origin: newOrigin,
                    spiceLevel: newSpiceLevel
                })
            });
            if (response.ok) {
                alert('Dish updated successfully!');
                fetchDishes();
            } else {
                const errorData = await response.json();
                alert('Error updating dish: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error updating dish:', error);
            alert('Error updating dish');
        }
    }

    window.deleteDish = async (_id) => {
        if (confirm('Are you sure you want to delete this dish?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/${_id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    alert('Dish deleted successfully!');
                    fetchDishes();
                } else {
                    const errorData = await response.json();
                    alert('Error deleting dish: ' + errorData.message);
                }
            } catch (error) {
                console.error('Error deleting dish:', error);
                alert('Error deleting dish');
            }
        }
    }
    fetchDishes();
})
