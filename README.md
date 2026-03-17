# Universal Schedule Creator

A comprehensive employee scheduling application with intelligent validation, availability tracking, and multi-week schedule generation.

## 🔗 Live Demo
[View Live Application](https://summer-marie.github.io)

## 📸 Screenshots
*Coming soon*

## 🌟 Features Overview

### 📋 Employee Management
- **Add & Edit Employees**: Create employee profiles with job titles and availability preferences
- **Job Title Grouping**: Employees automatically organized by role in the sidebar
- **Availability Tracking**: Visual indicators for employee work day preferences
  - ✓ Available (green check)
  - ✗ Unavailable (red X)
  - Day-specific availability for Monday through Sunday
- **Local Storage**: All employee data persists in browser storage
- **Quick Actions**: Edit or delete employees directly from the sidebar list

### 📅 Multi-Week Schedule Generation
- **Flexible Duration**: Generate schedules for 1-4 weeks
- **Smart Pagination**: 
  - 1-2 weeks: Single page view
  - 3-4 weeks: Paginated view (2 weeks per page) with Previous/Next controls
  - Dual controls (top and bottom) for easy navigation
- **Date Selection**: Choose custom start dates for schedule planning
- **Validation Integration**: All weeks validated even when viewing paginated results
- **Responsive Design**: Mobile-optimized with touch-friendly pagination buttons

### ⚙️ Custom Validation Rules
- **Rule Builder**: Create custom scheduling rules to ensure proper staffing
- **Alert Levels**: 
  - ⚠️ Warning (yellow): Soft constraints
  - 🚨 Error (red): Hard constraints
- **Condition Type**:
  - **Minimum Employees Required**: Ensure adequate staffing levels for each scheduled day
- **Description System**: Add custom messages explaining each rule
- **Persistent Storage**: Rules saved to local storage
- **Active/Inactive States**: Enable or disable rules without deletion

### 🎨 Visual Feedback System
- **Violation Warnings**: Clear alerts displayed above schedule when rules are violated
- **Color-Coded Columns**: Date columns highlighted based on violation severity
  - Yellow background: Warning-level violations
  - Red background: Error-level violations
- **Detailed Messages**: Each violation shows:
  - Rule name
  - Alert level
  - Affected dates
  - Description of the issue
- **Real-Time Updates**: Validation runs automatically on schedule generation

### 🖥️ Dynamic User Interface
- **Adaptive Sidebar** (Desktop):
  - Automatically adjusts height to match content area
  - Works with employee list, schedule table, and FAQs
  - Smooth 0.3s transitions
  - Mobile: Fixed height with vertical scrolling
- **Content Switching**: Tab-based navigation between:
  - Employee Management Form
  - Schedule Generation & Display
  - Frequently Asked Questions
- **Collapsible FAQs**: Accordion-style FAQ section with smooth expand/collapse
- **Responsive Layout**: Optimized for mobile, tablet, and desktop viewports

### 💾 Data Persistence
- **Local Storage Integration**: All data saved to browser
  - Employee profiles with availability
  - Custom validation rules
  - Settings and preferences
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Data Integrity**: Automatic validation before storage
- **Export Ready**: Data structure supports future import/export features

### 🎯 Smart Scheduling Features
- **Random Schedule Generation**: Quick test data generation for development
- **Time Formatting**: Multiple time display formats (12/24 hour)
- **Employee Filtering**: Find employees by job title or availability
- **Conflict Detection**: Automatic identification of scheduling issues
- **Rule-Based Validation**: Comprehensive checking against all active rules

## 📱 Mobile Responsive
- Touch-friendly buttons (44px minimum)
- Optimized table layouts for small screens
- Mobile-first CSS with desktop enhancements
- Fixed sidebar height on mobile (max 80vh with scrolling)
- Readable typography across all devices

## � Installation

### Option 1: View Live Demo
Visit [https://summer-marie.github.io](https://summer-marie.github.io)

### Option 2: Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/summer-marie/summer-marie.github.io.git
   ```
2. Navigate to the project folder:
   ```bash
   cd summer-marie.github.io
   ```
3. Open `index.html` in your web browser:
   - Double-click the file, or
   - Use a local server (recommended for development)

**No build process or dependencies required** - it's a standalone HTML/CSS/JS application.

## �🚀 Getting Started

1. **Open the Application**: Navigate to the hosted page or open `index.html`
2. **Add Employees**: 
   - Click "Manage Employees" tab
   - Enter job title and employee name
   - Set availability preferences for each day
   - Click "Add Employee"
3. **Create Rules** (Optional):
   - Click "Manage Rules" tab
   - Define validation rules for your scheduling needs
   - Set alert levels and conditions
4. **Generate Schedule**:
   - Select number of weeks (1-4)
   - Choose start date
   - Click "Generate Schedule"
   - Review any validation warnings
5. **Navigate Schedules** (3+ weeks):
   - Use Previous/Next buttons to view different weeks
   - Validation messages show all issues across all pages

## 🛠️ Built With

### Core Technologies
- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with Flexbox and Grid layout
- **Vanilla JavaScript (ES6+)** - No frameworks or external dependencies

### APIs & Features
- **Local Storage API** - Client-side data persistence
- **DOM Manipulation** - Dynamic UI updates
- **Event Delegation** - Efficient event handling
- **Responsive Design** - Mobile-first CSS with media queries

### Key Features
- No build tools required
- Zero external dependencies
- Works completely offline after initial load
- Cross-browser compatible

## � Project Structure

```
summer-marie.github.io/
├── index.html          # Main HTML structure
├── style.css           # Complete styling and responsive design
├── script.js           # Application logic (1400+ lines)
└── README.md           # Project documentation
```

### Script Organization
The `script.js` file is organized into clear sections:
- **Content Area Management** - Tab switching and UI state
- **FAQ Accordion Functionality** - Collapsible FAQ sections
- **Dynamic Sidebar Height** - Responsive sidebar behavior
- **Employee Management** - CRUD operations for employees
- **Schedule Generation Engine** - Core scheduling logic
- **Pagination System** - Multi-week navigation
- **Time Formatting Helpers** - Date/time utilities
- **Test Data Generation** - Development tools
- **Rules Management System** - Validation rule CRUD
- **Validation Engine** - Rule checking and enforcement
- **Visual Feedback Rendering** - Error/warning display

## 🌐 Browser Compatibility

Tested and supported on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Minimum Requirements:**
- JavaScript enabled
- Local Storage support
- Modern CSS support (Flexbox, Grid)

## 🔮 Future Enhancements
- **Database Implementation**: Replace local storage with backend database (SQL/NoSQL) for persistent, scalable data storage
- Import/Export employee and rule data (CSV, JSON formats)
- Print-optimized schedule views
- Calendar integration (Google Calendar, Outlook)
- Email notifications for schedule updates
- Multi-user collaboration with role-based permissions
- Template schedules for recurring patterns
- Advanced reporting and analytics dashboard
- Additional validation rule types (max hours, consecutive days, availability conflicts)

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2026 Summer Marie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👤 Author

**Summer Marie**
- GitHub: [@summer-marie](https://github.com/summer-marie)
- Project Link: [https://github.com/summer-marie/summer-marie.github.io](https://github.com/summer-marie/summer-marie.github.io)

---

**Version**: 1.0.0  
**Last Updated**: March 2026