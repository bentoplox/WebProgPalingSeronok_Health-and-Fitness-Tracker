//Wait for the HTML to fully load before running any scripts
document.addEventListener('DOMContentLoaded', () => {


//1. Signup logic
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
        //Stop the form from automatically reloading the page
        event.preventDefault();

        //Redirect the user to the Setup Profile page
        console.log("Account created! Moving to profile setup...")
        window.location.href = 'setup-profile.html';
    });
}

//2. Profile setup logic
const setupForm = document.getElementById('setupForm');

if (setupForm) {
    setupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        //Grab the user's data here (later)
        //const userGoal = document.getElementById('userGoal').value;
        //localStorage.setItem('flowState_userGoal', userGoal);

        console.log("Setup complete! Redirecting to login...")
        window.location.href = 'login.html';
    });
}

//3. Login logic
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        console.log("Login successful! Redirecting to dashboard...")
        window.location.href = 'dashboard.html';
    });
}

//4. Forgot password logic (DUMMY feature)
const forgotForm = document.getElementById('forgotForm');
const sucessMessage = document.getElementById('sucessMessage');
const resetDescription = document.getElementById('resetDescription');

if (forgotForm) {
    forgotForm.addEventListener('submit', function(event) {
        event.preventDefault();

        //Hide the input form and the description text
        forgotForm.classList.add('d-none');
        resetDescription.classList.add('d-none');

        //Show the green success message
        sucessMessage.classList.remove('d-none');
    });
}

});
