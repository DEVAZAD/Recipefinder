// app.js437dcc5d1dd143008081483a9fea904b// app.js
// Shortened version of your code
const ingredientForm = document.getElementById('ingredient-form');
const recipeContainer = document.getElementById('recipe-container');

ingredientForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const ingredients = document.getElementById('ingredients').value;
  const ingredientList = ingredients.split(',').map(ingredient => ingredient.trim());

  const apiKey = '437dcc5d1dd143008081483a9fea904b'; // Replace with your API key
  const apiUrl = 'https://api.spoonacular.com/recipes/findByIngredients';
  const params = new URLSearchParams({
    ingredients: ingredientList,
    number: 10,
    apiKey: apiKey,
  });
  const requestUrl = `${apiUrl}?${params}`;

  try {
    const response = await fetch(requestUrl);
    const recipes = await response.json();

    recipeContainer.innerHTML = '';

    if (Array.isArray(recipes)) {
      recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        
        const recipeLink = document.createElement('a');
        recipeLink.href = '#';
        recipeLink.textContent = recipe.title;

        recipeLink.addEventListener('click', async (event) => {
          event.preventDefault();

          const recipeApiUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information`;
          const recipeParams = new URLSearchParams({
            apiKey: apiKey,
            includeNutrition: true,
          });
          const recipeRequestUrl = `${recipeApiUrl}?${recipeParams}`;

          try {
            const response = await fetch(recipeRequestUrl);
            const recipeDetails = await response.json();

            recipeContainer.innerHTML = '';

            const recipeTitle = document.createElement('h2');
            recipeTitle.textContent = recipeDetails.title;
            recipeContainer.appendChild(recipeTitle);

            // Add image, instructions, nutrition details (similar to your original code)

          } catch (error) {
            console.error('Error fetching recipe details:', error);
          }
        });

        recipeDiv.appendChild(recipeLink);
        recipeContainer.appendChild(recipeDiv);
      });
    } else {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'No recipe suggestions were found. Please try again with different ingredients.';
      recipeContainer.appendChild(noResultsMessage);
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
});
