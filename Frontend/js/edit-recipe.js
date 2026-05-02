// ==========================================
// 1. IMAGE UPLOAD LOGIC
// ==========================================
let uploadBtn = document.getElementById('uploadImageBtn');
let hiddenInput = document.getElementById('imageInput');
let imagePreview = document.getElementById('recipeImagePreview');

// When user clicks the button, pretend they clicked the hidden file input
if(uploadBtn) {
    uploadBtn.addEventListener('click', function() {
        hiddenInput.click();
    });
}

// When a file is chosen, swap the image preview
if(hiddenInput) {
    hiddenInput.addEventListener('change', function(event) {
        let file = event.target.files[0];
        if (file) {
            // URL.createObjectURL creates a temporary link to the file on the user's computer!
            imagePreview.src = URL.createObjectURL(file);
        }
    });
}

// ==========================================
// 2. DYNAMIC INGREDIENTS & MACROS
// ==========================================
let addIngredientBtn = document.getElementById('addIngredientBtn');
let ingredientsContainer = document.getElementById('ingredientsContainer');

if(addIngredientBtn) {
    addIngredientBtn.addEventListener('click', function() {
        // Build the HTML for a new row
        let newRow = `
            <div class="card mb-3 bg-light border-0 ingredient-row">
                <div class="card-body d-flex align-items-center gap-3">
                    <div class="flex-grow-1">
                        <input type="text" class="form-control fw-bold mb-2 border-0 bg-transparent px-0" placeholder="Ingredient Name">
                        <div class="d-flex gap-2">
                            <input type="number" class="form-control form-control-sm ingredient-qty" value="0" style="width: 80px;" oninput="recalculateMacros()">
                            <select class="form-select form-select-sm" style="width: 100px;">
                                <option>grams</option>
                                <option>pieces</option>
                                <option>tbsp</option>
                            </select>
                            <input type="text" class="form-control form-control-sm" placeholder="Notes (e.g. diced)">
                        </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm border-0" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        // Insert it at the bottom of the container
        ingredientsContainer.insertAdjacentHTML('beforeend', newRow);
        recalculateMacros();
    });
}

// Reusable function to delete a row (Works for Ingredients AND Directions)
function removeRow(buttonElement) {
    // .closest() finds the nearest parent with that class, then we delete it!
    let card = buttonElement.closest('.card, .d-flex'); 
    card.remove();
    
    recalculateMacros();
    updateStepNumbers();
}

// Simulated Macro Calculator
// Simulated Macro Calculator
function recalculateMacros() {
    let allQtyInputs = document.querySelectorAll('.ingredient-qty');
    let totalWeight = 0;

    // Loop through all inputs and add up the numbers
    allQtyInputs.forEach(input => {
        totalWeight += parseFloat(input.value) || 0;
    });

    // Basic simulation math: assuming average macro distribution for a mixed meal
    let carbs = Math.round(totalWeight * 0.3); // 30% of weight is carbs
    let fat = Math.round(totalWeight * 0.15);  // 15% of weight is fat
    let protein = Math.round(totalWeight * 0.2); // 20% of weight is protein
    let totalCals = (carbs * 4) + (fat * 9) + (protein * 4);

    // Calculate percentages for the progress bars
    let totalMacros = carbs + fat + protein || 1; // '|| 1' prevents dividing by zero if inputs are empty
    let carbsPct = Math.round((carbs / totalMacros) * 100);
    let fatPct = Math.round((fat / totalMacros) * 100);
    let proteinPct = Math.round((protein / totalMacros) * 100);

    // 1. Update the Text Elements
    let calElement = document.getElementById('totalCalsText');
    let carbsText = document.getElementById('carbsText');
    let fatText = document.getElementById('fatText');
    let proteinText = document.getElementById('proteinText');

    if(calElement) calElement.innerText = totalCals + " kcal";
    if(carbsText) carbsText.innerText = carbs + "g (" + carbsPct + "%)";
    if(fatText) fatText.innerText = fat + "g (" + fatPct + "%)";
    if(proteinText) proteinText.innerText = protein + "g (" + proteinPct + "%)";

    // 2. Update the Progress Bar Widths
    let carbsBar = document.getElementById('carbsBar');
    let fatBar = document.getElementById('fatBar');
    let proteinBar = document.getElementById('proteinBar');

    if(carbsBar) carbsBar.style.width = carbsPct + "%";
    if(fatBar) fatBar.style.width = fatPct + "%";
    if(proteinBar) proteinBar.style.width = proteinPct + "%";
}
// ==========================================
// 3. DYNAMIC DIRECTIONS
// ==========================================
let addStepBtn = document.getElementById('addStepBtn');
let directionsContainer = document.getElementById('directionsContainer');

if(addStepBtn) {
    addStepBtn.addEventListener('click', function() {
        let newStepHTML = `
            <div class="d-flex align-items-start gap-3 mb-4 step-row">
                <div class="bg-success text-white rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 step-number" style="width: 30px; height: 30px;">#</div>
                <textarea class="form-control" rows="2" placeholder="Describe this step..."></textarea>
                <button class="btn btn-outline-danger border-0 mt-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        directionsContainer.insertAdjacentHTML('beforeend', newStepHTML);
        updateStepNumbers();
    });
}

// Function to recount the step numbers so they always stay in order (1, 2, 3...)
function updateStepNumbers() {
    let stepCircles = document.querySelectorAll('.step-number');
    stepCircles.forEach((circle, index) => {
        circle.innerText = index + 1; // index starts at 0, so we add 1
    });
}

// ==========================================
// 4. SAVE BUTTON & ALERT
// ==========================================
let saveBtn = document.getElementById('saveCustomRecipeBtn');

if(saveBtn) {
    saveBtn.addEventListener('click', function () {
        let isConfirmed = confirm("Are you sure you want to save these changes to your custom recipe?");
        
        if (isConfirmed) {
            // 1. Load the mini-database
            let myCustomRecipes = JSON.parse(localStorage.getItem('myCustomRecipes')) || [];
            
            // 2. Check the URL to see what recipe we are currently looking at
            let urlParams = new URLSearchParams(window.location.search);
            let editingId = parseInt(urlParams.get('id'));

            // 3. Build the updated recipe object
            let updatedRecipe = {
                // If we are editing an existing custom recipe, keep its old ID. Otherwise, make a new one!
                id: (editingId >= 900) ? editingId : (900 + myCustomRecipes.length),
                name: document.getElementById('editRecipeName').value,
                calories: parseInt(document.getElementById('totalCalsText').innerText),
                prepTime: document.getElementById('editPrepTime').value + " mins",
                image: document.getElementById('recipeImagePreview').src,
                diet: "Custom"
            };

            // 4. THE SMART SAVE LOGIC
            if (editingId >= 900) {
                // UPDATE: We are editing an existing custom recipe. 
                // Find its exact position in the array and replace it with the new data.
                let index = myCustomRecipes.findIndex(r => r.id === editingId);
                if (index !== -1) {
                    myCustomRecipes[index] = updatedRecipe;
                }
            } else {
                // CREATE: We are customizing a main recipe for the first time. Add it to the end!
                myCustomRecipes.push(updatedRecipe);
            }

            // 5. Save the array back to memory
            localStorage.setItem('myCustomRecipes', JSON.stringify(myCustomRecipes));

            alert("Recipe saved successfully!");
            isSafeToLeave = true;
            window.location.replace("custom-recipes.html");
        }
    });
}

// ==========================================
// 5. UNSAVED CHANGES WARNING (Safety Net)
// ==========================================
let isSafeToLeave = false; // By default, it is dangerous to leave

// Watch for ANY attempt to leave the page (refresh, close tab, back button, clicking a link)
window.addEventListener('beforeunload', function (event) {
    if (!isSafeToLeave) {
        // This standard code triggers the browser's native warning popup
        event.preventDefault();
        event.returnValue = ''; 
    }
});

// ==========================================
// 6. CANCEL BUTTON LOGIC
// ==========================================
function cancelEditing(event) {
    // Prevent the <a> tag from trying to jump to the top of the page
    if (event) {
        event.preventDefault();
    }

    // Trigger the native browser confirmation box
    let userWantsToLeave = confirm("Are you sure you want to leave? Changes won't be saved.");

    if (userWantsToLeave) {
        // 1. Tell our safety net from earlier that it's okay to leave
        isSafeToLeave = true; 
        
        // 2. Execute the back navigation
        history.back();
    }
    // If they click "Cancel" on the popup, the function just ends and they stay on the page!
}

// ==========================================
// 7. DELETE RECIPE LOGIC (Safety Net)
// ==========================================
let deleteBtn = document.getElementById('deleteRecipeBtn');

if(deleteBtn) {
    deleteBtn.addEventListener('click', function() {
        
        // --- UX Best Practice: Double-Confirmation Alert ---
        // Native browser confirmation popup (Are you sure?)
        let userWantsToDelete = confirm("WARNING: Are you sure you want to delete this recipe PERMANENTLY? This cannot be undone.");
        
        if(userWantsToDelete) {
            
            // 1. Get the current recipe ID from the URL parameter (e.g., ?id=901)
            let urlParams = new URLSearchParams(window.location.search);
            let recipeIdToDelete = parseInt(urlParams.get('id'));

            // Safety check: Don't do anything if we can't find the ID!
            if(!recipeIdToDelete) {
                alert("Error: Could not identify which recipe to delete.");
                return;
            }

            // 2. Load our "mini-database" array from localStorage
            let myCustomRecipes = JSON.parse(localStorage.getItem('myCustomRecipes')) || [];

            // 3. Delete the specific recipe using .filter()
            // We create a new array that includes EVERY recipe EXCEPT the one that matches our ID
            let updatedRecipes = myCustomRecipes.filter(function(recipe) {
                return recipe.id !== recipeIdToDelete; 
            });

            // 4. Save the new, smaller array back to localStorage
            localStorage.setItem('myCustomRecipes', JSON.stringify(updatedRecipes));

            alert("Recipe deleted successfully!");

            // --- IMPORTANT: Safety Net Bypasses ---
            // Tell our 'unsaved changes' alert (beforeunload) that it's safe to leave!
            // isSafeToLeave should be defined higher up in your JS file!
            isSafeToLeave = true; 

            // Redirect the user back to the custom recipes gallery 
            // .replace is best here so they can't click "back" to a deleted recipe!
            window.location.replace("custom-recipes.html");
        }
        // If they click "Cancel" on the alert, the function ends and they stay safely on the page.
    });
}

// ==========================================
// DYNAMIC BREADCRUMB ROUTER
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    // 1. Grab the origin (e.g., CUSTOM RECIPES)
    let origin = localStorage.getItem('recipeOrigin') || 'VIEW ALL RECIPES';
    
    // 2. Grab our new path crumb (Did they click 'create' or 'customize'?)
    let editPath = localStorage.getItem('editPath') || 'create';
    
    let breadcrumb = document.getElementById('dynamic-breadcrumb');
    
    // 3. Build the accurate trail based on the path!
    if (breadcrumb) {
        if (editPath === 'customize') {
            // If they came from an existing recipe:
            breadcrumb.innerText = "NUTRITION PLANNER / " + origin + " / RECIPE DETAILS / EDIT RECIPE";
        } else {
            // If they clicked the blank Create New card:
            breadcrumb.innerText = "NUTRITION PLANNER / " + origin + " / CREATE NEW RECIPE";
        }
    }
    
    // ==========================================
    // DYNAMIC EDIT DATA PRE-FILL
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const recipeIdString = urlParams.get('id');

    if (recipeIdString) {
        const recipeId = parseInt(recipeIdString);
        let recipe = null;

        // Search Area A: Look in the Main Mock Database first
        if (typeof recipeDatabase !== 'undefined') {
            recipe = recipeDatabase.find(r => r.id === recipeId);
        }

        // Search Area B: If not found, look in our Custom Mini-Database!
        if (!recipe) {
            let myCustomRecipes = JSON.parse(localStorage.getItem('myCustomRecipes')) || [];
            recipe = myCustomRecipes.find(r => r.id === recipeId);
        }

        // If we found it in EITHER place, pre-fill the form!
        if (recipe) {
            // 1. Inject the Recipe Name
            let nameInput = document.getElementById('editRecipeName');
            if (nameInput) {
                // Smart check: Only add "(My Version)" if it doesn't already have it!
                if (recipe.name.includes("(My Version)")) {
                    nameInput.value = recipe.name;
                } else {
                    nameInput.value = recipe.name + " (My Version)";
                }
            }

            // 2. Inject the Recipe Image
            let imagePreview = document.getElementById('recipeImagePreview');
            if (imagePreview) imagePreview.src = recipe.image;

            // 3. Inject the Prep Time
            let prepInput = document.getElementById('editPrepTime');
            if (prepInput) {
                prepInput.value = parseInt(recipe.prepTime);
            }
        }
    }
});

// Initial setup on page load
updateStepNumbers();
recalculateMacros(); 