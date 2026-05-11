
// FUNCTION TO DISPLAY SAVED RECIPES
function displaySavedRecipes() {
    // 1. Grab the container on the saved recipes page
    let container = document.getElementById("savedRecipesContainer");

    // 2. If we are NOT on the saved recipes page, this container won't exist. Stop the function so it doesn't crash
    if (!container) {
        return; 
    }

    // 3. Grab the saved IDs from memory
    let savedFavorites = JSON.parse(localStorage.getItem('userFavorites')) || [];

    // 4. UI untuk empty state
    if (savedFavorites.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center mt-5">
                <i class="fa-solid fa-heart-crack fs-1 text-muted mb-3"></i>
                <h4 class="text-muted">You haven't saved any recipes yet!</h4>
                <p class="text-muted">Head over to the Nutrition Planner to find your new favorite meals.</p>
                <a href="nutrition.html" class="btn btn-success mt-3 px-4">Find Recipes</a>
            </div>`;
        return;
    }

    // 5. FILTER: Search the main database and ONLY keep the meals whose IDs are in saved memory
    let favoriteMeals = recipeDatabase.filter(function(meal) {
        return savedFavorites.includes(meal.id);
    });

    // 6. Build the HTML
    let cardsHTML = "";
    favoriteMeals.forEach(function(meal) {
        let heartIconClass = "fa-solid text-danger";

        cardsHTML += `
            <div class="col-md-3">
                <a href="recipe-details.html?id=${meal.id}" class="text-decoration-none text-dark d-block h-100">
                    <div class="card h-100 shadow-sm border-0 rounded-extra hover-elevate">
                        
                        <!-- THE HEART BUTTON -->
                        <div class="position-absolute top-0 end-0 m-3" style="z-index: 10;">
                            <button class="btn btn-light rounded-circle shadow p-2 lh-1" onclick="toggleFavorite(event, ${meal.id})">
                                <i class="${heartIconClass} fa-heart fs-5"></i>
                            </button>
                        </div>

                        <img src="${meal.image}" onerror="this.onerror=null;this.src='https://placehold.co/400x300?text=Food+Image';" class="card-img-top" alt="${meal.name}" style="height: 160px; object-fit: cover; border-radius: 8px 8px 0 0;">
                        <div class="card-body text-center d-flex flex-column">
                            <div>${getRecipeBadges(meal)}</div>
                            <h6 class="card-title fw-bold mb-1">${meal.name}</h6>
                            <small class="text-muted mb-3">🕒 ${meal.prepTime} | 🥦 ${meal.diet}</small>
                            <h5 class="fw-bold calories-text mb-3">${meal.calories} kcal</h5>
                            <span class="btn btn-recipe mt-auto">View Recipe</span>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
    // 7. Inject the cards into the page
    container.innerHTML = cardsHTML;
}

// 8. Run the function immediately when the file loads
displaySavedRecipes();