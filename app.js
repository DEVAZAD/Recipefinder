const ingredientForm = document.getElementById('ingredient-form');
const recipeContainer = document.getElementById('recipe-container');

// Add a submit listener to the ingredient form
ingredientForm.addEventListener('submit', (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();
  
  // Get the list of ingredients from the form
  const ingredients = document.getElementById('ingredients').value;
  // Split the list of ingredients into an array and trim any whitespace from the ingredients
  const ingredientList = ingredients.split(',').map(ingredient => ingredient.trim());

  // Show a loading message while the request is being made
  recipeContainer.innerHTML = '<p>Loading...</p>';

  // You can use a recipe API here to get recipe suggestions based on the ingredients
  // For example, you can use the Spoonacular Recipe API:
  const apiKey = '437dcc5d1dd143008081483a9fea904b';
  const apiUrl = 'https://api.spoonacular.com/recipes/findByIngredients';
  const params = new URLSearchParams();
  params.append('ingredients', ingredientList);
  params.append('number', 2);
  params.append('apiKey', apiKey);
  const requestUrl = `${apiUrl}?${params}`;
  
  // Make a request to the API to search for recipes
  fetch(requestUrl)
    .then(response => {
      // If the request was successful, parse the JSON response
      if (response.ok) {
        return response.json();
      }
      // If the request was not successful, show an error message
      throw new Error(response.statusText);
    })
    .then(recipes => {
      // Clear the recipe container
      recipeContainer.innerHTML = '';
      // Add the recipe suggestions to the page
      if (Array.isArray(recipes)) {
        recipes.forEach(recipe => {
          const recipeDiv = document.createElement('div');
          recipeDiv.classList.add('recipe');
          const recipeLink = document.createElement('a');
          recipeLink.href = '#';
          recipeLink.textContent = recipe.title;
          recipeLink.addEventListener('click', (event) => {
            event.preventDefault();
            // Make a request to the Spoonacular Recipe API to get the full recipe details
            const recipeApiUrl = 'https://api.spoonacular.com/recipes';
            const recipeParams = new URLSearchParams();
            recipeParams.append('apiKey', apiKey);
            recipeParams.append('includeNutrition', true);
            const recipeRequestUrl = `${recipeApiUrl}/${recipe.id}/information?${recipeParams}`;
            // Show a loading message while the request is being made
            recipeContainer.innerHTML = '<p>Loading...</p>';
            fetch(recipeRequestUrl)
              .then(response => {
                // If the request was successful, parse the JSON response
                (response.ok) {
                return response.json();
              }
              // If the request was not successful, show an error message
              throw new Error(response.statusText);
            })
            .then(recipeDetails => {
              // Clear the recipe container
              recipeContainer.innerHTML = '';
              // Display the recipe details
              const recipeTitle = document.createElement('h2');
              recipeTitle.textContent = recipeDetails.title;
              recipeContainer.appendChild(recipeTitle);

              const recipeImage = document.createElement('img');
              recipeImage.src = recipeDetails.image;
              recipeImage.alt = recipeDetails.title;
              recipeContainer.appendChild(recipeImage);

              const recipeInstructions = document.createElement('p');
              recipeInstructions.textContent = recipeDetails.instructions;
              recipeContainer.appendChild(recipeInstructions);

              const recipeNutrition = document.createElement('ul');
              recipeDetails.nutrition.forEach(nutrient => {
                const nutrientItem = document.createElement('li');
                nutrientItem.textContent = `${nutrient.title}: ${nutrient.amount} ${nutrient.unit}`;
                recipeNutrition.appendChild(nutrientItem);
              });
              recipeContainer.appendChild(recipeNutrition);
            })
            .catch(error => {
              // If there was an error, show an error message
              recipeContainer.innerHTML = `<p>An error occurred: ${error.message}</p>`;
            });
          });
          recipeDiv.appendChild(recipeLink);
          recipeContainer.appendChild(recipeDiv);
        });
      } else {
        // If there were no recipes returned, show a message
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'No recipe suggestions were found. Please try again with different ingredients.';
        recipeContainer.appendChild(noResultsMessage);
      }
    })
    .catch(error => {
      // If there was an error, show an error message
      recipeContainer.innerHTML = `<p>An error occurred: ${error.message}</p>`;
    });
});

