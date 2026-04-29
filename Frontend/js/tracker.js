const historyTable = document.getElementById('historyTableBody');
let activityList

fillHistoryTable()

async function fillHistoryTable(){
    activityList = await getActivityHistory()
    historyTable.innerHTML = ""
    for(let activity of activityList){
        historyTable.innerHTML += newHistoryTableElement(activity)
    }
}

async function getActivityHistory() {
    // Mock for now later replace with real loading logic from backend
    return [
        newActivity(1, "Morning Jog", "Cardio", "2026-04-25", 30),
        newActivity(2, "UM Gym Session", "Strength", "2026-04-26", 60),
        newActivity(3, "Evening Walk", "Light", "2026-04-27", 20),
        newActivity(4, "Swim Practice", "Cardio", "2026-04-28", 45),
        newActivity(5, "Upper Body Power", "Strength", "2026-04-29", 50),
        // Additional 5 entries
        newActivity(6, "Futsal with Friends", "Cardio", "2026-04-24", 90),
        newActivity(7, "Yoga Session", "Light", "2026-04-23", 40),
        newActivity(8, "Leg Day (Squats)", "Strength", "2026-04-22", 75),
        newActivity(9, "Cycling (UM Campus)", "Cardio", "2026-04-21", 55),
        newActivity(10, "Stretching & Mobility", "Light", "2026-04-20", 15)
    ];
}

function newHistoryTableElement(activity){
    return `<tr>
                <td>
                    <span class="fw-bold text-olive">${activity.name}</span>
                    <br><small class="text-muted">${activity.type}</small>
                </td>
                <td class="text-muted">${activity.date}</td>
                <td class="fw-medium">${activity.duration}</td>
                <td class="text-end">
                    <button id="activity-button-${activity.id}" class="btn btn-sm text-olive"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm text-danger"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `
}

function newActivity(id, name, type, date, duration){
    return {
        id:id,
        name: name,
        type: type,
        date: date,
        duration: duration
    }
}