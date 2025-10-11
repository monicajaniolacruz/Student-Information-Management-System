const apiUrl = "/students";
const studentsContainer = document.getElementById("studentsContainer");
const searchInput = document.getElementById("searchInput");
let students = [];

// Fetch Students
async function fetchStudents() {
  try {
    const res = await fetch(apiUrl);
    students = await res.json();
    displayStudents(students);
    setupSearch();
  } catch (err) {
    console.error("Failed to fetch students:", err);
  }
}

// Display Students with Edit & Delete buttons
function displayStudents(list) {
  studentsContainer.innerHTML = "";
  if (list.length === 0) {
    studentsContainer.innerHTML = `
      <tr>
        <td colspan="8" class="text-muted text-center">
          No students found.
        </td>
      </tr>`;
    return;
  }

  list.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.studentId}</td>
      <td>${student.fullName}</td>
      <td>${student.gender}</td>
      <td>${student.gmail}</td>
      <td>${student.program}</td>
      <td>${student.yearLevel}</td>
      <td>${student.university}</td>
     <td class="text-center">
  <button class="action-btn edit-btn me-1" onclick="editStudent(${index})" title="Edit">
    <i class="bi bi-pencil-fill"></i>
  </button>
  <button class="action-btn delete-btn" onclick="deleteStudent(${index})" title="Delete">
    <i class="bi bi-trash-fill"></i>
  </button>
</td>

    `;
    studentsContainer.appendChild(row);
  });
}

// Search Functionality (name/program/gender)
document.getElementById("searchInput").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();

  const filtered = students.filter((s) => {
    const fullName = s.fullName?.toLowerCase().trim() || "";
    const program = s.program?.toLowerCase().trim() || "";
    const gender = s.gender?.toLowerCase().trim() || "";

    // special handling for "male" or "female"
    if (q === "male") return gender === "male";
    if (q === "female") return gender === "female";

    // default: match any field
    return fullName.includes(q) || program.includes(q) || gender.includes(q);
  });

  displayStudents(filtered);
});

// Open modal for adding
function openAddForm() {
  document.getElementById("studentModalLabel").innerText = "Add Student";
  document.getElementById("studentForm").reset();
  document.getElementById("studentIndex").value = "";
}

// Save or update student
function saveStudent() {
  const index = document.getElementById("studentIndex").value;
  const student = {
    studentId: document.getElementById("studentId").value,
    fullName: document.getElementById("fullName").value,
    gender: document.getElementById("gender").value,
    gmail: document.getElementById("email").value,
    program: document.getElementById("program").value,
    yearLevel: document.getElementById("yearLevel").value,
    university: document.getElementById("university").value,
  };

  if (index === "") {
    students.push(student);
  } else {
    students[index] = student;
  }

  displayStudents(students);
  bootstrap.Modal.getInstance(document.getElementById("studentModal")).hide();
}

// Edit student
function editStudent(index) {
  const s = students[index];
  document.getElementById("studentModalLabel").innerText = "Edit Student";
  document.getElementById("studentId").value = s.studentId;
  document.getElementById("fullName").value = s.fullName;
  document.getElementById("gender").value = s.gender;
  document.getElementById("email").value = s.gmail;
  document.getElementById("program").value = s.program;
  document.getElementById("yearLevel").value = s.yearLevel;
  document.getElementById("university").value = s.university;
  document.getElementById("studentIndex").value = index;

  const modal = new bootstrap.Modal(document.getElementById("studentModal"));
  modal.show();
}

// Delete student
function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    displayStudents(students);
  }
}

// Save or update student with validation
function saveStudent() {
  const index = document.getElementById("studentIndex").value;
  const studentId = document.getElementById("studentId").value.trim();
  const fullName = document.getElementById("fullName").value.trim();
  const gender = document.getElementById("gender").value.trim();
  const gmail = document.getElementById("email").value.trim();
  const program = document.getElementById("program").value.trim();
  const yearLevel = document.getElementById("yearLevel").value.trim();
  const university = document.getElementById("university").value.trim();

  // Validation patterns
  const idPattern = /^(?=.*[A-Za-z])(?=.*-)(?=.*\d).+$/;
  const namePattern = /^[A-Za-z.]+(?:\s[A-Za-z.]+)+$/;
  const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const programPattern = /^BS\s[A-Za-z\s]+$/i;
  const yearLevelPattern = /^(1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th) Year$/i;
  const universityPattern = /^[A-Za-z\-\(\)]+(?:\s[A-Za-z\-\(\)]+){2,}$/;

  // Validation checks
  if (!idPattern.test(studentId)) {
    alert("Invalid Student ID. Must contain letter,dash, and number");
    return;
  }

  if (!namePattern.test(fullName)) {
    alert("Invalid Full Name. Must be at least 2 words");
    return;
  }

  if (!gmailPattern.test(gmail)) {
    alert("Invalid Gmail. Must be a valid Gmail address.");
    return;
  }

  if (!programPattern.test(program)) {
    alert("Invalid Program. (Ex. BS Physics)");
    return;
  }

  if (!yearLevelPattern.test(yearLevel)) {
    alert("Invalid Year Level. (Ex. 1st Year)");
    return;
  }

  if (!universityPattern.test(university)) {
    alert(
      "Invalid University. Must be at least 3 words and contain letters only."
    );
    return;
  }

  // If all validations pass, save the student
  const student = {
    studentId,
    fullName,
    gender,
    gmail,
    program,
    yearLevel,
    university,
  };

  if (index === "") {
    students.push(student);
  } else {
    students[index] = student;
  }

  displayStudents(students);
  bootstrap.Modal.getInstance(document.getElementById("studentModal")).hide();
}

fetchStudents();
