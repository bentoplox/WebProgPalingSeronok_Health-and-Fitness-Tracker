// Create dummy data - using array (MOCK DATABASE)
// can add a few more here so the generator has options
// In the future, we can replace this with an actual database or API call to get real recipes based on the user's calorie needs and dietary preferences
// Each recipe has an ID, name, calories, diet type, image URL, and preparation time
// diet property need to match the ids of the radio buttons (keto, vegan, etc.)
const recipeDatabase = [
    { id: 1, name: "Hummus Avocado Toast", calories: 527, diet: "vegan", image: "https://via.placeholder.com/150", prepTime: "5 mins" },
    { id: 2, name: "Southwest Chicken Skillet", calories: 713, diet: "keto", image: "https://via.placeholder.com/150", prepTime: "20 mins" },
    { id: 3, name: "Mediterranean Quinoa Salad", calories: 450, diet: "mediterranean", image: "https://via.placeholder.com/150", prepTime: "15 mins" },
    { id: 4, name: "Beef Steak and Sweet Potato", calories: 650, diet: "paleo", image: "https://via.placeholder.com/150", prepTime: "25 mins" },
    { id: 5, name: "Classic Cheeseburger", calories: 800, diet: "anything", image: "https://via.placeholder.com/150", prepTime: "15 mins" },
    { id: 6, name: "Mushroom Spinach Omelette", calories: 350, diet: "vege", image: "https://via.placeholder.com/150", prepTime: "10 mins" },
    { id: 7, name: "Salmon with Asparagus", calories: 500, diet: "keto", image: "https://via.placeholder.com/150", prepTime: "20 mins" },
    { id: 8, name: "Lentil Soup", calories: 400, diet: "vegan", image: "https://via.placeholder.com/150", prepTime: "30 mins" },
    { id: 9, name: "Greek Yogurt Bowl", calories: 300, diet: "vege", image: "https://via.placeholder.com/150", prepTime: "5 mins" }
];

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
    finalMealPlan.forEach(function(meal) {
        // We use backticks ( ` ) here to create a Template Literal. 
        // This lets us write multi-line HTML and inject variables using ${}
        rowHTML += `
            <div class="col-md-3 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${meal.image}" class="card-img-top" alt="${meal.name}" style="border-radius: 8px 8px 0 0;">
                    <div class="card-body text-center d-flex flex-column">
                        <h6 class="card-title fw-bold mb-1">${meal.name}</h6>
                        <small class="text-muted mb-3">🕒 ${meal.prepTime} | 🥦 ${meal.diet}</small>
                        <h5 class="fw-bold text-success mb-3">${meal.calories} kcal</h5>
                        <button class="btn btn-outline-success mt-auto">View Recipe</button>
                    </div>
                </div>
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
    
    // Create an empty string to hold our HTML
    let cardsHTML = "";

    // Loop through the entire mock database
    recipeDatabase.forEach(function(meal) {
        cardsHTML += `
            <div class="col-md-3 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${meal.image}" class="card-img-top" alt="${meal.name}" style="border-radius: 8px 8px 0 0;">
                    <div class="card-body text-center d-flex flex-column">
                        <h6 class="card-title fw-bold mb-1">${meal.name}</h6>
                        <small class="text-muted mb-3">🕒 ${meal.prepTime} | 🥦 ${meal.diet}</small>
                        <h5 class="fw-bold text-success mb-3">${meal.calories} kcal</h5>
                        <button class="btn btn-outline-success mt-auto">View Recipe</button>
                    </div>
                </div>
            </div>
        `;
    });

    // Inject all the built cards into the container at once
    container.innerHTML = cardsHTML;
}

// CRITICAL STEP: Call the function immediately so it runs as soon as the page loads!
displayAllRecipes();
