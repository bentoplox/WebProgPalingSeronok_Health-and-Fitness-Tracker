// 1. Drop the Origin crumb for this page
localStorage.setItem('recipeOrigin', 'CUSTOM RECIPES');

// 2. RENDER CUSTOM RECIPES
document.addEventListener("DOMContentLoaded", function() {
    
    // Grab our saved custom recipes from memory
    let myCustomRecipes = JSON.parse(localStorage.getItem('myCustomRecipes')) || [];
    
    // Find the Create New card on the page
    let createNewCard = document.getElementById('createNewCard');

    // Safety check: Only try to draw cards if we actually found the "Create New" card!
    if (createNewCard) {
        myCustomRecipes.forEach(function(recipe) {
            let cardHTML = `
                <div class="col-md-3">
                    <a href="recipe-details.html?id=${recipe.id}" class="text-decoration-none text-dark d-block h-100 position-relative">
                        <div class="card h-100 shadow-sm border-0 rounded-extra hover-elevate">
                            <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}" style="height: 160px; object-fit: cover; border-radius: 8px 8px 0 0;">
                            <div class="card-body text-center d-flex flex-column">
                                <h6 class="card-title fw-bold mb-1">${recipe.name}</h6>
                                <small class="text-muted mb-3">🕒 ${recipe.prepTime} | 🥦 ${recipe.diet}</small>
                                <h5 class="fw-bold calories-text mb-3">${recipe.calories} kcal</h5>
                                <span class="btn btn-recipe mt-auto">View Recipe</span>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            createNewCard.insertAdjacentHTML('beforebegin', cardHTML);
        });
    }
});