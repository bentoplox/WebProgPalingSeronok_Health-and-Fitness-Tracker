const historyTable = document.getElementById('historyTableBody');
let selectedFiles = [];

document.getElementById('activityDate').valueAsDate = new Date();

let activityList = getMockActivity()
let goals = getMockGoals()
fillHistoryTable()
initializeFormSubmission()
renderGoals();

async function fillHistoryTable(){
    historyTable.innerHTML = ""
    for(let activity of activityList){
        historyTable.innerHTML += newHistoryTableElement(activity)
    }
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

function viewActivity(id) {
    window.location.href = `../html/activity-details.html?id=${id}&isEdit=0`;
}

function editActivity(id) {
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

    if (selectedFiles.length > 0) {
        clearBtn.classList.remove('d-none');
    }

    gallery.innerHTML = "";

    renderGallery()
}

function removeSinglePhoto(index) {
    selectedFiles.splice(index, 1);

    const gallery = document.getElementById('imageGalleryPreview');
    if (selectedFiles.length === 0) {
        document.getElementById('clearPhotosBtn').classList.add('d-none');
        document.getElementById('workoutPhotos').value = "";
    }

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
        e.preventDefault();

        let name = document.getElementById('activityName').value
        let type = document.getElementById('selectedActivityType').value
        let intensity = getIntensityByIndex(document.querySelector('input[name="intensity"]:checked').value)
        let duration = document.querySelector('input[placeholder="0"]').value
        let date = document.getElementById('activityDate').value
        let notes = document.querySelector('textarea').value
        let photos = selectedFiles

        let activityData = newActivity(activityList.size, name, type, date, duration, intensity, photos, notes)

        console.log("Form Data Collected:", activityData);

        if (!activityData.type) {
            alert("Please select an activity type!");
            return;
        }

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

function newGoal(id, category, target){
    return {
        id: id,
        category: category,
        target: target
    }
}

function addGoal() {
    const catSelect = document.getElementById('goalCategory');
    const targetInput = document.getElementById('goalTarget');

    if (!catSelect.value || targetInput.value.trim() === '') {
        alert('Please select a category and enter a target.');
        return;
    }

    const goal = newGoal(Date.now(), catSelect.value, targetInput.value);

    goals.push(goal);

    catSelect.selectedIndex = 0;
    targetInput.value = '';
    const modalElement = document.getElementById('goalModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    renderGoals();
}

function deleteGoal(id) {
    goals = goals.filter(g => g.id !== id);
    renderGoals();
}

function renderGoals() {
    const container = document.getElementById('goalsContainer');
    container.innerHTML = '';

    goals.forEach(goal => {
        container.innerHTML += `
        <div class="col-md-4">
          <div class="goal-card-item p-3">
            <div class="d-flex justify-content-between">
                <p class="text-uppercase text-muted mb-1" style="font-size: 0.6rem;">Goal</p>
                <button class="btn btn-sm text-danger p-0 border-0" onclick="deleteGoal(${goal.id})">
                    <i class="bi bi-x-circle"></i>
                </button>
            </div>
            <h6 class="fw-bold text-olive mb-1">${goal.category}</h6>
            <p class="text-muted small mb-0">${goal.target} Sessions</p>
          </div>
        </div>`;
    });

    container.innerHTML += `
      <div class="col-md-4">
        <div class="add-goal-placeholder" data-bs-toggle="modal" data-bs-target="#goalModal">
          <i class="bi bi-plus-circle fs-4 mb-1"></i>
          <span class="small fw-bold">Add Weekly Goal</span>
        </div>
      </div>`;
}

function selectType(type, icon) {
    document.getElementById('selectedActivityType').value = type;
    document.getElementById('typeDropdown').innerHTML = `<i class="bi ${icon} me-2"></i> ${type}`;
}



function resetForm() {
    document.getElementById('activityForm').reset();
    document.getElementById('typeDropdown').innerHTML = '<i class="bi bi-tag me-2"></i> Select Type';
    document.getElementById('selectedActivityType').value = "";

    selectedFiles = [];
    document.getElementById('imageGalleryPreview').innerHTML = "";
    document.getElementById('clearPhotosBtn').classList.add('d-none');
}

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
            0,
            "Morning KLCC Run",
            "Running",
            "2026-04-28",
            45,
            "High",
            ["../images/mock/KlccRunMock1.jpg", "../images/mock/KlccRunMock2.jpg" ],
            "Great weather today at the park! Managed to beat my personal best."
        ),
        newActivity(
            1,
            "Sunset Yoga Session",
            "Yoga",
            "2026-04-29",
            60,
            "Low",
            ["../images/mock/yoga1.jpg"],
            "Focused on flexibility and breathing. Felt very relaxed afterward."
        )
    ]
}

function getMockGoals(){
    return [
        newGoal(1, 'Running', 3),
        newGoal(2, 'Weightlifting', 4),
        newGoal(3, 'Yoga/Pilates', 2)
    ];
}