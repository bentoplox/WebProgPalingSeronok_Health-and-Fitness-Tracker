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
    saveBtn.addEventListener('click', function() {
        // Native browser confirmation popup
        let isConfirmed = confirm("Are you sure you want to save these changes to your custom recipe?");
        
        if(isConfirmed) {
            // Here is where you would normally save to localStorage or a database.
            alert("Recipe saved successfully!");
            
            // Redirect the user back to the custom recipes page 
            // Use .replace sbb it overwrites the history state so the user can't accidentally "go back" to the editor
            window.location.replace("custom-recipes.html");
        }
    });
}

// Initial setup on page load
updateStepNumbers();
recalculateMacros(); 