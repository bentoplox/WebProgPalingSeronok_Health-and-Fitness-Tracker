// Create dummy data - using array (MOCK DATABASE)
// can add a few more here so the generator has options
// In the future, we can replace this with an actual database or API call to get real recipes based on the user's calorie needs and dietary preferences
// Each recipe has an ID, name, calories, diet type, image URL, and preparation time
// diet property need to match the ids of the radio buttons (keto, vegan, etc.)
const recipeDatabase = [
    { id: 1, name: "Hummus Avocado Toast", calories: 527, diet: "vegan", image: "../images/recipes/hummus-avocado-toast.png", prepTime: "5 mins" },
    { id: 2, name: "Southwest Chicken Skillet", calories: 713, diet: "keto", image: "../images/recipes/southwestern-chicken-skillet.png", prepTime: "20 mins" },
    { id: 3, name: "Mediterranean Quinoa Salad", calories: 450, diet: "mediterranean", image: "../images/recipes/mediterranean-quinoa-salad.jpg", prepTime: "15 mins" },
    { id: 4, name: "Beef Steak and Sweet Potato", calories: 650, diet: "paleo", image: "../images/recipes/beef-steak-and-sweet-potato.jpeg", prepTime: "25 mins" },
    { id: 5, name: "Classic Cheeseburger", calories: 800, diet: "anything", image: "../images/recipes/classic-cheeseburger.jpg", prepTime: "15 mins" },
    { id: 6, name: "Mushroom Spinach Omelette", calories: 350, diet: "vegan", image: "../images/recipes/mushroom-spinach-omelette.jpg", prepTime: "10 mins" },
    { id: 7, name: "Salmon with Asparagus", calories: 500, diet: "keto", image: "../images/recipes/salmon-with-asparagus.jpg", prepTime: "20 mins" },
    { id: 8, name: "Lentil Soup", calories: 400, diet: "vegan", image: "../images/recipes/lentil-soup.jpg", prepTime: "30 mins" },
    { id: 9, name: "Greek Yogurt Bowl", calories: 300, diet: "vegan", image: "../images/recipes/greek-yogurt-bowl.jpg", prepTime: "5 mins" }
];

// MEMORY SETUP: Grab saved recipes from the browser, or start fresh
let savedFavorites = JSON.parse(localStorage.getItem('userFavorites')) || [];

// FUNCTION FOR CALORIE CALCULATOR
function calculateCalories() {
    // 1. Go to html, Grab input values user typed or clicked
    // Use parseFloat because input entered by users is in string so we need to convert it into numbers
    let age = parseFloat(document.getElementById("ageInput").value); //Get age
    let height = parseFloat(document.getElementById("heightInput").value); //Get height
    let weight = parseFloat(document.getElementById("weightInput").value); //Get weight
    
    //For radio buttons, need to find ones that is currently checked first
    //We must grab the element first, validate that it exists, and then extract the ID, kalau tidak it will return null and will cause error and crash
    let activityLevelElement = document.querySelector('input[name="activityLevel"]:checked')
    let genderElement = document.querySelector('input[name="gender"]:checked')//Get gender

    // 2. Validation: Check if anything is empty
    if (!age || !height || !weight || !genderElement || !activityLevelElement) {
        // If anything is missing, tell the user and stop the function
        document.getElementById("resultContainer").innerHTML = `<div class="alert alert-danger">Please fill out all fields!</div>`;
        return; // This stops the rest of the code from running
    }

    // If we pass validation, extract the IDs
    let gender = genderElement.id;
    let activityLevel = activityLevelElement.id;

    // 3. Calculate BMR -> basal metabolic rate - minimum amount of calories needed to maintain life functions at rest
    let bmr = 0 //initialize variable bmr
    if (gender == "male") {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    }
    else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
    }

    //4. Calculate Total Daily Energy Expenditure (TDEE) = BMR * activity level
    let tdee = 0;
    switch (activityLevel) {
        case "light":
            tdee = bmr * 1.375;
            break;
        case "moderate":
            tdee = bmr * 1.55;
            break;
        case "active":
            tdee = bmr * 1.725;
            break;
        case "very-active":
            tdee = bmr * 1.9;
            break;
    }

    // 5. Display the result to user  
        document.getElementById("resultContainer").innerHTML = '<div class="alert alert-success">Your daily goal: <strong>' + Math.round(tdee) + ' calories</strong></div>';
}

//FUNCTION FOR MEAL GENERATOR
// use a Sorting Algorithm - sort filteredRecipes based on how close they are to our target, and then grab the top few that match the mealCount
function generateMeals() {
    //1. Go to html, Grab input values
    let targetCalories = parseFloat(document.getElementById("targetCalories").value); //Get target calories
    let mealCount = parseFloat(document.getElementById("mealCount").value); //Get meal count
    //For radio buttons, need to find ones that is currently checked first
    //We must grab the element first, validate that it exists, and then extract the ID, kalau tidak it will return null and will cause error and crash
    let dietElement = document.querySelector('input[name="diet"]:checked') //tengok if preferred diet selected

    // 2. Validation: Check if anything is empty
    if (!mealCount || !targetCalories || !dietElement) {
        // If anything is missing, tell the user and stop the function
        document.getElementById("resultContainer").innerHTML = `<div class="alert alert-danger">Please fill out all fields!</div>`;
        return; // This stops the rest of the code from running
    }

     // If we pass validation, extract the IDs
    let diet = dietElement.id; //get diet

    // 3. Search through your array and isolate only the matching recipes
    let filteredRecipes = recipeDatabase.filter(function(recipe) {
    // If the user selected "anything", we want to keep all recipes!
    if (diet === "anything") {
        return true; 
    }
        // Otherwise, only keep the recipe if its diet matches the user's choice
        return recipe.diet === diet; 
    });

    // make it so that dia akan display the meals yang closest to the target calories PER MEAL
    // 4. Calculate the target calories PER MEAL
    let targetCaloriesPerMeal = targetCalories / mealCount;

    // 5. Sort the filtered recipes by how close they are to our target
    // Math.abs() turns negative numbers positive so we just get the pure difference
    filteredRecipes.sort(function(a, b) {
        let differenceA = Math.abs(a.calories - targetCaloriesPerMeal);
        let differenceB = Math.abs(b.calories - targetCaloriesPerMeal);
        return differenceA - differenceB; // Sorts from closest match to furthest match
    });

    // 6. Slice the array to grab only the number of meals the user requested
    // If they wanted 3 meals, this grabs the first 3 items from our sorted array
    let finalMealPlan = filteredRecipes.slice(0, mealCount);

    // Test
    console.log("Target Calories per meal:", targetCaloriesPerMeal);
    console.log("Final Meal Plan:", finalMealPlan);

    // 7. Display the meal plan to the user
    // use the JavaScript .forEach() method to look at every meal in finalMealPlan array, 
    // build a Bootstrap Card for it, and attach it to the mealPlanContainer in the HTML
    let container = document.getElementById("mealPlanContainer");

    // Clear out any old meals from a previous click
    container.innerHTML = "";

    // Create a Bootstrap row to hold the cards side-by-side
    let rowHTML = '<div class="row justify-content-center">';

    // Loop through our final meals array to spawn the UI cards
    finalMealPlan.forEach(function (meal) {
        // Check our memory: Is this specific meal's ID inside our saved list?
        let isSaved = savedFavorites.includes(meal.id);
        // If it is saved, use a solid red heart. If not, use a gray outline heart.
        let heartIconClass = isSaved ? "fa-solid text-danger" : "fa-regular text-muted";
        // We use backticks ( ` ) here to create a Template Literal. 
        // This lets us write multi-line HTML and inject variables using ${}
        rowHTML += `
            <div class="col-md-3">
                <a href="recipe-details.html" class="text-decoration-none text-dark d-block h-100">
                    <div class="card h-100 shadow-sm border-0 rounded-extra hover-elevate">
                        <div class="position-absolute top-0 end-0 m-3" style="z-index: 10;">
                            <button class="btn btn-light rounded-circle shadow p-2 lh-1" onclick="toggleFavorite(event, ${meal.id})">
                                <i class="${heartIconClass} fa-heart fs-5"></i>
                            </button>
                        </div>
                        <img src="${meal.image}" class="card-img-top" alt="${meal.name}" style="height: 160px; object-fit: cover; border-radius: 8px 8px 0 0;">
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

    rowHTML += '</div>'; // Close the row

    // Inject the fully built HTML string into the container
    container.innerHTML = rowHTML;
}

// MACRO AUTO-UPDATER
//Event listener for input for macro target (carbs, fat, protein) - update the text in the target section when user changes the input
// 1. Grab the calorie input box
let calorieInput = document.getElementById("targetCalories");

// 2. Add the Event Listener for any 'input' (keystrokes, arrows, deleting) - the math updates instantly on every single keystroke so xyah tekan button
calorieInput.addEventListener("input", function() {
    
    // Grab the current number typed in the box
    let currentCalories = parseFloat(calorieInput.value);

    // Safety check: If the user deletes everything and the box is empty, stop the math so it doesn't print "NaN" (Not a Number)
    if (!currentCalories) {
        return; 
    }

    // 3. The Math (50/30/20 split)
    let carbs = Math.round((currentCalories * 0.50) / 4);
    let fat = Math.round((currentCalories * 0.30) / 9);
    let protein = Math.round((currentCalories * 0.20) / 4);

    // 4. Inject the new numbers back into the HTML
    document.getElementById("carbTarget").innerText = carbs + "g";
    document.getElementById("fatTarget").innerText = fat + "g";
    document.getElementById("proteinTarget").innerText = protein + "g";
});

//FUNCTION TO DISPLAY ALL RECIPES
function displayAllRecipes() {
    let container = document.getElementById("allRecipesContainer");
    
    // ADD THIS SAFETY CHECK:
    if (!container) {
        return; 
    }

    // Create an empty string to hold our HTML
    let cardsHTML = "";

    // Loop through the entire mock database
    // Buttons are usually for submitting forms or triggering JavaScript functions 
    // To navigate to another page,, use <a> disguised as a button
    recipeDatabase.forEach(function (meal) {
        // Check our memory: Is this specific meal's ID inside our saved list?
        let isSaved = savedFavorites.includes(meal.id);
        // If it is saved, use a solid red heart. If not, use a gray outline heart.
        let heartIconClass = isSaved ? "fa-solid text-danger" : "fa-regular text-muted";
        cardsHTML += `
            <div class="col-md-3">
            <a href="recipe-details.html" class="text-decoration-none text-dark d-block h-100">
                <div class="card h-100 shadow-sm border-0 rounded-extra hover-elevate">
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

    // Inject all the built cards into the container at once
    container.innerHTML = cardsHTML;
}

// CRITICAL STEP: Call the function immediately so it runs as soon as the page loads!
displayAllRecipes();

// HELPER FUNCTION: Generate badges based on recipe data
function getRecipeBadges(recipe) {
    let badgesHTML = "";

    // Insight 1: Low Calorie (Under 500 kcal)
    if (recipe.calories <= 500) {
        badgesHTML += `<span class="badge bg-success me-1 mb-2">Low Calorie</span>`;
    }

    // Insight 2: High Calorie/Bulking (Over 700 kcal)
    if (recipe.calories >= 700) {
        badgesHTML += `<span class="badge bg-danger me-1 mb-2">High Energy</span>`;
    }

    // Insight 3: Quick Prep (We check if the string contains 5 or 10)
    if (recipe.prepTime.includes("5") || recipe.prepTime.includes("10")) {
        badgesHTML += `<span class="badge bg-warning text-dark me-1 mb-2">Quick Prep</span>`;
    }

    return badgesHTML;
}

// ACTIVATE BOOTSTRAP TOOLTIPS
// This code waits for the page to load, then turns on all hover tooltips
document.addEventListener("DOMContentLoaded", function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});

// 1. Create a function to update the recipe counts
function updateRecipeCounts() {
    // 2. Count the recipes
    // In a real app, you would count the items in your database here.
    // For now, we will simulate this by checking the length of your mock database!
    let savedRecipesTotal = savedFavorites.length; 
    
    // Let's pretend the user has customized 2 recipes
    let customRecipesTotal = 2; 

    // 3. Grab the HTML elements using the IDs we just added
    let savedCountElement = document.getElementById("saved-recipe-count");
    let customCountElement = document.getElementById("custom-recipe-count");

    // 4. Update the HTML text with our new numbers
    // We add a safety check (if) just in case the elements don't exist on the page
    if (savedCountElement) {
        savedCountElement.innerText = savedRecipesTotal;
    }

    if (customCountElement) {
        customCountElement.innerText = customRecipesTotal;
    }
}

// 5. Run the function immediately when the page loads
updateRecipeCounts();

// FAVORITES LOGIC
function toggleFavorite(event, recipeId) {
    // 1. The Trap Fix: Stop the <a> tag from redirecting us!
    event.preventDefault();
    event.stopPropagation();

    // 2. Find the specific <i> icon inside the button the user just clicked
    let icon = event.currentTarget.querySelector('i');

    // 3. Check if the recipe is already in our list
    let index = savedFavorites.indexOf(recipeId);

    if (index === -1) {
        // NOT IN LIST: It means the user wants to save it.
        savedFavorites.push(recipeId); // Add to array
        
        // Change the heart visually to solid red
        icon.className = "fa-solid fa-heart fs-5 text-danger"; 
    } else {
        // ALREADY IN LIST: It means the user wants to un-save it.
        savedFavorites.splice(index, 1); // Remove from array
        
        // Change the heart visually back to a gray outline
        icon.className = "fa-regular fa-heart fs-5 text-muted";
    }

    // 4. Save the updated list back to the browser's memory!
    localStorage.setItem('userFavorites', JSON.stringify(savedFavorites));

    // 5. Bonus: Instantly update the giant "Saved Recipes" number on the dashboard!
    updateRecipeCounts();

    // 6. Bonus: If the user is on the Saved Recipes page, immediately refresh the grid!
    if (document.getElementById("savedRecipesContainer")) {
        displaySavedRecipes();
    }
}

// ==========================================
// TAB MEMORY (Persistence)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // 1. Grab all the tab buttons on the page
    let tabButtons = document.querySelectorAll('button[data-bs-toggle="tab"]');
    
    // Safety check: if there are no tabs on this page, stop running the script!
    if (tabButtons.length === 0) return;

    // 2. CHECK MEMORY ON LOAD: Did we save a tab previously?
    let savedTab = localStorage.getItem('lastActiveNutritionTab');
    if (savedTab) {
        // Find the specific button that matches our saved memory
        let targetButton = document.querySelector(`button[data-bs-target="${savedTab}"]`);
        if (targetButton) {
            // Simulate a click on it to activate it immediately!
            targetButton.click(); 
        }
    }

    // 3. SAVE TO MEMORY ON CLICK: Watch for whenever the user clicks a tab
    tabButtons.forEach(button => {
        // 'shown.bs.tab' is a special Bootstrap event that fires AFTER a tab is fully opened
        button.addEventListener('shown.bs.tab', function(event) {
            // Get the ID of the tab that just opened (e.g., "#generator" or "#recipe")
            let activeTabId = event.target.getAttribute('data-bs-target');
            
            // Save it to the browser's memory
            localStorage.setItem('lastActiveNutritionTab', activeTabId);
        });
    });
});

// ==========================================
// RECIPE SEARCH ENGINE (DOM Filtering)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    let searchInput = document.getElementById('recipeSearchInput');

    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            let searchTerm = searchInput.value.toLowerCase();
            let container = document.getElementById('allRecipesContainer');
            let cardColumns = container.querySelectorAll('[class*="col-"]'); 
            
            // 1. Set up our tracker and grab the empty state message
            let visibleCount = 0;
            let noResultsMessage = document.getElementById('noResultsMessage');

            cardColumns.forEach(column => {
                // Safety check: Don't accidentally hide/show the empty state message during the card loop!
                if (column.id === 'noResultsMessage') return; 

                let titleElement = column.querySelector('.fw-bold, h5, h6'); 
                
                if (titleElement) {
                    let titleText = titleElement.innerText.toLowerCase();

                    if (titleText.includes(searchTerm)) {
                        column.style.display = ""; 
                        // 2. We found a match! Increase the count
                        visibleCount++; 
                    } else {
                        column.style.display = "none"; 
                    }
                }
            });

            // 3. The Final Check: Did we find any cards?
            if (noResultsMessage) {
                if (visibleCount === 0) {
                    // No matches found, reveal the friendly message
                    noResultsMessage.style.display = "block";
                } else {
                    // Matches were found, keep the message hidden
                    noResultsMessage.style.display = "none";
                }
            }
            
        });
    }
});