// handle button click actions

// handle showing/hiding add employee form
const addEmployeeBtn = document.getElementById("add-employee-btn");
const employeeForm = document.getElementById("employee-form");

// toggle employee form visibility
addEmployeeBtn.addEventListener("click", () => {
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
    id: Date.now(), // unique ID based on timestamp
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

  // Save to local storage
  saveEmployee(employee);

  // Render employee list
  renderEmployeeList();

  // Reset form and hide it
  employeeForm.reset();
  employeeForm.style.display = "none";
});

// Local storage functions
function saveEmployee(employee) {
  let employees = getEmployees();
  employees.push(employee);
  localStorage.setItem("employees", JSON.stringify(employees));
}

// Get employees from local storage
function getEmployees() {
  const employees = localStorage.getItem("employees");
  return employees ? JSON.parse(employees) : [];
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
        `; 
        // Append card to employee list
    employeeList.appendChild(card);
  });
}

// Load employee list on page load
document.addEventListener("DOMContentLoaded", () => {
  renderEmployeeList();
});
