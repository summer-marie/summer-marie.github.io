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

  // Add date headers with data attributes
  dates.forEach((date, dateIndex) => {
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
    });
    tableHTML += `<th data-date-index="${dateIndex}">${dayName}<br>${dateStr}</th>`;
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
        tableHTML += `<tr data-job-title="${jobTitle}"><td class="employee-name">${employee.firstName} ${employee.lastName}</td>`;

        // Add cells for each date with data attributes
        dates.forEach((date, dateIndex) => {
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
            tableHTML += `<td class="shift-cell" data-date-index="${dateIndex}" data-job-title="${jobTitle}">${startTime}-${endTime}</td>`;
          } else {
            tableHTML += `<td class="shift-cell" data-date-index="${dateIndex}" data-job-title="${jobTitle}">-</td>`;
          }
        });

        tableHTML += "</tr>";
      });
    });

  tableHTML += "</tbody></table>";
  tableWrapper.innerHTML = tableHTML;

  // Run validation checks and display results (Phase 2 & 3)
  const violations = validateSchedule(dates, employees);
  
  // Display warning messages
  displayRuleViolations(violations);
  
  // Apply visual styling to violated cells
  applyViolationStyling(violations);
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

// ============================================
// RULES MANAGEMENT SYSTEM
// ============================================

const manageRulesBtn = document.getElementById("manage-rules-link");
const rulesModalOverlay = document.getElementById("rules-modal-overlay");
const closeRulesModalBtn = document.getElementById("close-rules-modal-btn");
const addRuleBtn = document.getElementById("add-rule-btn");
const ruleFormContainer = document.getElementById("rule-form-container");
const ruleForm = document.getElementById("rule-form");
const cancelRuleFormBtn = document.getElementById("cancel-rule-form-btn");
const rulesList = document.getElementById("rules-list");
const rulesCountBadge = document.getElementById("rules-count");

let currentEditingRuleId = null;

// Show rules modal
manageRulesBtn.addEventListener("click", () => {
  rulesModalOverlay.style.display = "flex";
  renderRulesList();
  updateRulesCount();
});

// Close rules modal
closeRulesModalBtn.addEventListener("click", () => {
  rulesModalOverlay.style.display = "none";
  hideRuleForm();
});

// Close overlay when clicking outside
rulesModalOverlay.addEventListener("click", (e) => {
  if (e.target === rulesModalOverlay) {
    rulesModalOverlay.style.display = "none";
    hideRuleForm();
  }
});

// Show add rule form
addRuleBtn.addEventListener("click", () => {
  showRuleForm();
});

// Cancel rule form
cancelRuleFormBtn.addEventListener("click", () => {
  hideRuleForm();
});

// Save rule (create or update)
ruleForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const ruleId = document.getElementById("rule-id").value;
  const ruleName = document.getElementById("rule-name").value.trim();
  const jobTitle = document.getElementById("rule-job-title").value;
  const conditionType = document.getElementById("rule-condition").value;
  const threshold = parseInt(document.getElementById("rule-threshold").value);
  const alertLevel = document.getElementById("rule-alert-level").value;

  const rule = {
    id: ruleId || `rule_${Date.now()}`,
    name: ruleName,
    jobTitle: jobTitle,
    conditionType: conditionType,
    threshold: threshold,
    alertLevel: alertLevel,
    active: true,
    createdAt: ruleId ? getRuleById(ruleId).createdAt : new Date().toISOString()
  };

  if (ruleId) {
    updateRule(rule);
  } else {
    saveRule(rule);
  }

  hideRuleForm();
  renderRulesList();
  updateRulesCount();
});

// Get all rules from localStorage
function getRules() {
  const rules = localStorage.getItem("scheduleRules");
  return rules ? JSON.parse(rules) : [];
}

// Save a new rule
function saveRule(rule) {
  const rules = getRules();
  rules.push(rule);
  localStorage.setItem("scheduleRules", JSON.stringify(rules));
}

// Update an existing rule
function updateRule(updatedRule) {
  const rules = getRules();
  const index = rules.findIndex((r) => r.id === updatedRule.id);
  if (index !== -1) {
    rules[index] = updatedRule;
    localStorage.setItem("scheduleRules", JSON.stringify(rules));
  }
}

// Delete a rule
function deleteRule(ruleId) {
  const rules = getRules();
  const filtered = rules.filter((r) => r.id !== ruleId);
  localStorage.setItem("scheduleRules", JSON.stringify(filtered));
  renderRulesList();
  updateRulesCount();
}

// Get rule by ID
function getRuleById(ruleId) {
  const rules = getRules();
  return rules.find((r) => r.id === ruleId);
}

// Show rule form for creating or editing
function showRuleForm(rule = null) {
  ruleFormContainer.style.display = "block";
  
  // Populate job title dropdown with unique job titles from employees
  const employees = getEmployees();
  const jobTitles = [...new Set(employees.map(e => e.jobTitle.trim()))].sort();
  
  const jobTitleSelect = document.getElementById("rule-job-title");
  jobTitleSelect.innerHTML = '<option value="">Select a job title...</option>';
  jobTitles.forEach(title => {
    const option = document.createElement("option");
    option.value = title;
    option.textContent = title;
    jobTitleSelect.appendChild(option);
  });

  if (rule) {
    // Edit mode
    document.getElementById("rule-form-title").textContent = "Edit Rule";
    document.getElementById("rule-id").value = rule.id;
    document.getElementById("rule-name").value = rule.name;
    document.getElementById("rule-job-title").value = rule.jobTitle;
    document.getElementById("rule-condition").value = rule.conditionType;
    document.getElementById("rule-threshold").value = rule.threshold;
    document.getElementById("rule-alert-level").value = rule.alertLevel;
    currentEditingRuleId = rule.id;
  } else {
    // Create mode
    document.getElementById("rule-form-title").textContent = "Create New Rule";
    ruleForm.reset();
    document.getElementById("rule-id").value = "";
    currentEditingRuleId = null;
  }

  // Scroll to form
  ruleFormContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Hide rule form
function hideRuleForm() {
  ruleFormContainer.style.display = "none";
  ruleForm.reset();
  currentEditingRuleId = null;
}

// Render rules list
function renderRulesList() {
  const rules = getRules();
  
  if (rules.length === 0) {
    rulesList.innerHTML = `
      <div class="empty-rules-message">
        <p>No rules created yet. Click "Add New Rule" to create your first validation rule.</p>
      </div>
    `;
    return;
  }

  rulesList.innerHTML = "";
  rules.forEach((rule) => {
    const ruleItem = document.createElement("div");
    ruleItem.className = `rule-item alert-${rule.alertLevel}`;
    
    const conditionText = rule.conditionType === "minCountPerDay" 
      ? `Minimum ${rule.threshold} per day` 
      : rule.conditionType;
    
    ruleItem.innerHTML = `
      <div class="rule-header">
        <h4 class="rule-name">${rule.name}</h4>
        <div class="rule-actions">
          <button class="edit-rule-btn" data-rule-id="${rule.id}">Edit</button>
          <button class="delete-rule-btn" data-rule-id="${rule.id}">Delete</button>
        </div>
      </div>
      <div class="rule-details">
        <strong>Job Title:</strong> ${rule.jobTitle}<br>
        <strong>Condition:</strong> ${conditionText}<br>
        <strong>Alert Level:</strong> <span class="alert-badge ${rule.alertLevel}">${rule.alertLevel}</span>
      </div>
    `;
    
    rulesList.appendChild(ruleItem);

    // Add event listeners to edit and delete buttons
    ruleItem.querySelector(".edit-rule-btn").addEventListener("click", () => {
      showRuleForm(rule);
    });

    ruleItem.querySelector(".delete-rule-btn").addEventListener("click", () => {
      if (confirm(`Are you sure you want to delete the rule "${rule.name}"?`)) {
        deleteRule(rule.id);
      }
    });
  });
}

// Update rules count badge in navbar
function updateRulesCount() {
  const rules = getRules();
  if (rules.length > 0) {
    rulesCountBadge.textContent = rules.length;
    rulesCountBadge.style.display = "inline-block";
  } else {
    rulesCountBadge.style.display = "none";
  }
}

// Initialize rules count on page load
document.addEventListener("DOMContentLoaded", () => {
  updateRulesCount();
});

// ============================================
// VALIDATION ENGINE
// ============================================

/**
 * Main validation function - checks all active rules against the schedule
 * @param {Array} dates - Array of Date objects for the schedule period
 * @param {Array} employees - Array of employee objects
 * @returns {Object} Violations object keyed by ruleId, containing violation details
 */
function validateSchedule(dates, employees) {
  const rules = getRules().filter(rule => rule.active);
  const violations = {};

  rules.forEach(rule => {
    let ruleViolations = null;

    // Check based on condition type
    switch (rule.conditionType) {
      case "minCountPerDay":
        ruleViolations = checkMinCountPerDay(rule, dates, employees);
        break;
      // Future condition types can be added here:
      // case "maxHoursPerWeek":
      //   ruleViolations = checkMaxHoursPerWeek(rule, dates, employees);
      //   break;
      default:
        console.warn(`Unknown condition type: ${rule.conditionType}`);
    }

    // If violations found, add to violations object
    if (ruleViolations && ruleViolations.violatedDates.length > 0) {
      violations[rule.id] = ruleViolations;
    }
  });

  return violations;
}

/**
 * Check minimum count per day condition
 * @param {Object} rule - The rule to check
 * @param {Array} dates - Array of Date objects
 * @param {Array} employees - Array of employee objects
 * @returns {Object} Violation details or null
 */
function checkMinCountPerDay(rule, dates, employees) {
  const violatedDates = [];
  
  // Filter employees by job title (case-insensitive match)
  const relevantEmployees = employees.filter(emp => 
    emp.jobTitle.trim().toLowerCase() === rule.jobTitle.trim().toLowerCase()
  );

  // Check each date
  dates.forEach((date, dateIndex) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    
    // Count how many relevant employees are scheduled on this date
    const scheduledCount = countScheduledEmployees(relevantEmployees, dayOfWeek);

    // Check if count is below threshold
    if (scheduledCount < rule.threshold) {
      violatedDates.push({
        date: new Date(date), // Clone date object
        dateIndex: dateIndex,
        actualCount: scheduledCount,
        requiredCount: rule.threshold,
        dayOfWeek: dayOfWeek
      });
    }
  });

  if (violatedDates.length > 0) {
    return {
      ruleId: rule.id,
      ruleName: rule.name,
      jobTitle: rule.jobTitle,
      alertLevel: rule.alertLevel,
      conditionType: rule.conditionType,
      threshold: rule.threshold,
      violatedDates: violatedDates
    };
  }

  return null;
}

/**
 * Count how many employees are scheduled for a specific day
 * @param {Array} employees - Filtered array of employees for a specific job title
 * @param {String} dayOfWeek - Day name in lowercase (e.g., "monday")
 * @returns {Number} Count of scheduled employees
 */
function countScheduledEmployees(employees, dayOfWeek) {
  let count = 0;
  
  employees.forEach(employee => {
    const daySchedule = employee.schedule[dayOfWeek];
    
    // Employee is scheduled if available is true and they have start/end times
    if (daySchedule && 
        daySchedule.available === true && 
        daySchedule.start && 
        daySchedule.end) {
      count++;
    }
  });

  return count;
}

/**
 * Get unique job titles from current employees (helper for validation)
 * @returns {Array} Array of unique job titles
 */
function getUniqueJobTitles() {
  const employees = getEmployees();
  const titles = employees.map(emp => emp.jobTitle.trim());
  return [...new Set(titles)].sort();
}

/**
 * Test/Debug function - Analyze current schedule against rules
 * Can be called from browser console for testing
 * @returns {Object} Analysis results
 */
function analyzeSchedule() {
  const employees = getEmployees();
  const rules = getRules();
  const numberOfWeeks = parseInt(document.getElementById("weeks-select").value);
  
  // Calculate dates
  const dates = [];
  const today = new Date();
  const daysToShow = numberOfWeeks * 7;
  
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  // Run validation
  const violations = validateSchedule(dates, employees);
  
  // Build analysis report
  const analysis = {
    totalEmployees: employees.length,
    totalRules: rules.length,
    activeRules: rules.filter(r => r.active).length,
    scheduleStart: dates[0].toLocaleDateString(),
    scheduleEnd: dates[dates.length - 1].toLocaleDateString(),
    violations: violations,
    violationCount: Object.keys(violations).length,
    summary: Object.keys(violations).length === 0 
      ? "✅ All rules satisfied!" 
      : `⚠️ ${Object.keys(violations).length} rule(s) violated`
  };

  console.log("=== SCHEDULE ANALYSIS ===");
  console.log(`Employees: ${analysis.totalEmployees}`);
  console.log(`Active Rules: ${analysis.activeRules} of ${analysis.totalRules}`);
  console.log(`Schedule Period: ${analysis.scheduleStart} - ${analysis.scheduleEnd}`);
  console.log(`\n${analysis.summary}\n`);
  
  if (analysis.violationCount > 0) {
    Object.values(violations).forEach(v => {
      console.log(`\n❌ Rule: "${v.ruleName}"`);
      console.log(`   Job Title: ${v.jobTitle}`);
      console.log(`   Required: ${v.threshold}, Alert Level: ${v.alertLevel}`);
      console.log(`   Violated Dates (${v.violatedDates.length}):`);
      v.violatedDates.forEach(d => {
        const dateStr = d.date.toLocaleDateString("en-US", { 
          weekday: "short", 
          month: "numeric", 
          day: "numeric" 
        });
        console.log(`     • ${dateStr}: ${d.actualCount} scheduled (need ${d.requiredCount})`);
      });
    });
  }
  
  console.log("\n=========================");
  return analysis;
}

// Expose test function globally for console access
window.analyzeSchedule = analyzeSchedule;

// ============================================
// VISUAL FEEDBACK - PHASE 3
// ============================================

// Display rule violation warnings above the schedule table
function displayRuleViolations(violations) {
  const warningsContainer = document.getElementById("schedule-warnings");
  
  // Clear previous warnings
  warningsContainer.innerHTML = "";
  
  // If no violations, exit early
  if (Object.keys(violations).length === 0) {
    return;
  }
  
  // Create warning message for each violated rule
  Object.values(violations).forEach(violation => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `warning-message ${violation.alertLevel}`;
    
    // Icon based on alert level
    const icon = violation.alertLevel === "error" ? "🚫" : "⚠️";
    
    // Format the violated dates list
    const datesText = violation.violatedDates.map(d => {
      const dateStr = d.date.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "numeric", 
        day: "numeric" 
      });
      return `${dateStr} (${d.actualCount}/${d.requiredCount})`;
    }).join(", ");
    
    messageDiv.innerHTML = `
      <div class="warning-header">
        <span class="warning-icon">${icon}</span>
        <span>${violation.ruleName}</span>
      </div>
      <div class="warning-details">
        <strong>Job Title:</strong> ${violation.jobTitle}<br>
        <strong>Required:</strong> Minimum ${violation.threshold} per day<br>
        <strong>Violations:</strong> ${violation.violatedDates.length} day(s) below threshold
        <div class="violated-dates-list">
          <strong>Dates:</strong> ${datesText}
        </div>
      </div>
    `;
    
    warningsContainer.appendChild(messageDiv);
  });
}

// Apply visual styling to violated columns in the schedule table
function applyViolationStyling(violations) {
  // If no violations, exit early
  if (Object.keys(violations).length === 0) {
    return;
  }
  
  // Build a map of date indices to alert levels and job titles
  const violationMap = {};
  
  Object.values(violations).forEach(violation => {
    violation.violatedDates.forEach(vDate => {
      const dateIndex = vDate.dateIndex;
      const jobTitle = violation.jobTitle;
      
      if (!violationMap[dateIndex]) {
        violationMap[dateIndex] = {};
      }
      
      // Store the alert level for this job title and date
      // If multiple rules apply, error takes precedence over warning
      if (!violationMap[dateIndex][jobTitle] || violation.alertLevel === "error") {
        violationMap[dateIndex][jobTitle] = violation.alertLevel;
      }
    });
  });
  
  // Apply styling to table headers
  Object.keys(violationMap).forEach(dateIndex => {
    const headers = document.querySelectorAll(`th[data-date-index="${dateIndex}"]`);
    headers.forEach(header => {
      // Determine worst alert level for this date (error > warning)
      const alertLevels = Object.values(violationMap[dateIndex]);
      const worstLevel = alertLevels.includes("error") ? "error" : "warning";
      header.classList.add(`violation-${worstLevel}`);
    });
  });
  
  // Apply styling to table cells for specific job titles
  Object.keys(violationMap).forEach(dateIndex => {
    const jobTitles = Object.keys(violationMap[dateIndex]);
    
    jobTitles.forEach(jobTitle => {
      const alertLevel = violationMap[dateIndex][jobTitle];
      
      // Find all cells for this date index and job title
      const cells = document.querySelectorAll(
        `td[data-date-index="${dateIndex}"][data-job-title="${jobTitle}"]`
      );
      
      cells.forEach(cell => {
        cell.classList.add(`violation-${alertLevel}`);
      });
    });
  });
}
