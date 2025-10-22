// Find the dropdown menu where you pick a friend
const selector = document.getElementById("friendSelector");
// DOM Element Reference - Find the dropdown to filter by subject 
const subjectFilter = document.getElementById("filter-subject");
// DOM Element Reference - Find the dropdown to filter by period 
const periodFilter = document.getElementById("filter-period");
// DOM Element Reference - Find the box on the page where we'll show all the classes
const container = document.getElementById("scheduleContainer");

const schedules = {
  yasmina: "yasmina.json",
  shaili: "shaili.json",
  alyson: "alyson.json",
};

// Array - An empty box to store the schedule we're looking at right now
let currentData = [];

// Function - This fills up the filter dropdowns with choices
function populateFilters(data) {
  // String  - Clear ut the old choices and add the  Filter by Subjec option
  subjectFilter.innerHTML = `<option value="">Filter by Subject</option>`;
  // String html - Clear out the old choices and add the  Filter by Periodoption
  periodFilter.innerHTML = `<option value="">Filter by Period</option>`;

  const subjects = new Set();
  const periods = new Set();

  // Loop  - Look at every singe class in the schedule
  data.forEach((item) => {
    // String - Put the subject in our subjects area 
    subjects.add(item.subjectArea || item.subjectAre || "General");
    // String - Put the period in our periods area
    periods.add(item.period);
  });

  // Array & Loop - Turn the subjects area into a ist, sort it alphabetically, and add each one as a choice
  [...subjects].sort().forEach((s) => {
    // DOM Element - Create a new dropdown option
    const opt = document.createElement("option");
    // String - Set the value
    opt.value = s;
    // String - Set the text you see
    opt.textContent = s;
    // Add this option to the subject filter dropdown
    subjectFilter.appendChild(opt);
  });

  // Array & Loop - Turn the peiods area into a list sort it in order and add each one as a choic
  [...periods].sort().forEach((p) => {
    // DOM Element - Create a new dropdown option
    const opt = document.createElement("option");
    // String - Set the value
    opt.value = p;
    // String - Set the text you see
    opt.textContent = p;
    // Add this option to the period filter dropdown
    periodFilter.appendChild(opt);
  });
}

// Function - This shows all the class cards on the screen
function renderSchedule(data) {
  // String - Erase everything that was on the screen before
  container.innerHTML = "";

  //If there are no classes to showdisplay a message 
  if (data.length === 0) {
    // String - Show no result message
    container.innerHTML = '<div class="no-results">No class match the filters.</div>';
    return;
  }

  // OM Element - Make a new bx to hold all the class cards
  const cardsContainer = document.createElement("div");
  // String - Give it a class name for styling
  cardsContainer.className = "schedule-cards";

  // Loop - Go through each class 
  data.forEach((item) => {
    //  Temple Literal - This is the HTML code for one class card 
    const cardHTML = `
      <div class="schedule-card">
        <span class="period-badge">${item.period}</span>
        <div class="class-name">${item.className}</div>
        <div class="card-info">
          <strong>Teacher:</strong> ${item.teacher}
        </div>
        <div class="card-info">
          <strong>Room:</strong> ${item.roomNumber}
        </div>
        <span class="subject-tag">${item.subjectArea || item.subjectAre || "General"}</span>
      </div>
    `;
    // Method - Stick this card into our card container
    cardsContainer.insertAdjacentHTML("beforeend", cardHTML);
  });

  // Method - Put all the cards onto the webpage
  container.appendChild(cardsContainer);
}

// ASYNC PART - This goes and gets the schedule from fiel
async function loadSchedule(fileName) {

  try {
    // the file from the json folder 
    const response = await fetch(`./json/${fileName}`);
    //  JSON - Read what's inside the file and turn it into a list of clases
    const data = await response.json();

    currentData = data;
    // Function  fill up the filter dropdowns with subjects and periods from this schedule
    populateFilters(currentData);
    // Function  show all the classes on the screen
    renderSchedule(currentData);
  } catch (err) {
  }
}

// Functon - This filters the classes based on what you picked in the dropdowns
function applyFilters() {
  // String - See what subject the user picked 
  const subject = subjectFilter.value;
  // String - See what period the user picked 
  const period = periodFilter.value;

  // Array (filter way) - Go through all the classes and only keep the ones that match the filters
  const filtered = currentData.filter((item) => {
    // String - Get the subject of this class
    const itemSubject = item.subjectArea || item.subjectAre || "General";
    // Boolean - If this class match the subject filter
    const matchSubject = subject ? itemSubject === subject : true;
    // if this class match the period fiter
    const matchPeriod = period ? item.period === period : true;
    //  Only keep this class if it matches both filters
    return matchSubject && matchPeriod;
  });

  // Function Call - Show only the classes that passed the filters
  renderSchedule(filtered);
}

// Event Listener - Listen for when soeone picks a diffrent friend from the dropdown
selector.addEventListener("change", () => {
  // String - Find out which friend they piced
  const selected = selector.value;
  // String - Look up that friend's file name
  const fileName = schedules[selected];
  
  // Conditional (if statement) - If they pickd a real friend (not the Flter by Friend option)
  if (fileName) {
    // String - Clear any filters they had selected
    subjectFilter.value = "";
    periodFilter.value = "";
    // Function Call - Load that friend's schedule
    loadSchedule(fileName);
  }
});

// Event Listener - Listen for when someone changs the subject filter
subjectFilter.addEventListener("change", applyFilters);

// Event Listener - Listen for when someone chanes the period filter
periodFilter.addEventListener("change", applyFilters);

// Strin- Show a message telling them to pick a frind to get started
container.innerHTML = '<div class="loading">Select a student!</div>';