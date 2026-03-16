// handle button click actions

// Track current editing employee ID (null if adding new)
let currentEditingEmployeeId = null;

// handle showing/hiding add employee form
const addEmployeeBtn = document.getElementById("add-employee-btn");
const employeeForm = document.getElementById("employee-form");

// toggle employee form visibility
addEmployeeBtn.addEventListener("click", () => {
  currentEditingEmployeeId = null; // Reset to add mode
  employeeForm.reset(); // Clear form
  if (
    employeeForm.style.display === "none" ||
    employeeForm.style.display === ""
  ) {
    employeeForm.style.display = "block";
  } else {
    employeeForm.style.display = "none";
  }
});

// Handle form submission
employeeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form data
  const employee = {
    id: currentEditingEmployeeId || Date.now(), // Use existing ID if editing, otherwise create new
    jobTitle: document.getElementById("job-title").value,
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("last-name").value,
    schedule: {
      monday: {
        available: document.getElementById("monday").checked,
        start: document.getElementById("monday-start").value,
        end: document.getElementById("monday-end").value,
      },
      tuesday: {
        available: document.getElementById("tuesday").checked,
        start: document.getElementById("tuesday-start").value,
        end: document.getElementById("tuesday-end").value,
      },
      wednesday: {
        available: document.getElementById("wednesday").checked,
        start: document.getElementById("wednesday-start").value,
        end: document.getElementById("wednesday-end").value,
      },
      thursday: {
        available: document.getElementById("thursday").checked,
        start: document.getElementById("thursday-start").value,
        end: document.getElementById("thursday-end").value,
      },
      friday: {
        available: document.getElementById("friday").checked,
        start: document.getElementById("friday-start").value,
        end: document.getElementById("friday-end").value,
      },
      saturday: {
        available: document.getElementById("saturday").checked,
        start: document.getElementById("saturday-start").value,
        end: document.getElementById("saturday-end").value,
      },
      sunday: {
        available: document.getElementById("sunday").checked,
        start: document.getElementById("sunday-start").value,
        end: document.getElementById("sunday-end").value,
      },
    },
  };

  // Save to local storage (will either add or update)
  if (currentEditingEmployeeId) {
    updateEmployee(employee);
  } else {
    saveEmployee(employee);
  }

  // Render employee list
  renderEmployeeList();

  // Reset form and hide it
  employeeForm.reset();
  employeeForm.style.display = "none";
  currentEditingEmployeeId = null;
});

// Local storage functions
function saveEmployee(employee) {
  let employees = getEmployees();
  employees.push(employee);
  localStorage.setItem("employees", JSON.stringify(employees));
}

// Update existing employee in local storage
function updateEmployee(updatedEmployee) {
  let employees = getEmployees();
  // Find index of employee to update
  const index = employees.findIndex((emp) => emp.id === updatedEmployee.id);
  if (index !== -1) {
    // Update employee data
    employees[index] = updatedEmployee;
    // Save updated list back to local storage
    localStorage.setItem("employees", JSON.stringify(employees));
  }
}

// Get employees from local storage
function getEmployees() {
  const employees = localStorage.getItem("employees");
  return employees ? JSON.parse(employees) : [];
}

// Function to populate form with employee data
function populateFormForEdit(employee) {
  currentEditingEmployeeId = employee.id;

  // Populate basic info
  document.getElementById("job-title").value = employee.jobTitle;
  document.getElementById("first-name").value = employee.firstName;
  document.getElementById("last-name").value = employee.lastName;

  // Populate schedule
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  days.forEach((day) => {
    document.getElementById(day).checked = employee.schedule[day].available;
    document.getElementById(`${day}-start`).value =
      employee.schedule[day].start;
    document.getElementById(`${day}-end`).value = employee.schedule[day].end;
  });

  // Show the form
  employeeForm.style.display = "block";
}

// Render employee list
function renderEmployeeList() {
  const employees = getEmployees();
  const employeeList = document.getElementById("employee-list");

  // Clear current list
  employeeList.innerHTML = "";

  // Render each employee
  employees.forEach((employee) => {
    const card = document.createElement("div");
    card.className = "employee-card";

    // Create day availability indicators
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const dayKeys = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    // Generate day indicators with appropriate colors based on availability
    const dayIndicators = days
      .map((day, index) => {
        const isAvailable = employee.schedule[dayKeys[index]].available;
        const colorClass = isAvailable ? "available" : "unavailable";
        return `<span class="day-indicator ${colorClass}">${day}</span>`;
      })
      .join("");

    // Set card content with employee info and day indicators
    card.innerHTML = `
            <div class="card-header">
                <div class="employee-info">
                    <h3>${employee.firstName} ${employee.lastName}</h3>
                    <p><strong>${employee.jobTitle}</strong></p>
                </div>
                <div class="day-indicators">
                    ${dayIndicators}
                </div>
            </div>
            <button class="update-btn" data-employee-id="${employee.id}">Update</button>
        `;
    // Append card to employee list
    employeeList.appendChild(card);

    // Add click event to update button
    const updateBtn = card.querySelector(".update-btn");
    updateBtn.addEventListener("click", () => {
      populateFormForEdit(employee);
    });
  });
}

// Load employee list on page load
document.addEventListener("DOMContentLoaded", () => {
  renderEmployeeList();
});
