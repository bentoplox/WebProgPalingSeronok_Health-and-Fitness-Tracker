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
    if (!age || !height || !weight || !genderElement || !activityElement) {
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

}