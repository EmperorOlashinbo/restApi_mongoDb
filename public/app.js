// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', () => {
    const dishesTableBody = document.querySelector('#dishesTable tbody'); // Table body for displaying dishes
    const addDishForm = document.querySelector('#addDishForm'); // Form for adding a new dish

    const API_BASE_URL = 'http://localhost:5000/api/dishes'; // Base URL for the API

    // Function to fetch all dishes from the API
    async function fetchDishes() {
        try {
            const response = await fetch(API_BASE_URL); // Fetch dishes from the API
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
            }
            const dishes = await response.json(); // Parse the JSON response
            displayDishes(dishes); // Display the dishes in the table
        } catch (error) {
            console.error('Error fetching dishes:', error); // Log any errors
            alert('Error fetching dishes: ' + error.message); // Show an error alert
        }
    }

    // Function to display dishes in the table
    function displayDishes(dishes) {
        dishesTableBody.innerHTML = ''; // Clear the table body

        dishes.forEach(dish => {
            const row = document.createElement('tr'); // Create a new table row

            // Create and append cells for each property
            const nameCell = document.createElement('td');
            nameCell.textContent = dish.name;
            row.appendChild(nameCell);

            const ingredientsCell = document.createElement('td');
            ingredientsCell.textContent = dish.ingredients.join(', ');
            row.appendChild(ingredientsCell);

            const preparationStepsCell = document.createElement('td');
            preparationStepsCell.textContent = dish.preparationSteps.join(', ');
            row.appendChild(preparationStepsCell);

            const cookingTimeCell = document.createElement('td');
            cookingTimeCell.textContent = dish.cookingTime;
            row.appendChild(cookingTimeCell);

            const originCell = document.createElement('td');
            originCell.textContent = dish.origin;
            row.appendChild(originCell);

            const spiceLevelCell = document.createElement('td');
            spiceLevelCell.textContent = dish.spiceLevel;
            row.appendChild(spiceLevelCell);

            // Create and append action buttons
            const actionsCell = document.createElement('td');

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.onclick = () => editDish(dish._id); // Call editDish with the dish ID
            actionsCell.appendChild(updateButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteDish(dish._id); // Call deleteDish with the dish ID
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);

            // Append the row to the table body
            dishesTableBody.appendChild(row);
        });
    }

    // Event listener for the "Add Dish" form submission
    addDishForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        const formData = new FormData(addDishForm); // Get form data
        const newDish = Object.fromEntries(formData); // Convert form data to an object

        // Process ingredients and preparation steps as arrays
        newDish.ingredients = newDish.ingredients.split(',').map(item => item.trim());
        newDish.preparationSteps = newDish.preparationSteps.split(',').map(item => item.trim());

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST', // Send a POST request to add a new dish
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDish) // Send the new dish as JSON
            });

            if (response.ok) {
                alert('Dish added successfully'); // Show success alert
                fetchDishes(); // Refresh the table
                addDishForm.reset(); // Reset the form
            } else if (response.status === 409) {
                alert('Dish already exists'); // Handle duplicate dish error
            } else {
                const errorData = await response.json();
                alert('Error adding dish: ' + errorData.message); // Handle other errors
            }
        } catch (error) {
            console.error('Error adding dish:', error); // Log any errors
            alert('Error adding dish'); // Show an error alert
        }
    });

    // Function to edit a dish
    window.editDish = async (_id) => {
        const newName = prompt('Enter new name:'); // Prompt for new name
        const newIngredients = prompt('Enter new ingredients (comma-separated):'); // Prompt for new ingredients
        const newPreparationSteps = prompt('Enter new preparation steps (comma-separated):'); // Prompt for new steps
        const newCookingTime = prompt('Enter new cooking time:'); // Prompt for new cooking time
        const newOrigin = prompt('Enter new origin:'); // Prompt for new origin
        const newSpiceLevel = prompt('Enter new spice level:'); // Prompt for new spice level

        try {
            const response = await fetch(`${API_BASE_URL}/${_id}`, { // Send a PUT request to update the dish
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName,
                    ingredients: newIngredients.split(',').map(item => item.trim()),
                    preparationSteps: newPreparationSteps.split(',').map(item => item.trim()),
                    cookingTime: newCookingTime,
                    origin: newOrigin,
                    spiceLevel: newSpiceLevel
                })
            });

            if (response.ok) {
                alert('Dish updated successfully'); // Show success alert
                fetchDishes(); // Refresh the table
            } else {
                const errorData = await response.json();
                alert('Error updating dish: ' + errorData.message); // Handle errors
            }
        } catch (error) {
            console.error('Error updating dish:', error); // Log any errors
            alert('Error updating dish'); // Show an error alert
        }
    };

    // Function to delete a dish
    window.deleteDish = async (_id) => {
        if (confirm('Are you sure you want to delete this dish?')) { // Confirm deletion
            try {
                const response = await fetch(`${API_BASE_URL}/${_id}`, { // Send a DELETE request
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Dish deleted successfully'); // Show success alert
                    fetchDishes(); // Refresh the table
                } else {
                    const errorData = await response.json();
                    alert('Error deleting dish: ' + errorData.message); // Handle errors
                }
            } catch (error) {
                console.error('Error deleting dish:', error); // Log any errors
                alert('Error deleting dish'); // Show an error alert
            }
        }
    };

    // Fetch and display dishes when the page loads
    fetchDishes();
});