const API_URL = "https://job-application-tracker-qx1m.onrender.com/api/applications";
let applications = [];
let editingId = null;


function showForm() {
    const form = document.getElementById("applicationForm");
    form.style.display = "block";
}

document.getElementById("jobForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const application = {
        company: document.getElementById("company").value,
        role: document.getElementById("role").value,
        location: document.getElementById("location").value,
        salary: document.getElementById("salary").value,
        status: document.getElementById("status").value
    };

    try {

        let response;

        if (editingId === null) {

            // ADD new application
            response = await fetch(
                API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(application)
                }
            );

        } else {

            // UPDATE existing application
            response = await fetch(
                `${API_URL}/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(application)
                }
            );

        }

        const data = await response.json();

        console.log(data);

        if (editingId === null) {
            alert("Application added successfully!");
        } else {
            alert("Application updated successfully!");
        }

        editingId = null;

        this.reset();

        document.getElementById("applicationForm").style.display = "none";

        loadApplications();

    } catch (error) {

        console.log(error);

        alert("Failed to save application.");

    }

});


function displayApplications(data = applications) {

    const list = document.getElementById("applicationList");

    list.innerHTML = "";
    if (data.length === 0) {
    list.innerHTML = `
        <div class="empty-state">
            <h3>No applications found</h3>
            <p>Start tracking your job applications by adding one.</p>
        </div>
    `;
        updateStats();
        return;
    }

    data.forEach(function(app, index) {

        const div = document.createElement("div");

        div.className = "application-card";

        div.innerHTML = `
            <h3>${app.company}</h3>

            <p><strong>Role:</strong> ${app.role}</p>

            <p><strong>Location:</strong> ${app.location}</p>

            <p><strong>Salary:</strong> ${app.salary}</p>

            <p><strong>Status:</strong>
                 <span class="status-badge status-${app.status.toLowerCase().replace(" ", "-")}">${app.status}</span>
            </p>

            <button class="edit-btn" onclick="editApplication('${app._id}')">
                Edit
            </button>

            <button class="delete-btn" onclick="deleteApplication('${app._id}')">
                Delete
            </button>
        `;

        list.appendChild(div);
    });
    updateStats();
}


function updateStats() {

    // Total applications
    document.getElementById("totalApplications").innerText =
        applications.length;


    // Count Interviews
    const interviewCount = applications.filter(function(app) {
        return app.status === "Interview";
    }).length;


    // Count Selected
    const selectedCount = applications.filter(function(app) {
        return app.status === "Selected";
    }).length;


    // Count Rejected
    const rejectedCount = applications.filter(function(app) {
        return app.status === "Rejected";
    }).length;


    // Show the numbers on dashboard
    document.getElementById("interviews").innerText = interviewCount;

    document.getElementById("selected").innerText = selectedCount;

    document.getElementById("rejected").innerText = rejectedCount;
}


async function deleteApplication(id) {

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        console.log(data);

        alert("Application deleted successfully!");

        loadApplications();

    } catch (error) {

        console.log(error);

        alert("Failed to delete application.");

    }

}

function editApplication(id) {

    const app = applications.find(function(application) {
        return application._id === id;
    });

    document.getElementById("company").value = app.company;
    document.getElementById("role").value = app.role;
    document.getElementById("location").value = app.location;
    document.getElementById("salary").value = app.salary;
    document.getElementById("status").value = app.status;

    editingId = id;

    document.getElementById("applicationForm").style.display = "block";
}

function filterApplications() {

    const searchText = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const selectedStatus = document
        .getElementById("statusFilter")
        .value;

    const filteredApplications = applications.filter(function(app) {

        const matchesSearch =
            app.company.toLowerCase().includes(searchText) ||
            app.role.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            app.status === selectedStatus;

        return matchesSearch && matchesStatus;

    });

    displayApplications(filteredApplications);
}


document
    .getElementById("searchInput")
    .addEventListener("input", filterApplications);

document
    .getElementById("statusFilter")
    .addEventListener("change", filterApplications);

async function loadApplications() {

    try {

        const response = await fetch(
             API_URL
        );

        applications = await response.json();

        displayApplications();

    } catch (error) {

        console.log(error);

        alert("Failed to load applications.");

    }

}

loadApplications();