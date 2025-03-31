const sheetId = "1fVUg7nPfGwTv9-wu0G_8xkFC7IV7QALrf0nnErgzQIQ"; // Your Google Sheet ID
const apiKey = "AIzaSyCSQzCUSW0dlpFL6eFr5ifSpYw6P82j-rY"; // Your API Key
const range = "Montreal-March2025!B,M,N,O,P,Q,R,S"; // Correct Sheet Name

let currentPage = 1;
const rowsPerPage = 5;
let sheetData = [];

async function fetchGoogleSheet() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.values) {
            console.error("No data found in the sheet.");
            return;
        }

        sheetData = data.values.slice(1); // Skip header row
        displayData();
    } catch (error) {
        console.error("Error fetching Google Sheets data:", error);
    }
}

function displayData() {
    const tbody = document.getElementById("sheetData");
    tbody.innerHTML = "";

    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;

    sheetData.slice(start, end).forEach(row => {
        let tr = document.createElement("tr");
        row.forEach(cell => {
            let td = document.createElement("td");
            td.textContent = cell || "N/A";
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function searchData() {
    let filter = document.getElementById("searchBox").value.toUpperCase();
    let rows = document.querySelectorAll("#sheetData tr");

    rows.forEach(row => {
        let name = row.cells[5]?.textContent.toUpperCase() || ""; // Full Name in Column R (Index 5)
        row.style.display = name.includes(filter) ? "" : "none";
    });
}

function nextPage() {
    if ((currentPage * rowsPerPage) < sheetData.length) {
        currentPage++;
        displayData();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayData();
    }
}

fetchGoogleSheet(); // Fetch data on page load
