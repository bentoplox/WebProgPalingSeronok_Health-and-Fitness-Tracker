let user
let nameView = document.getElementById('viewFullName')
let nameEdit = document.getElementById('editFullName')
let usernameView = document.getElementById('viewUsername')
let usernameEdit = document.getElementById('editUsername')
let emailView = document.getElementById('viewEmail')
let emailEdit = document.getElementById('editEmail')
let tagView = document.getElementById('viewTag')
let tagEdit= document.getElementById('editTag')
let bioEdit = document.getElementById('editBio')
let passwordView = document.getElementById('viewPassword')
let passwordEdit = document.getElementById('editPassword')
let profilePictureView = document.getElementById("profilePicture")
let profilePictureContainer = document.getElementById("profilePictureContainer")
let isEditMode
let tempValue

initializePage()
setupEditAndSaveButton()
async function initializePage(){
    user = getMockUser()
    fillProfile()
    const lockIcon = document.getElementById('hideButton');

    lockIcon.addEventListener('click', function() {
        // Toggle between a lock and an unlock icon
        if(!isEditMode){
            return
        }

        if (this.classList.contains('fa-lock')) {
            this.classList.replace('fa-lock', 'fa-lock-open');
            console.log("Element Unlocked");
            showPassword()
        } else {
            this.classList.replace('fa-lock-open', 'fa-lock');
            console.log("Element Locked");
            hidePassword()

        }
    });

}
function setupEditAndSaveButton(){
    document.addEventListener('DOMContentLoaded', function() {
        user = getMockUser()
        const editBtn = document.getElementById('editProfileBtn');
        isEditMode = false;

        // Define all pairs of View Containers vs Actual Input IDs
        const fieldMap = [
            { viewId: 'nameViewContainer', editId: 'editFullName' },
            { viewId: 'usernameViewContainer', editId: 'editUsername' },
            { viewId: 'emailViewContainer', editId: 'editEmail' },
            { viewId: 'passwordViewContainer', editId: 'editPassword' },
            { viewId: 'tagViewContainer', editId: 'editTag' }
        ];

        const bioTextarea = document.getElementById('editBio');

        editBtn.addEventListener('click', function() {
            isEditMode = !isEditMode;

            if (isEditMode) {
                editBtn.innerHTML = '<i class="fa-solid fa-floppy-disk me-2"></i>Save Changes';
                editBtn.classList.replace('btn-success', 'btn-primary');

                fieldMap.forEach(field => {
                    const viewEl = document.getElementById(field.viewId);
                    const editEl = document.getElementById(field.editId);
                    viewEl.classList.add('d-none');
                    editEl.parentElement.classList.remove('d-none');

                    // Apply the 'Obvious' style immediately
                    editEl.classList.add('is-editing');
                });

                emailView.classList.add('d-flex');
                passwordView.classList.add('d-flex');

                // Special handling for Bio
                bioTextarea.removeAttribute('readonly');
                bioTextarea.classList.add('is-editing');

                fillEditFields()

            } else {
                console.log("Is Edit Mode = " + isEditMode);
                updateUser().then(()=>{
                    fillProfile()
                    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square me-2"></i>Edit Profile';
                    editBtn.classList.replace('btn-primary', 'btn-success');

                    fieldMap.forEach(field => {
                        const viewEl = document.getElementById(field.viewId);
                        const editEl = document.getElementById(field.editId);

                        // Toggle visibility back
                        viewEl.classList.remove('d-none');
                        editEl.parentElement.classList.add('d-none');

                        // Remove the 'Obvious' style
                        editEl.classList.remove('is-editing');
                    });

                    bioTextarea.setAttribute('readonly', true);
                    bioTextarea.classList.remove('is-editing');

                    console.log(user.profilePictureURl)
                })
            }
        });


    });
}

function fillProfile() {
    nameView.innerText = user.name
    usernameView.innerText = user.username
    document.getElementById('heroName').innerText = user.username;
    document.getElementById('heroName').innerText = user.username;
    emailView.innerText = user.email
    tagView.innerText = user.tag
    bioEdit.innerText = user.bio
    passwordView.innerText = "*".repeat(user.password.length)

    profilePictureContainer.innerHTML = `
                        <img id = "profilePicture" src="${user.profilePictureURl}"
                            class="profile-avatar shadow-lg"
                            alt="Upload Profile Picture">`
    // Update the Hero Name at the top


    console.log("Changes reflected in UI.");
}

async function updateUser(){
    user.name = nameEdit.value;
    user.username = usernameEdit.value;
    user.email = emailEdit.value;
    user.tag = tagEdit.value;
    user.password = passwordEdit.value;
    user.profilePictureURl = document.getElementById("profilePicture").src
    user.bio = bioEdit.value;
}
function getMockUser(){
    return createUser("Hazim Nidzam", "hzmnzn1234", "hzmnzm@gmail.com", "I am 22 years old", "Um Student", "hazim1234", "../images/mock/ProfilePicture.jpg")
}

function createUser(name, username, email, bio,  tag, password, profilePictureUrl){
    return {
        "name" : name,
        "username" : username,
        "email" : email,
        "tag" : tag,
        "bio" : bio,
        "password" : password,
        "profilePictureURl" : profilePictureUrl
    };
}

function updateProfilePicture(event){
    let image = event.target.files[0]
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("profilePicture").src = e.target.result
    }
    reader.readAsDataURL(image);
}

function hidePassword(){
    passwordEdit.type = "password"
}

function showPassword(){
    passwordEdit.type = "text"
}

function fillEditFields(){
    nameEdit.value = user.name;
    usernameEdit.value = user.username;
    emailEdit.value = user.email;
    tagEdit.value = user.tag;
    bioEdit.value = user.bio;
    passwordEdit.value = user.password;
    profilePictureContainer.innerHTML = `
                    <label for="file-upload" style="cursor: pointer;">
                        <img id = "profilePicture" src="${user.profilePictureURl}"
                            class="profile-avatar shadow-lg"
                            alt="Upload Profile Picture">
                    </label>

                    <input id="file-upload" type="file" style="display: none;" accept="image/*" onchange="updateProfilePicture(event)">`
}

