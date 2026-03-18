// ============================================
// UNIVERSAL SCHEDULE CREATOR - MAIN SCRIPT
// ============================================
// Employee scheduling app with availability tracking,
// multi-week schedule generation, custom validation rules,
// and dynamic UI features.
// ============================================

// ============================================
// CONTENT AREA MANAGEMENT
// ============================================
// Manages visibility of main content sections: Employee Form, Schedule Display, FAQs

// DOM element references for content sections
const addEmployeeBtn = document.getElementById("add-employee-link");
const employeeForm = document.getElementById("employee-form");
const scheduleContainer = document.getElementById("schedule-container");
const faqsContainer = document.getElementById("faqs-container");
const faqsBtn = document.getElementById("faqs-link");

// ============================================
// FAQs SECTION
// ============================================

/**
 * Toggle FAQ section visibility and hide other content
 */
faqsBtn.addEventListener("click", () => {
  faqsContainer.style.display = "block";
  employeeForm.style.display = "none";
  scheduleContainer.style.display = "none";
  updateSidebarHeight();
});

/**
 * Initialize FAQ accordion functionality
 * Allows only one FAQ section to be expanded at a time
 */
function initializeFAQAccordion() {
  const faqSections = document.querySelectorAll('.faq-section');
  
  faqSections.forEach(section => {
    const header = section.querySelector('.faq-header');
    const toggle = section.querySelector('.faq-toggle');
    
    header.addEventListener('click', () => {
      const isActive = section.classList.contains('active');
      
      // Close all other FAQ sections (accordion behavior)
      faqSections.forEach(otherSection => {
        if (otherSection !== section) {
          otherSection.classList.remove('active');
          const otherToggle = otherSection.querySelector('.faq-toggle');
          otherToggle.textContent = '▶'; // Change to right arrow (collapsed)
        }
      });
      
      // Toggle current section
      if (isActive) {
        section.classList.remove('active');
        toggle.textContent = '▶'; // Change to right arrow (collapsed)
      } else {
        section.classList.add('active');
        toggle.textContent = '▼'; // Change to down arrow (expanded)
      }
    });
  });
}

// Initialize accordion on page load
initializeFAQAccordion();

// ============================================
// DYNAMIC SIDEBAR HEIGHT
// ============================================
// Automatically adjusts employee list sidebar height to match
// the currently visible content (desktop only, > 768px viewport)

/**
 * Update sidebar height to match visible content (desktop only)
 * On mobile (< 769px), CSS handles fixed height with scrolling
 */
function updateSidebarHeight() {
  const sidebar = document.getElementById("employee-list-sidebar");
  
  // Only apply dynamic height on desktop (viewport width >= 769px)
  if (window.innerWidth < 769) {
    sidebar.style.height = ""; // Reset height on mobile, let CSS handle it
    return;
  }

  // Determine which content is currently visible
  let visibleContent = null;
  
  if (employeeForm.style.display === "block") {
    visibleContent = employeeForm;
  } else if (scheduleContainer.style.display === "block") {
    visibleContent = scheduleContainer;
  } else if (faqsContainer.style.display === "block") {
    visibleContent = faqsContainer;
  }

  // If content is visible, match its height
  if (visibleContent) {
    // Use setTimeout to ensure content has fully rendered
    setTimeout(() => {
      const contentHeight = visibleContent.offsetHeight;
      sidebar.style.height = contentHeight + "px";
    }, 50); // Small delay to ensure DOM has updated
  }
}

// Debounced window resize handler for performance
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateSidebarHeight();
  }, 150);
});

// ============================================
// EMPLOYEE MANAGEMENT
// ============================================
// Add, edit, remove, and display employees with availability schedules

// Track current editing employee ID (null when adding new)
let currentEditingEmployeeId = null;

/**
 * Toggle employee form visibility
 */
addEmployeeBtn.addEventListener("click", () => {
  currentEditingEmployeeId = null; // Reset to add mode
  employeeForm.reset(); // Clear form
  document.getElementById("remove-employee-btn").style.display = "none"; // Hide remove button for new employee
  faqsContainer.style.display = "none"; // Hide FAQs
  scheduleContainer.style.display = "none"; // Hide schedule
  if (
    employeeForm.style.display === "none" ||
    employeeForm.style.display === ""
  ) {
    employeeForm.style.display = "block";
  } else {
    employeeForm.style.display = "none";
  }
  updateSidebarHeight();
});

/**
 * Handle cancel button - hide form and reset state
 */
const cancelFormBtn = document.getElementById("cancel-form-btn");
cancelFormBtn.addEventListener("click", () => {
  employeeForm.reset();
  employeeForm.style.display = "none";
  currentEditingEmployeeId = null;
  document.getElementById("remove-employee-btn").style.display = "none";
});

/**
 * Handle remove employee button - delete employee with confirmation
 */
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

/**
 * Handle employee form submission - save or update employee
 */
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

// ============================================
// LOCAL STORAGE - EMPLOYEE DATA
// ============================================

/**
 * Save a new employee to localStorage
 * @param {Object} employee - Employee object with id, name, jobTitle, and schedule
 */
function saveEmployee(employee) {
  let employees = getEmployees();
  employees.push(employee);
  localStorage.setItem("employees", JSON.stringify(employees));
}

/**
 * Update existing employee in localStorage
 * @param {Object} updatedEmployee - Updated employee object
 */
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

/**
 * Get all employees from localStorage
 * @returns {Array} Array of employee objects
 */
function getEmployees() {
  const employees = localStorage.getItem("employees");
  return employees ? JSON.parse(employees) : [];
}

/**
 * Remove employee from localStorage
 * @param {String|Number} employeeId - ID of employee to remove
 */
function removeEmployee(employeeId) {
  let employees = getEmployees();
  employees = employees.filter((emp) => emp.id !== employeeId);
  localStorage.setItem("employees", JSON.stringify(employees));
}

// ============================================
// EMPLOYEE FORM & LIST RENDERING
// ============================================

/**
 * Populate employee form with existing employee data for editing
 * @param {Object} employee - Employee object to edit
 */
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

/**
 * Render employee list in sidebar
 * Groups employees by job title and displays availability indicators
 */
function renderEmployeeList() {
  const employees = getEmployees();
  const employeeList = document.getElementById("employee-list");

  // Clear current list
  employeeList.innerHTML = "";

  // Show message if no employees exist
  if (employees.length === 0) {
    employeeList.innerHTML = "<p style='text-align: center; color: #666; padding: 20px;'>No employees added yet.</p>";
    return;
  }

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

/**
 * Initialize employee list on page load
 */
document.addEventListener("DOMContentLoaded", () => {
  renderEmployeeList();
});

// ============================================
// SCHEDULE GENERATION
// ============================================
// Generate multi-week schedules with pagination for 3+ weeks
// Displays employee shifts based on availability

// Pagination state variables
let currentPage = 0; // 0-indexed (page 0 = page 1 in display)
const weeksPerPage = 2; // Show 2 weeks per page for 3+ week schedules

const generateScheduleBtn = document.getElementById("generate-schedule-link");
const weeksSelect = document.getElementById("weeks-select");
const regenerateBtn = document.getElementById("regenerate-schedule-btn");

// Pagination controls
const paginationTop = document.getElementById("schedule-pagination-top");
const paginationBottom = document.getElementById("schedule-pagination-bottom");
const prevBtnTop = document.getElementById("prev-page-btn-top");
const nextBtnTop = document.getElementById("next-page-btn-top");
const prevBtnBottom = document.getElementById("prev-page-btn-bottom");
const nextBtnBottom = document.getElementById("next-page-btn-bottom");
const pageIndicatorTop = document.getElementById("page-indicator-top");
const pageIndicatorBottom = document.getElementById("page-indicator-bottom");

/**
 * Event: Generate schedule button clicked
 * Resets pagination and displays schedule
 */
generateScheduleBtn.addEventListener("click", () => {
  currentPage = 0; // Reset to first page
  generateSchedule();
  scheduleContainer.style.display = "block";
  employeeForm.style.display = "none";
  faqsContainer.style.display = "none";
  updateSidebarHeight();
});

/**
 * Event: Regenerate button clicked
 * Resets to first page and regenerates schedule
 */
regenerateBtn.addEventListener("click", () => {
  currentPage = 0; // Reset to first page
  generateSchedule();
});

/**
 * Event: Print button clicked
 * Prints the complete schedule (all weeks) regardless of pagination
 */
const printBtn = document.getElementById("print-schedule-btn");
printBtn.addEventListener("click", () => {
  // Save current state
  const savedPage = currentPage;
  const savedPaginationTopDisplay = paginationTop.style.display;
  const savedPaginationBottomDisplay = paginationBottom.style.display;
  
  // Temporarily hide pagination and show all content
  paginationTop.style.display = "none";
  paginationBottom.style.display = "none";
  
  // Generate full schedule with all weeks
  generateFullScheduleForPrint();
  
  // Function to restore original state
  const restoreOriginalView = () => {
    currentPage = savedPage;
    paginationTop.style.display = savedPaginationTopDisplay;
    paginationBottom.style.display = savedPaginationBottomDisplay;
    generateSchedule(); // Restore original paginated view
  };
  
  // Set up afterprint event listener (removes itself after firing once)
  const afterPrintHandler = () => {
    restoreOriginalView();
    window.removeEventListener('afterprint', afterPrintHandler);
  };
  window.addEventListener('afterprint', afterPrintHandler);
  
  // Trigger print dialog
  window.print();
  
  // Fallback: Also restore after a short delay in case afterprint doesn't fire
  // This ensures restoration even if browser doesn't support afterprint event
  setTimeout(() => {
    // Check if still showing full schedule (afterprint didn't fire)
    const tableWrapper = document.getElementById("schedule-table-wrapper");
    if (tableWrapper.innerHTML.includes('page-break-before')) {
      restoreOriginalView();
      window.removeEventListener('afterprint', afterPrintHandler);
    }
  }, 500);
});

/**
 * Generate complete schedule with all weeks for printing
 * Splits 3+ weeks into separate 2-week tables for better readability
 */
function generateFullScheduleForPrint() {
  const employees = getEmployees();
  const numberOfWeeks = parseInt(weeksSelect.value);
  const tableWrapper = document.getElementById("schedule-table-wrapper");

  if (employees.length === 0) {
    tableWrapper.innerHTML =
      "<p style='text-align: center; color: #666;'>No employees added yet. Please add employees first.</p>";
    return;
  }

  // Calculate dates for the schedule - ALL dates
  const allDates = [];
  const today = new Date();
  const totalDays = numberOfWeeks * 7;

  // Generate all dates
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    allDates.push(date);
  }

  // Group employees by job title
  const groupedEmployees = {};
  employees.forEach((employee) => {
    const normalizedTitle = employee.jobTitle.trim().toLowerCase();
    if (!groupedEmployees[normalizedTitle]) {
      groupedEmployees[normalizedTitle] = {
        displayTitle: employee.jobTitle.trim(),
        employees: []
      };
    }
    groupedEmployees[normalizedTitle].employees.push(employee);
  });

  // Split into 2-week blocks if 3+ weeks
  const weeksPerBlock = 2;
  const totalBlocks = Math.ceil(numberOfWeeks / weeksPerBlock);
  let fullHTML = '';

  for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
    const startWeek = blockIndex * weeksPerBlock + 1;
    const endWeek = Math.min((blockIndex + 1) * weeksPerBlock, numberOfWeeks);
    
    // Calculate date range for this block
    const blockStartIndex = blockIndex * weeksPerBlock * 7;
    const blockEndIndex = Math.min(blockStartIndex + (weeksPerBlock * 7), totalDays);
    const blockDates = allDates.slice(blockStartIndex, blockEndIndex);

    // Add block heading if multiple blocks (3+ weeks total)
    if (totalBlocks > 1) {
      if (blockIndex > 0) {
        fullHTML += '<div style="page-break-before: always;"></div>'; // Page break between blocks
      }
      fullHTML += `<h3 style="margin: 20px 0 10px 0; font-size: 14pt;">Week ${startWeek}`;
      if (endWeek > startWeek) {
        fullHTML += `-${endWeek}`;
      }
      fullHTML += '</h3>';
    }

    // Create table HTML for this block
    let tableHTML = '<table class="schedule-table"><thead><tr><th>Employee</th>';

    // Add date headers
    blockDates.forEach((date, dateIndex) => {
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      });
      tableHTML += `<th data-date-index="${dateIndex}">${dayName}<br>${dateStr}</th>`;
    });

    tableHTML += "</tr></thead><tbody>";

    // Add rows for each employee group
    Object.keys(groupedEmployees)
      .sort()
      .forEach((normalizedTitle) => {
        const group = groupedEmployees[normalizedTitle];
        const jobTitle = group.displayTitle;
        
        // Add job title separator row if there are multiple job titles
        if (Object.keys(groupedEmployees).length > 1) {
          const colSpan = blockDates.length + 1;
          tableHTML += `<tr class="job-title-row"><td colspan="${colSpan}" class="job-title-cell">${jobTitle}</td></tr>`;
        }

        // Add rows for employees in this group
        group.employees.forEach((employee) => {
          tableHTML += `<tr data-job-title="${jobTitle}"><td class="employee-name">${employee.firstName} ${employee.lastName}</td>`;

          // Add cells for each date in this block
          blockDates.forEach((date, dateIndex) => {
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
    fullHTML += tableHTML;
  }

  tableWrapper.innerHTML = fullHTML;
}

/**
 * Event: Weeks dropdown changed
 * Resets to first page when user selects different week count
 */
weeksSelect.addEventListener("change", () => {
  currentPage = 0;
  generateSchedule();
});

// ============================================
// PAGINATION EVENT LISTENERS
// ============================================
prevBtnTop.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    generateSchedule();
  }
});

nextBtnTop.addEventListener("click", () => {
  const numberOfWeeks = parseInt(weeksSelect.value);
  const totalPages = Math.ceil(numberOfWeeks / weeksPerPage);
  if (currentPage < totalPages - 1) {
    currentPage++;
    generateSchedule();
  }
});

// Bottom navigation: Previous page
prevBtnBottom.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    generateSchedule();
  }
});

// Bottom navigation: Next page
nextBtnBottom.addEventListener("click", () => {
  const numberOfWeeks = parseInt(weeksSelect.value);
  const totalPages = Math.ceil(numberOfWeeks / weeksPerPage);
  if (currentPage < totalPages - 1) {
    currentPage++;
    generateSchedule();
  }
});

function generateSchedule() {
  const employees = getEmployees();
  const numberOfWeeks = parseInt(weeksSelect.value);
  const tableWrapper = document.getElementById("schedule-table-wrapper");

  if (employees.length === 0) {
    tableWrapper.innerHTML =
      "<p style='text-align: center; color: #666;'>No employees added yet. Please add employees first.</p>";
    // Hide pagination if no employees
    paginationTop.style.display = "none";
    paginationBottom.style.display = "none";
    return;
  }

  // Show/hide pagination based on number of weeks
  const showPagination = numberOfWeeks >= 3;
  paginationTop.style.display = showPagination ? "flex" : "none";
  paginationBottom.style.display = showPagination ? "flex" : "none";

  // Calculate dates for the schedule
  const allDates = [];
  const today = new Date();
  const totalDays = numberOfWeeks * 7;

  // Generate all dates
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    allDates.push(date);
  }

  // Calculate which dates to show based on current page
  let dates;
  if (showPagination) {
    const startIndex = currentPage * weeksPerPage * 7;
    const endIndex = Math.min(startIndex + (weeksPerPage * 7), totalDays);
    dates = allDates.slice(startIndex, endIndex);
  } else {
    dates = allDates; // Show all dates if no pagination
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
  // Use allDates for validation to check all weeks, not just current page
  const validationDates = showPagination ? allDates : dates;
  const violations = validateSchedule(validationDates, employees);
  
  // Display warning messages
  displayRuleViolations(violations);
  
  // Apply visual styling to violated cells (only for visible dates)
  applyViolationStyling(violations);

  // Update pagination controls if pagination is enabled
  if (showPagination) {
    updatePaginationControls(numberOfWeeks);
  }

  // Update sidebar height after schedule table is rendered
  updateSidebarHeight();
}

/**
 * Update pagination controls (synchronizes top and bottom)
 * Handles button enable/disable states and page indicator text
 * @param {Number} numberOfWeeks - Total number of weeks in schedule
 */
function updatePaginationControls(numberOfWeeks) {
  const totalPages = Math.ceil(numberOfWeeks / weeksPerPage);
  const displayPage = currentPage + 1; // Convert 0-indexed to 1-indexed for display

  // Update page indicators
  pageIndicatorTop.textContent = `Page ${displayPage} of ${totalPages}`;
  pageIndicatorBottom.textContent = `Page ${displayPage} of ${totalPages}`;

  // Enable/disable Previous buttons
  const prevDisabled = currentPage === 0;
  prevBtnTop.disabled = prevDisabled;
  prevBtnBottom.disabled = prevDisabled;
  prevBtnTop.style.opacity = prevDisabled ? "0.5" : "1";
  prevBtnBottom.style.opacity = prevDisabled ? "0.5" : "1";
  prevBtnTop.style.cursor = prevDisabled ? "not-allowed" : "pointer";
  prevBtnBottom.style.cursor = prevDisabled ? "not-allowed" : "pointer";

  // Enable/disable Next buttons
  const nextDisabled = currentPage === totalPages - 1;
  nextBtnTop.disabled = nextDisabled;
  nextBtnBottom.disabled = nextDisabled;
  nextBtnTop.style.opacity = nextDisabled ? "0.5" : "1";
  nextBtnBottom.style.opacity = nextDisabled ? "0.5" : "1";
  nextBtnTop.style.cursor = nextDisabled ? "not-allowed" : "pointer";
  nextBtnBottom.style.cursor = nextDisabled ? "not-allowed" : "pointer";
}

// ============================================
// TIME FORMATTING HELPERS
// ============================================

/**
 * Format time without AM/PM (just hour number)
 * @param {String} time - Time in HH:MM format
 * @returns {String} Hour as string (e.g., "7", "11")
 */
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

/**
 * Format time with AM/PM (e.g., "2pm", "9am")
 * @param {String} time - Time in HH:MM format
 * @returns {String} Formatted time (e.g., "2pm", "11am")
 */
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
// Generate random employees for testing and demo purposes

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

/**
 * Generate random work days for test employees
 * Weighted distribution: 3-6 days per week, with 5 being most common
 * @returns {Array} Array of day names (e.g., ["monday", "tuesday", ...])
 */
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
// Create, edit, and manage custom schedule validation rules
// Supports multiple rule types and alert levels

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

// ============================================
// LOCAL STORAGE - RULES DATA
// ============================================

/**
 * Get all validation rules from localStorage
 * @returns {Array} Array of rule objects
 */
function getRules() {
  const rules = localStorage.getItem("scheduleRules");
  return rules ? JSON.parse(rules) : [];
}

/**
 * Save a new validation rule to localStorage
 * @param {Object} rule - Rule object with conditions and thresholds
 */
function saveRule(rule) {
  const rules = getRules();
  rules.push(rule);
  localStorage.setItem("scheduleRules", JSON.stringify(rules));
}

/**
 * Update an existing rule in localStorage
 * @param {Object} updatedRule - Updated rule object
 */
function updateRule(updatedRule) {
  const rules = getRules();
  const index = rules.findIndex((r) => r.id === updatedRule.id);
  if (index !== -1) {
    rules[index] = updatedRule;
    localStorage.setItem("scheduleRules", JSON.stringify(rules));
  }
}

/**
 * Delete a rule from localStorage
 * @param {String} ruleId - ID of rule to delete
 */
function deleteRule(ruleId) {
  const rules = getRules();
  const filtered = rules.filter((r) => r.id !== ruleId);
  localStorage.setItem("scheduleRules", JSON.stringify(filtered));
  renderRulesList();
  updateRulesCount();
}

/**
 * Get a specific rule by ID
 * @param {String} ruleId - ID of rule to retrieve
 * @returns {Object} Rule object or undefined
 */
function getRuleById(ruleId) {
  const rules = getRules();
  return rules.find((r) => r.id === ruleId);
}

/**
 * Show rule form for creating or editing
 * @param {Object|null} rule - Rule to edit, or null for new rule
 */
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

/**
 * Hide rule form and reset state
 */
function hideRuleForm() {
  ruleFormContainer.style.display = "none";
  ruleForm.reset();
  currentEditingRuleId = null;
}

/**
 * Render list of all validation rules in modal
 */
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

/**
 * Update rules count badge in navbar
 * Shows number of active rules
 */
function updateRulesCount() {
  const rules = getRules();
  if (rules.length > 0) {
    rulesCountBadge.textContent = rules.length;
    rulesCountBadge.style.display = "inline-block";
  } else {
    rulesCountBadge.style.display = "none";
  }
}

/**
 * Initialize rules count on page load
 */
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
// VISUAL FEEDBACK
// ============================================
// Display rule violations with warnings and cell highlighting

/**
 * Display rule violation warnings above schedule table
 * Shows detailed information about each violated rule
 * @param {Object} violations - Violations object from validateSchedule()
 */
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

/**
 * Apply visual styling to violated date columns in schedule table
 * Highlights table headers and cells based on alert level (warning/error)
 * @param {Object} violations - Violations object from validateSchedule()
 */
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
