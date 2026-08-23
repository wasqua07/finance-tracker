let transactions = [];
let editId = null;

const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const count = document.getElementById("count");

const search = document.getElementById("search");
const filter = document.getElementById("filter");

const themeBtn = document.getElementById("theme-btn");
const submitButton = document.querySelector("#transaction-form button");


// =========================
// EVENT LISTENERS
// =========================

form.addEventListener("submit", addTransaction);
search.addEventListener("input", filterTransactions);
filter.addEventListener("change", filterTransactions);
themeBtn.addEventListener("click", toggleTheme);


// =========================
// ADD / UPDATE TRANSACTION
// =========================

function addTransaction(e) {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (title === "" || amount <= 0 || date === "") {
        alert("Please fill all the fields correctly.");
        return;
    }

    const transaction = {
        id: editId === null ? Date.now() : editId,
        title,
        amount,
        type,
        category,
        date
    };


    // Add new transaction
    if (editId === null) {

        transactions.push(transaction);

    }

    // Update existing transaction
    else {

        const index = transactions.findIndex(
            transaction => transaction.id === editId
        );

        if (index === -1) {
            alert("Transaction not found.");
            resetForm();
            return;
        }

        transactions[index] = transaction;
        editId = null;

        submitButton.textContent = "Add Transaction";
    }


    // Keep global transactions synchronized
    window.transactions = transactions;

    saveTransactions();

    filterTransactions();
    updateSummary();
    updateChart();

    resetForm();
}


// =========================
// DISPLAY TRANSACTIONS
// =========================

function displayTransactions(data = transactions) {

    transactionList.innerHTML = "";

    if (data.length === 0) {

        transactionList.innerHTML = `
            <div class="empty-state">
                <h3>No Transactions Yet</h3>
                <p>Add your first transaction.</p>
            </div>
        `;

        return;
    }


    data.forEach((transaction) => {

        transactionList.innerHTML += `
            <div class="transaction">

                <div>

                    <p>${getCategoryIcon(transaction.category)}</p>

                    <h3>${transaction.title}</h3>

                    <small>${formatDate(transaction.date)}</small>

                </div>


                <div class="transaction-right">

                    <strong class="${transaction.type}">
                        ${transaction.type === "income" ? "+" : "-"}₹${formatCurrency(transaction.amount)}
                    </strong>

                    <br>

                    <p>${transaction.type}</p>

                    <br><br>

                    <button
                        class="edit-btn"
                        onclick="editTransaction(${transaction.id})"
                    >
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${transaction.id})"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Delete
                    </button>

                </div>

            </div>
        `;
    });
}


// =========================
// UPDATE SUMMARY
// =========================

function updateSummary() {

    let totalIncome = 0;
    let totalExpense = 0;


    transactions.forEach((transaction) => {

        const amount = Number(transaction.amount);

        if (transaction.type === "income") {

            totalIncome += amount;

        } else {

            totalExpense += amount;

        }

    });


    const totalBalance = totalIncome - totalExpense;


    balance.textContent = `₹${formatCurrency(totalBalance)}`;

    income.textContent = `₹${formatCurrency(totalIncome)}`;

    expense.textContent = `₹${formatCurrency(totalExpense)}`;

    count.textContent = transactions.length;
}


// =========================
// SEARCH & FILTER
// =========================

function filterTransactions() {

    const searchText = search.value.trim().toLowerCase();

    const filterValue = filter.value;


    const filteredTransactions = transactions.filter((transaction) => {

        const title = transaction.title.toLowerCase();

        const category = transaction.category.toLowerCase();

        const type = transaction.type.toLowerCase();


        const matchesSearch =
            title.includes(searchText) ||
            category.includes(searchText) ||
            type.includes(searchText);


        const matchesFilter =
            filterValue === "all" ||
            transaction.type === filterValue;


        return matchesSearch && matchesFilter;
    });


    displayTransactions(filteredTransactions);
}


// =========================
// DELETE TRANSACTION
// =========================

function deleteTransaction(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
        return;
    }


    transactions = transactions.filter(
        transaction => transaction.id !== id
    );


    window.transactions = transactions;

    saveTransactions();

    updateSummary();
    filterTransactions();
    updateChart();
}


// =========================
// EDIT TRANSACTION
// =========================

function editTransaction(id) {

    const transaction = transactions.find(
        transaction => transaction.id === id
    );


    if (!transaction) {

        alert("Transaction not found.");

        return;
    }


    document.getElementById("title").value = transaction.title;

    document.getElementById("amount").value = transaction.amount;

    document.getElementById("type").value = transaction.type;

    document.getElementById("category").value = transaction.category;

    document.getElementById("date").value = transaction.date;


    editId = id;

    submitButton.textContent = "Update Transaction";


    // Scroll to form
    document.querySelector(".add-transaction").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// =========================
// RESET FORM
// =========================

function resetForm() {

    form.reset();

    editId = null;

    submitButton.textContent = "Add Transaction";


    // Set today's date automatically
    setTodayDate();
}


// =========================
// SET TODAY'S DATE
// =========================

function setTodayDate() {

    const dateInput = document.getElementById("date");

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");


    dateInput.value = `${year}-${month}-${day}`;
}


// =========================
// DARK MODE
// =========================

function toggleTheme() {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';
    }
}


// =========================
// LOAD SAVED THEME
// =========================

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';
    }
}


// =========================
// INITIALIZE APP
// =========================

loadTransactions();

window.transactions = transactions;

setTodayDate();

loadTheme();
