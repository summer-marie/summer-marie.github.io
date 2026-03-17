// Track current editing employee ID (null if adding new)
let currentEditingEmployeeId = null;

// handle showing/hiding add employee form
const addEmployeeBtn = document.getElementById("add-employee-link");
const employeeForm = document.getElementById("employee-form");

// toggle employee form visibility
addEmployeeBtn.addEventListener("click", () => {
  currentEditingEmployeeId = null; // Reset to add mode
  employeeForm.reset(); // Clear form
  document.getElementById("remove-employee-btn").style.display = "none"; // Hide remove button for new employee
  if (
    employeeForm.style.display === "none" ||
    employeeForm.style.display === ""
  ) {
    employeeForm.style.display = "block";
  } else {
    employeeForm.style.display = "none";
  }
});

// Handle cancel button click
const cancelFormBtn = document.getElementById("cancel-form-btn");
cancelFormBtn.addEventListener("click", () => {
  employeeForm.reset();
  employeeForm.style.display = "none";
  currentEditingEmployeeId = null;
  document.getElementById("remove-employee-btn").style.display = "none";
});

// Handle remove employee button click
const removeEmployeeBtn = document.getElementById("remove-employee-btn");
removeEmployeeBtn.addEventListener("click", () => {
  if (currentEditingEmployeeId && confirm("Are you sure you want to remove this employee?")) {
    removeEmployee(currentEditingEmployeeId);
    renderEmployeeList();
    employeeForm.reset();
    employeeForm.style.display = "none";
    currentEditingEmployeeId = null;
    removeEmployeeBtn.style.display = "none";
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

// Remove employee from local storage
function removeEmployee(employeeId) {
  let employees = getEmployees();
  employees = employees.filter((emp) => emp.id !== employeeId);
  localStorage.setItem("employees", JSON.stringify(employees));
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

  // Show the form and remove button
  employeeForm.style.display = "block";
  document.getElementById("remove-employee-btn").style.display = "block";
}

// Render employee list
function renderEmployeeList() {
  const employees = getEmployees();
  const employeeList = document.getElementById("employee-list");

  // Clear current list
  employeeList.innerHTML = "";

  // Group employees by job title
  const groupedEmployees = {};
  employees.forEach((employee) => {
    // Normalize job title to avoid duplicates from different spacing/casing
    const normalizedTitle = employee.jobTitle.trim().toLowerCase();
    if (!groupedEmployees[normalizedTitle]) {
      groupedEmployees[normalizedTitle] = {
        displayTitle: employee.jobTitle.trim(),
        employees: []
      };
    }
    groupedEmployees[normalizedTitle].employees.push(employee);
  });

  // Render each group
  Object.keys(groupedEmployees)
    .sort()
    .forEach((normalizedTitle) => {
      const group = groupedEmployees[normalizedTitle];
      const jobTitle = group.displayTitle;
      
      // Add job title header if there are multiple job titles
      if (Object.keys(groupedEmployees).length > 1) {
        const titleHeader = document.createElement("div");
        titleHeader.className = "job-title-header";
        titleHeader.textContent = jobTitle;
        employeeList.appendChild(titleHeader);
      }

      // Render employees in this group
      group.employees.forEach((employee) => {
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
    });
}

// Load employee list on page load
document.addEventListener("DOMContentLoaded", () => {
  renderEmployeeList();
});

// ============================================
// SCHEDULE GENERATION
// ============================================

const generateScheduleBtn = document.getElementById("generate-schedule-link");
const scheduleContainer = document.getElementById("schedule-container");
const weeksSelect = document.getElementById("weeks-select");
const regenerateBtn = document.getElementById("regenerate-schedule-btn");

// Generate schedule when button is clicked
generateScheduleBtn.addEventListener("click", () => {
  generateSchedule();
  scheduleContainer.style.display = "block";
  employeeForm.style.display = "none";
});

// Regenerate schedule when weeks change or regenerate button clicked
regenerateBtn.addEventListener("click", () => {
  generateSchedule();
});

weeksSelect.addEventListener("change", () => {
  generateSchedule();
});

function generateSchedule() {
  const employees = getEmployees();
  const numberOfWeeks = parseInt(weeksSelect.value);
  const tableWrapper = document.getElementById("schedule-table-wrapper");

  if (employees.length === 0) {
    tableWrapper.innerHTML =
      "<p style='text-align: center; color: #666;'>No employees added yet. Please add employees first.</p>";
    return;
  }

  // Calculate dates for the schedule
  const dates = [];
  const today = new Date();
  const daysToShow = numberOfWeeks * 7;

  for (let i = 0; i < daysToShow; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  // Create table HTML
  let tableHTML = '<table class="schedule-table"><thead><tr><th>Employee</th>';

  // Add date headers
  dates.forEach((date) => {
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
    });
    tableHTML += `<th>${dayName}<br>${dateStr}</th>`;
  });

  tableHTML += "</tr></thead><tbody>";

  // Group employees by job title
  const groupedEmployees = {};
  employees.forEach((employee) => {
    // Normalize job title to avoid duplicates from different spacing/casing
    const normalizedTitle = employee.jobTitle.trim().toLowerCase();
    if (!groupedEmployees[normalizedTitle]) {
      groupedEmployees[normalizedTitle] = {
        displayTitle: employee.jobTitle.trim(),
        employees: []
      };
    }
    groupedEmployees[normalizedTitle].employees.push(employee);
  });

  // Debug: Log grouped job titles
  console.log('Job titles found:', Object.keys(groupedEmployees).map(k => groupedEmployees[k].displayTitle));
  console.log('Number of job title groups:', Object.keys(groupedEmployees).length);

  // Add rows for each group
  Object.keys(groupedEmployees)
    .sort()
    .forEach((normalizedTitle) => {
      const group = groupedEmployees[normalizedTitle];
      const jobTitle = group.displayTitle;
      
      // Add job title separator row if there are multiple job titles
      if (Object.keys(groupedEmployees).length > 1) {
        const colSpan = dates.length + 1;
        tableHTML += `<tr class="job-title-row"><td colspan="${colSpan}" class="job-title-cell">${jobTitle}</td></tr>`;
      }

      // Add rows for employees in this group
      group.employees.forEach((employee) => {
        tableHTML += `<tr><td class="employee-name">${employee.firstName} ${employee.lastName}</td>`;

        // Add cells for each date
        dates.forEach((date) => {
          const dayOfWeek = date
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase();
          const daySchedule = employee.schedule[dayOfWeek];

          if (
            daySchedule &&
            daySchedule.available &&
            daySchedule.start &&
            daySchedule.end
          ) {
            // Format time as abbreviated (e.g., "7-3pm" for 7:00-15:00)
            const startTime = formatTimeSimple(daySchedule.start);
            const endTime = formatTime(daySchedule.end);
            tableHTML += `<td class="shift-cell">${startTime}-${endTime}</td>`;
          } else {
            tableHTML += `<td class="shift-cell">-</td>`;
          }
        });

        tableHTML += "</tr>";
      });
    });

  tableHTML += "</tbody></table>";
  tableWrapper.innerHTML = tableHTML;
}

// Helper function to format time without am/pm (just the hour number)
function formatTimeSimple(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  let hour = parseInt(hours);

  // Convert to 12-hour format
  if (hour === 0) {
    hour = 12; // Midnight
  } else if (hour > 12) {
    hour = hour - 12;
  }

  return hour.toString();
}

// Helper function to format time (convert 14:00 to 2pm, 09:00 to 9am, etc.)
function formatTime(time) {
  if (!time) return "";
  // Split time into hours and minutes
  const [hours, minutes] = time.split(":");
  // Convert hours to integer
  let hour = parseInt(hours);

  // Determine AM or PM
  // For hours 0-11 it's AM, for hours 12-23 it's PM
  const period = hour >= 12 ? "pm" : "am";

  // Convert to 12-hour format
  if (hour === 0) {
    hour = 12; // Midnight
  } else if (hour > 12) {
    hour = hour - 12; // Convert to 12-hour format
  }
  // Return formatted time (e.g., "2pm", "9am")
  return hour.toString() + period;
}

// ============================================
// TEST DATA GENERATION
// ============================================

const testDataBtn = document.getElementById("test-data-link");
const testDataOverlay = document.getElementById("test-data-form-overlay");
const testDataForm = document.getElementById("test-data-form");
const cancelTestFormBtn = document.getElementById("cancel-test-form-btn");

// Show test data form
testDataBtn.addEventListener("click", () => {
  testDataOverlay.style.display = "flex";
});

// Hide test data form
cancelTestFormBtn.addEventListener("click", () => {
  testDataOverlay.style.display = "none";
  testDataForm.reset();
});

// Close overlay when clicking outside the form
testDataOverlay.addEventListener("click", (e) => {
  if (e.target === testDataOverlay) {
    testDataOverlay.style.display = "none";
    testDataForm.reset();
  }
});

// Generate test data
testDataForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const numEmployees = parseInt(document.getElementById("num-employees").value);
  const jobTitle = document.getElementById("job-title-test").value;
  const shiftStart = document.getElementById("shift-start").value;
  const shiftEnd = document.getElementById("shift-end").value;

  // Arrays of random first and last names for randomizer
  const firstNames = [
    "Emma",
    "Liam",
    "Olivia",
    "Noah",
    "Ava",
    "Ethan",
    "Sophia",
    "Mason",
    "Isabella",
    "William",
    "Mia",
    "James",
    "Charlotte",
    "Benjamin",
    "Amelia",
    "Lucas",
    "Harper",
    "Henry",
    "Evelyn",
    "Alexander",
    "Abigail",
    "Michael",
    "Emily",
    "Daniel",
    "Elizabeth",
    "Matthew",
    "Sofia",
    "Jackson",
    "Avery",
    "Sebastian",
    "Ella",
    "Jack",
    "Scarlett",
    "Aiden",
    "Grace",
    "Owen",
    "Chloe",
    "Samuel",
    "Victoria",
    "Joseph",
    "Riley",
    "John",
    "Aria",
    "David",
    "Lily",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
    "Adams",
    "Nelson",
    "Baker",
    "Hall",
    "Rivera",
    "Campbell",
  ];

  // Generate employees
  for (let i = 0; i < numEmployees; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    // Generate random work days (3-6 days per week, with 5 being most common)
    const workDays = generateRandomWorkDays();

    const employee = {
      id: Date.now() + i, // Unique ID
      jobTitle: jobTitle,
      firstName: firstName,
      lastName: lastName,
      schedule: {
        monday: {
          available: workDays.includes("monday"),
          start: workDays.includes("monday") ? shiftStart : "",
          end: workDays.includes("monday") ? shiftEnd : "",
        },
        tuesday: {
          available: workDays.includes("tuesday"),
          start: workDays.includes("tuesday") ? shiftStart : "",
          end: workDays.includes("tuesday") ? shiftEnd : "",
        },
        wednesday: {
          available: workDays.includes("wednesday"),
          start: workDays.includes("wednesday") ? shiftStart : "",
          end: workDays.includes("wednesday") ? shiftEnd : "",
        },
        thursday: {
          available: workDays.includes("thursday"),
          start: workDays.includes("thursday") ? shiftStart : "",
          end: workDays.includes("thursday") ? shiftEnd : "",
        },
        friday: {
          available: workDays.includes("friday"),
          start: workDays.includes("friday") ? shiftStart : "",
          end: workDays.includes("friday") ? shiftEnd : "",
        },
        saturday: {
          available: workDays.includes("saturday"),
          start: workDays.includes("saturday") ? shiftStart : "",
          end: workDays.includes("saturday") ? shiftEnd : "",
        },
        sunday: {
          available: workDays.includes("sunday"),
          start: workDays.includes("sunday") ? shiftStart : "",
          end: workDays.includes("sunday") ? shiftEnd : "",
        },
      },
    };

    saveEmployee(employee);
  }

  // Refresh employee list
  renderEmployeeList();

  // Hide form and reset
  testDataOverlay.style.display = "none";
  testDataForm.reset();

  alert(`Successfully generated ${numEmployees} test employees!`);
});

// Helper function to generate random work days
// 3-6 days per week, with 5 being most common
function generateRandomWorkDays() {
  const allDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Weighted random number of days (5 is most common)
  const numDaysRandom = Math.random();
  let numDays;
  if (numDaysRandom < 0.15) {
    numDays = 3; // 15% chance
  } else if (numDaysRandom < 0.3) {
    numDays = 4; // 15% chance
  } else if (numDaysRandom < 0.8) {
    numDays = 5; // 50% chance (most common)
  } else {
    numDays = 6; // 20% chance (rare)
  }

  // Shuffle days and pick the first numDays
  const shuffled = [...allDays].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numDays);
}
