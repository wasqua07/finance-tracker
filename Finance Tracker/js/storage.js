
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
    const savedTransactions = localStorage.getItem("transactions");

    if(savedTransactions) {
        transactions = JSON.parse(savedTransactions);

        window.transactions = transactions;

        displayTransactions();
        updateSummary();
        updateChart();
    }
}

