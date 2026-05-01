let isEditMode = false;
let currentActivity = null;

function initializePage() {
    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const activityId = urlParams.get('id');
        const isEditMode = urlParams.get('isEdit') === "1";

        const activityList = getMockActivity();
        currentActivity = activityList.find(a => String(a.id) === activityId);

        if (currentActivity) {
            renderViewMode();
        } else {
            alert("Activity not found!");
            window.location.href = 'tracker.html';
        }
        console.log(isEditMode);
        if(isEditMode){
           toggleEditMode()
        }

        let trackerNav = document.getElementById('trackerNav');
        trackerNav.classList.add('active');
    });
}

function renderViewMode() {
    document.getElementById('viewName').innerText = currentActivity.name;
    document.getElementById('viewCategory').innerText = currentActivity.type;
    document.getElementById('viewDuration').innerHTML = `${currentActivity.duration} <span class="fs-6 fw-normal">min</span>`;
    document.getElementById('viewIntensity').innerText = currentActivity.intensity;
    document.getElementById('viewNotes').innerText = currentActivity.notes || "No notes.";
    document.getElementById('viewDate').innerText = currentActivity.date;
    document.getElementById('viewDateDisplay').innerText = currentActivity.date;
    document.getElementById('viewCalories').innerHTML = `${currentActivity.calories} <span class="fs-6 fw-normal">kcal</span>`;


    document.getElementById('actionButtons').innerHTML = `
        <button onclick="toggleEditMode()" class="btn btn-outline-secondary border-sand text-olive btn-sm rounded-pill px-3">
            <i class="fa-solid fa-pencil me-1"></i> Edit Details
        </button>
    `;
    renderGallery(currentActivity.images);
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    const viewIds = ['nameViewContainer', 'durationViewContainer', 'intensityViewContainer', 'viewNotes'];
    const editIds = ['nameEditContainer', 'durationEditContainer', 'intensityEditContainer', 'notesEditContainer', 'imageEditContainer'];

    if (isEditMode) {
        document.getElementById('editName').value = currentActivity.name;
        document.getElementById('editDuration').value = currentActivity.duration;
        document.getElementById('editNotes').value = currentActivity.notes;
        document.getElementById('editIntensity').value = currentActivity.intensity;

        viewIds.forEach(id => document.getElementById(id).classList.add('d-none'));
        editIds.forEach(id => document.getElementById(id).classList.remove('d-none'));

        document.getElementById('actionButtons').innerHTML = `
            <button onclick="saveChanges()" class="btn btn-success btn-sm rounded-pill px-3 me-2"><i class="fa-solid fa-check me-1"></i> Save</button>
            <button onclick="location.reload()" class="btn btn-light btn-sm rounded-pill px-3">Cancel</button>
        `;
    }
    renderGallery(currentActivity.images); // Re-render to show/hide delete buttons
}

function handleFileUpload(input) {
    if (input.files && input.files.length > 0) {
        if (!currentActivity.images) currentActivity.images = [];

        // Convert FileList to an Array and loop through each file
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();

            reader.onload = function(e) {
                currentActivity.images.push(e.target.result);
                // Re-render the gallery after each image is loaded
                renderGallery(currentActivity.images);
            };

            reader.readAsDataURL(file);
        });

        input.value = ''; // Clear input so the same files can be re-selected if needed
    }
}

function deleteImage(index) {
    if (confirm("This photo will be removed forever")) {
        currentActivity.images.splice(index, 1);
        renderGallery(currentActivity.images);
    }
}

function saveChanges() {
    const activityList = JSON.parse(localStorage.getItem('activities')) || getMockActivity();
    const index = activityList.findIndex(a => String(a.id) === String(currentActivity.id));

    if (index !== -1) {
        // Update the currentActivity object in memory
        currentActivity.name = document.getElementById('editName').value;
        currentActivity.duration = document.getElementById('editDuration').value;
        currentActivity.notes = document.getElementById('editNotes').value;
        currentActivity.intensity = document.getElementById('editIntensity').value;
        // currentActivity.images is already updated by handleFileUpload/deleteImage

        // Update the main list and save to LocalStorage
        activityList[index] = { ...currentActivity };
        localStorage.setItem('activities', JSON.stringify(activityList));

        // Close edit mode and refresh UI labels
        closeEditMode();
    }
}

function closeEditMode() {
    // 1. Reset the state variable
    isEditMode = false;

    // 2. Update the View Mode labels with the NEW data from currentActivity
    document.getElementById('viewName').innerText = currentActivity.name;
    document.getElementById('viewDuration').innerHTML = `${currentActivity.duration} <span class="fs-6 fw-normal">min</span>`;
    document.getElementById('viewIntensity').innerText = currentActivity.intensity;
    document.getElementById('viewNotes').innerText = currentActivity.notes || "No notes.";

    // 3. Swap the containers (Hide Edit, Show View)
    const viewIds = ['nameViewContainer', 'durationViewContainer', 'intensityViewContainer', 'viewNotes'];
    const editIds = ['nameEditContainer', 'durationEditContainer', 'intensityEditContainer', 'notesEditContainer', 'imageEditContainer'];

    viewIds.forEach(id => document.getElementById(id).classList.remove('d-none'));
    editIds.forEach(id => document.getElementById(id).classList.add('d-none'));

    // 4. Reset the Action Buttons back to "Edit Details"
    document.getElementById('actionButtons').innerHTML = `
        <button onclick="toggleEditMode()" class="btn btn-outline-secondary border-sand text-olive btn-sm rounded-pill px-3">
            <i class="fa-solid fa-pencil me-1"></i> Edit Details
        </button>
    `;

    // 5. Re-render gallery to hide the delete trash icons
    renderGallery(currentActivity.images);
}

function renderGallery(images) {
    const gallery = document.getElementById('viewGallery');
    const photoCount = document.getElementById('photoCount');
    gallery.innerHTML = '';

    if (images && images.length > 0) {
        photoCount.innerText = `${images.length} Photos`;
        images.forEach((photo, index) => {
            gallery.innerHTML += `
                <div class="col-6">
                    <div class="gallery-img-container">
                        <img src="${photo}" class="gallery-img shadow-sm">
                        <div id="image${index}" class="delete-overlay ${isEditMode ? 'active' : ''}" onclick="deleteImage(${index})">
                            <i class="fa-solid fa-trash-can text-white fs-4"></i>
                        </div>
                    </div>
                </div>`;
        });
    } else {
        photoCount.innerText = "0 Photos";
        gallery.innerHTML = '<p class="text-muted p-4">No photos for this session.</p>';
    }
}

function getMockActivity(){
    function newActivity(id, name, type, date, duration,intensity, images, notes){
        return {
            id:id,
            name: name,
            type: type,
            date: date,
            duration: duration,
            calories: Math.floor(Math.random() * (1000 - 300 + 1)) + 300,
            images: images,
            intensity: intensity,
            notes: notes
        }
    }
    return [
        newActivity(
            0,                // Unique ID using timestamp
            "Morning KLCC Run",         // Name
            "Running",                  // Type
            "2026-04-28",               // Date
            45,                         // Duration
            "High",                     // Intensity
            ["../images/mock/KlccRunMock1.jpg", "../images/mock/KlccRunMock2.jpg" ], // Image Array
            "Great weather today at the park! Managed to beat my personal best." // Notes
        ),
        newActivity(
            1,             // Unique ID (offset to ensure uniqueness)
            "Sunset Yoga Session",      // Name
            "Yoga",                     // Type
            "2026-04-29",               // Date
            60,                         // Duration
            "Low",                      // Intensity
            ["../images/mock/yoga1.jpg"], // Image Array
            "Focused on flexibility and breathing. Felt very relaxed afterward." // Notes
        )
    ]
}

initializePage();