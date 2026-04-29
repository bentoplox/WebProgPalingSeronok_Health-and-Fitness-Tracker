const historyTable = document.getElementById('historyTableBody');
let selectedFiles = [];

document.getElementById('activityDate').valueAsDate = new Date();

let activityList
fetchActivityHistory()
fillHistoryTable()
initializeFormSubmission()

//Data Related Functions
async function fillHistoryTable(){
    historyTable.innerHTML = ""
    for(let activity of activityList){
        historyTable.innerHTML += newHistoryTableElement(activity)
    }
}

async function fetchActivityHistory() {
    // mock for now later replace with real loading logic from backend
    activityList = getMockActivity()
}

function newHistoryTableElement(activity) {
    return `<tr>
                <td>
                    <span class="fw-bold text-olive" style="cursor:pointer; text-decoration: underline;" 
                          onclick="viewActivity(${activity.id})">
                        ${activity.name}
                    </span>
                    <br><small class="text-muted">${activity.type}</small>
                </td>
                <td class="text-muted">${activity.date}</td>
                <td class="fw-medium">${activity.duration}</td>
                <td class="fw-medium">${activity.calories}</td>
                <td class="fw-medium">${activity.intensity}</td>
                <td class="text-end">
                    <button class="btn btn-sm text-olive" onclick="editActivity(${activity.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm text-danger" onclick="removeActivity(${activity.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
}

// Navigation Helpers
function viewActivity(id) {
    window.location.href = `../html/activity-details.html?id=${id}&isEdit=0`;
}

function editActivity(id) {
    // You can use the same logic for your edit page
    window.location.href = `../html/activity-details.html?id=${id}&isEdit=1`;
}
function newActivity(id, name, type, date, duration,intensity, images, notes){
    return {
        id:id,
        name: name,
        type: type,
        date: date,
        duration: duration,
        calories: getCaloriesBurned(type, intensity, duration),
        images: images,
        intensity: intensity,
        notes: notes
    }
}

function previewMultipleImages(event) {
    const gallery = document.getElementById('imageGalleryPreview');
    const clearBtn = document.getElementById('clearPhotosBtn');
    const newFiles = Array.from(event.target.files);


    selectedFiles = [...selectedFiles, ...newFiles];

    // Show the clear button if we have files
    if (selectedFiles.length > 0) {
        clearBtn.classList.remove('d-none');
    }

    gallery.innerHTML = "";

    renderGallery()
}

// 4. Function to remove just one specific photo
function removeSinglePhoto(index) {
    selectedFiles.splice(index, 1); // Remove from array

    // Manually trigger a UI refresh by faking an "empty" event
    const gallery = document.getElementById('imageGalleryPreview');
    if (selectedFiles.length === 0) {
        document.getElementById('clearPhotosBtn').classList.add('d-none');
        document.getElementById('workoutPhotos').value = "";
    }

    // Re-render the gallery
    renderGallery();
}

function renderGallery() {
    const gallery = document.getElementById('imageGalleryPreview');
    gallery.innerHTML = "";
    selectedFiles.forEach((file, index) => {
        console.log("Adding image " + (index + 1));
        const reader = new FileReader();
        reader.onload = function(e) {
            const wrapper = document.createElement('div');
            wrapper.className = "position-relative";
            wrapper.innerHTML = `
                <img src="${e.target.result}" class="img-thumbnail" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                      onclick="removeSinglePhoto(${index})" style="cursor:pointer;">
                    &times;
                </span>
            `;
            gallery.appendChild(wrapper);
        }
        reader.readAsDataURL(file);
    });
}

function clearAllPhotos() {
    document.getElementById('workoutPhotos').value = "";
    document.getElementById('imageGalleryPreview').innerHTML = "";
    document.getElementById('clearPhotosBtn').classList.add('d-none');
}

function initializeFormSubmission(){
    document.getElementById('activityForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Stop page from refreshing

        let name = document.getElementById('activityName').value
        let type = document.getElementById('selectedActivityType').value
        let intensity = getIntensityByIndex(document.querySelector('input[name="intensity"]:checked').value)
        let duration = document.querySelector('input[placeholder="0"]').value // Better to add an ID to this input
        let date = document.getElementById('activityDate').value
        let notes = document.querySelector('textarea').value
        // 2. Attach your global files array
        let photos = selectedFiles

        let activityData = newActivity(activityList.size, name, type, date, duration, intensity, photos, notes)

        console.log("Form Data Collected:", activityData);

        // 3. Validation Check
        if (!activityData.type) {
            alert("Please select an activity type!");
            return;
        }

        // 4. Send to your Save Function
        saveActivity(activityData);
    });
}

function saveActivity(activityData){
    console.log("saving activity data:", activityData);
    activityList.push(activityData);
    console.log("new activity list: ");
    for(let activity of activityList){
        console.log(activity)
    }
    resetForm()
    fillHistoryTable()
}

function removeActivity(id){
    let index = activityList.findIndex(activity => activity.id === id);
    activityList.splice(index, 1);
    fillHistoryTable()
}


//UI functions//
function resetForm() {
    document.getElementById('activityForm').reset(); // Clears text inputs
    document.getElementById('typeDropdown').innerHTML = '<i class="bi bi-tag me-2"></i> Select Type';
    document.getElementById('selectedActivityType').value = "";

    // Clear our photo logic
    selectedFiles = [];
    document.getElementById('imageGalleryPreview').innerHTML = "";
    document.getElementById('clearPhotosBtn').classList.add('d-none');
}

function selectType(type, iconClass) {
    // 1. Get references to the UI elements
    const btn = document.getElementById('typeDropdown');
    const hiddenInput = document.getElementById('selectedActivityType');

    // 2. Update the button's look so the user sees their choice
    // We use innerHTML to include the Bootstrap Icon
    btn.innerHTML = `<i class="bi ${iconClass} me-2"></i> ${type}`;

    // 3. Store the actual value in the hidden input for the form submission
    hiddenInput.value = type;

    console.log("Selected Activity:", type); // Check your console to see this!
}

// Utils
function getIntensityByIndex(index){
    switch (index) {
        case "1":
            return "LOW"
        case "2":
            return "MEDIUM"
        case "3":
            return "HIGH"
        default:
            return "UNKNOWN"
    }
}

function getCaloriesBurned(activityType , intensity, duration){
    return Math.floor(Math.random() * (1000 - 300 + 1)) + 300;
}

//mock Data Functions
function getMockActivity(){
    function newActivity(id, name, type, date, duration,intensity, images, notes){
        return {
            id:id,
            name: name,
            type: type,
            date: date,
            duration: duration,
            calories: getCaloriesBurned(type, intensity, duration),
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
            ["../images/mock/run1.jpg", "../images/mock/run2.jpg"], // Image Array
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