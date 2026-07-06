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

form.addEventListener("submit", addTransaction);
search.addEventListener("input", filterTransactions);
filter.addEventListener("change", filterTransactions);

function addTransaction(e) {

    e.preventDefault();

    const title = document.getElementById("title").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (title === "" || amount <= 0 || date === "") {
        alert("Please fill all the fields correctly.");
        return;
    }

    const transaction = {
        id: Date.now(),
        title,
        amount,
        type,
        category,
        date
    };

    
    if(editId === null) {
        transactions.push(transaction);
        window.transactions = transactions;
    } else {
        const index = transactions.findIndex(transaction => transaction.id === editId);

        transaction.id = editId;
        transactions[index] = transaction;
        window.transactions = transactions;
        editId = null;

        document.querySelector("#transaction-form button").textContent = "Add Transaction";
    }

    saveTransactions();
    filterTransactions();
    updateSummary();
    updateChart();
    form.reset();

}


function displayTransactions(data = transactions) {

    transactionList.innerHTML = "";

    if (data.length === 0) {
        transactionList.innerHTML = 
            `<div class="empty-state">
                <h3> No Transactions Yet</h3>
                <p>Add your first transaction.</p>
            </div>`
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
                    <strong class="${transaction.type}"> ${transaction.type === "income" ? "+" : "-"}₹${formatCurrency(transaction.amount)}</strong>
                    <br>

                    <p>${transaction.type}</p>

                    <br><br>

                    <button class="edit-btn" onclick="editTransaction(${transaction.id})">
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </button>
                    
                    <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">
                        <i class="fa-solid fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
            `;
    });
}


function updateSummary() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
        if (transaction.type === "income") {
            totalIncome += Number(transaction.amount);
        } else {
            totalExpense += Number(transaction.amount);
        }
    });

    const totalBalance = totalIncome - totalExpense;
    balance.textContent = `₹${formatCurrency(totalBalance)}`;
    income.textContent = `₹${formatCurrency(totalIncome)}`;
    expense.textContent = `₹${formatCurrency(totalExpense)}`;
    count.textContent = transactions.length;


}

function filterTransactions() {

    const searchText = search.value.toLowerCase();
    const filterValue = filter.value;

    const filteredTransactions = transactions.filter((transaction) => {

        const matchesSearch = transaction.title.toLowerCase().includes(searchText);

        const matchesFilter = filterValue === "all" || transaction.type === filterValue;

        return matchesSearch && matchesFilter;
    });

    displayTransactions(filteredTransactions);
}

function deleteTransaction(id) {
    // console.log(id);

    const confirmDelete = confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) {
        return;
    }
    transactions = transactions.filter((transaction) => {
        return transaction.id !== id;

    });
    window.transactions = transactions;
    saveTransactions();

    updateSummary();
    filterTransactions();
    updateChart();
}

function editTransaction(id) {
    
    const transaction = transactions.find(transaction => 
        transaction.id === id);
        
        document.getElementById("title").value = transaction.title;
        document.getElementById("amount").value = transaction.amount;
        document.getElementById("type").value = transaction.type;
    document.getElementById("category").value = transaction.category;
    document.getElementById("date").value = transaction.date;
    
    editId = id;
    
    document.querySelector("#transaction-form button").textContent = "Update Transaction";
}

loadTransactions();
window.transactions = transactions;


const themeBtn = document.getElementById("theme-btn");

// console.log(themeBtn);
themeBtn.addEventListener("click", toggleTheme);

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

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}

