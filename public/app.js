// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Select the table body element where dishes will be displayed
    const dishesTableBody = document.querySelector('#dishesTable tbody');
    // Select the form element for adding new dishes
    const addDishForm = document.querySelector('#addDishForm');

    // Define the base URL for the dishes API
    const API_BASE_URL = 'http://localhost:5000/api/dishes';

    // Function to fetch all dishes from the API
    async function fetchDishes() {
        try {
            // Send a GET request to the API base URL
            const response = await fetch(API_BASE_URL);
            // Check if the response is not OK (e.g., 404, 500)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parse the JSON response to get the list of dishes
            const dishes = await response.json();
            // Update the table with the fetched dishes
            displayDishes(dishes);
        } catch (error) {
            // Log any errors to the console for debugging
            console.error('Error fetching dishes:', error);
            // Show an alert to the user with the error message
            alert('Error fetching dishes: ' + error.message);
        }
    }

    // Function to display dishes in the table
    function displayDishes(dishes) {
        // Clear the existing content of the table body
        dishesTableBody.innerHTML = '';

        // Iterate over each dish to create table rows
        dishes.forEach(dish => {
            // Create a new table row element
            const row = document.createElement('tr');

            // Create and append cells for each dish property
            const nameCell = document.createElement('td');
            // Set the cell text to the dish's name
            nameCell.textContent = dish.name;
            row.appendChild(nameCell);

            const ingredientsCell = document.createElement('td');
            // Join the ingredients array into a comma-separated string
            ingredientsCell.textContent = dish.ingredients.join(', ');
            row.appendChild(ingredientsCell);

            const preparationStepsCell = document.createElement('td');
            // Join the preparation steps array into a comma-separated string
            preparationStepsCell.textContent = dish.preparationSteps.join(', ');
            row.appendChild(preparationStepsCell);

            const cookingTimeCell = document.createElement('td');
            // Set the cell text to the dish's cooking time
            cookingTimeCell.textContent = dish.cookingTime;
            row.appendChild(cookingTimeCell);

            const originCell = document.createElement('td');
            // Set the cell text to the dish's origin
            originCell.textContent = dish.origin;
            row.appendChild(originCell);

            const spiceLevelCell = document.createElement('td');
            // Set the cell text to the dish's spice level
            spiceLevelCell.textContent = dish.spiceLevel;
            row.appendChild(spiceLevelCell);

            // Create a cell for action buttons
            const actionsCell = document.createElement('td');

            // Create an Update button
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            // Attach an onclick event to trigger the editDish function with the dish's ID
            updateButton.onclick = () => editDish(dish._id);
            actionsCell.appendChild(updateButton);

            // Create a Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            // Attach an onclick event to trigger the deleteDish function with the dish's ID
            deleteButton.onclick = () => deleteDish(dish._id);
            actionsCell.appendChild(deleteButton);

            // Append the actions cell to the row
            row.appendChild(actionsCell);

            // Append the completed row to the table body
            dishesTableBody.appendChild(row);
        });
    }

    // Add a submit event listener to the add dish form
    addDishForm.addEventListener('submit', async (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();
        // Create a FormData object from the form
        const formData = new FormData(addDishForm);
        // Convert FormData to a plain object
        const newDish = Object.fromEntries(formData);

        // Split and trim ingredients into an array
        newDish.ingredients = newDish.ingredients.split(',').map(item => item.trim());
        // Split and trim preparation steps into an array
        newDish.preparationSteps = newDish.preparationSteps.split(',').map(item => item.trim());

        try {
            // Send a POST request to add the new dish
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDish)
            });

            // Check if the response is OK (status 200-299)
            if (response.ok) {
                // Show a success message
                alert('Dish added successfully');
                // Refresh the table by fetching dishes again
                fetchDishes();
                // Reset the form fields
                addDishForm.reset();
            } else if (response.status === 409) {
                // Handle case where dish already exists
                alert('Dish already exists');
            } else {
                // Parse error details from the response
                const errorData = await response.json();
                // Show an error message with details
                alert('Error adding dish: ' + errorData.message);
            }
        } catch (error) {
            // Log any errors to the console for debugging
            console.error('Error adding dish:', error);
            // Show a generic error message to the user
            alert('Error adding dish');
        }
    });

    // Function to edit a dish, exposed globally
    window.editDish = async (_id) => {
        // Prompt the user for updated dish details
        const newName = prompt('Enter new name:');
        const newIngredients = prompt('Enter new ingredients (comma-separated):');
        const newPreparationSteps = prompt('Enter new preparation steps (comma-separated):');
        const newCookingTime = prompt('Enter new cooking time:');
        const newOrigin = prompt('Enter new origin:');
        const newSpiceLevel = prompt('Enter new spice level:');

        try {
            // Send a PUT request to update the dish with the given ID
            const response = await fetch(`${API_BASE_URL}/${_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName,
                    // Split and trim ingredients into an array
                    ingredients: newIngredients.split(',').map(item => item.trim()),
                    // Split and trim preparation steps into an array
                    preparationSteps: newPreparationSteps.split(',').map(item => item.trim()),
                    cookingTime: newCookingTime,
                    origin: newOrigin,
                    spiceLevel: newSpiceLevel
                })
            });

            // Check if the response is OK
            if (response.ok) {
                // Show a success message
                alert('Dish updated successfully');
                // Refresh the table by fetching dishes again
                fetchDishes();
            } else {
                // Parse error details from the response
                const errorData = await response.json();
                // Show an error message with details
                alert('Error updating dish: ' + errorData.message);
            }
        } catch (error) {
            // Log any errors to the console for debugging
            console.error('Error updating dish:', error);
            // Show a generic error message to the user
            alert('Error updating dish');
        }
    };

    // Function to delete a dish, exposed globally
    window.deleteDish = async (_id) => {
        // Confirm with the user before proceeding with deletion
        if (confirm('Are you sure you want to delete this dish?')) {
            try {
                // Send a DELETE request to remove the dish with the given ID
                const response = await fetch(`${API_BASE_URL}/${_id}`, {
                    method: 'DELETE'
                });

                // Check if the response is OK
                if (response.ok) {
                    // Show a success message
                    alert('Dish deleted successfully');
                    // Refresh the table by fetching dishes again
                    fetchDishes();
                } else {
                    // Parse error details from the response
                    const errorData = await response.json();
                    // Show an error message with details
                    alert('Error deleting dish: ' + errorData.message);
                }
            } catch (error) {
                // Log any errors to the console for debugging
                console.error('Error deleting dish:', error);
                // Show a generic error message to the user
                alert('Error deleting dish');
            }
        }
    };

    // Initial call to fetch and display dishes when the page loads
    fetchDishes();
});