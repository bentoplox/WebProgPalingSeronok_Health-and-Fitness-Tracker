// Hardcoded to 1 for this specific prototype page (Hummus Avocado Toast)
const currentRecipeId = 1; 

// 1. Function to check memory and paint the UI on page load
function checkFavoriteState() {
    // Grab the shared memory we created in nutrition.js
    let savedFavorites = JSON.parse(localStorage.getItem('userFavorites')) || [];
    
    // Grab our HTML elements
    let favBtn = document.getElementById('detailsFavBtn');
    let favIcon = document.getElementById('detailsFavIcon');
    let favText = document.getElementById('detailsFavText');

    // Safety check in case the elements aren't on the page
    if (!favBtn) return;

    if (savedFavorites.includes(currentRecipeId)) {
        // IT IS SAVED: Make it solid pink, change icon to solid, update text
        favBtn.className = "btn btn-pink w-100 mb-2";
        favIcon.className = "fa-solid fa-heart";
        favText.innerText = " Saved to Favorites";
    } else {
        // NOT SAVED: Make it outline pink, change icon to outline, update text
        favBtn.className = "btn btn-outline-pink w-100 mb-2";
        favIcon.className = "fa-regular fa-heart";
        favText.innerText = " Save to Favorites";
    }
}

// 2. Function to handle the user clicking the button
function toggleRecipeDetailsFavorite() {
    let savedFavorites = JSON.parse(localStorage.getItem('userFavorites')) || [];
    let index = savedFavorites.indexOf(currentRecipeId);

    if (index === -1) {
        // Add to array if not found
        savedFavorites.push(currentRecipeId);
    } else {
        // Remove from array if already there
        savedFavorites.splice(index, 1);
    }

    // Save back to memory
    localStorage.setItem('userFavorites', JSON.stringify(savedFavorites));
    
    // Immediately re-run the UI check to change the colors!
    checkFavoriteState(); 
}

// FUNCTION TO HANDLE DYNAMIC ROUTING
function setupBackButton() {
    let backBtn = document.getElementById('dynamicBackBtn');
    let backText = document.getElementById('backBtnText');

    // Safety check
    if (!backBtn) return;

    // document.referrer holds the URL of the page the user just came from
    let previousPage = document.referrer;

    // THE NEW TAB TRAP: If a user copied and pasted the link, or opened it in a new tab, 
    // the referrer will be empty. We must provide a fallback!
    if (previousPage) {
        // Set the link to point exactly where they came from
        backBtn.href = previousPage;

        // Make the UI text feel smart and contextual
        if (previousPage.includes("saved-recipes")) {
            backText.innerText = "Back to Saved Recipes";
        } else if (previousPage.includes("custom-recipes")) {
            backText.innerText = "Back to Custom Recipes";
        } else {
            backText.innerText = "Back to Planner";
        }
    } else {
        // FALLBACK: Route them safely to the main hub if there is no history
        backBtn.href = "nutrition.html";
        backText.innerText = "Back to Planner";
    }
}

// Run the setup functions immediately when the page loads
checkFavoriteState();
setupBackButton();