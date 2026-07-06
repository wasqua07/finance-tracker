let expenseChart;

function updateChart() {

    const expenseData = {};
    const canvas = document.getElementById("expenseChart");

    if(!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    window.transactions.forEach(transaction => {

        if (transaction.type === "expense") {

            if (expenseData[transaction.category]) {
                expenseData[transaction.category] += transaction.amount;
            } else {
                expenseData[transaction.category] = transaction.amount;
            }

        }

    });

    const labels = Object.keys(expenseData);
    const data = Object.values(expenseData);


    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{

                label: "Expenses",

                data: data,

                backgroundColor: [
                    "#ef4444",
                    "#3b82f6",
                    "#10b981",
                    "#f59e0b",
                    "#8b5cf6",
                    "#06b6d4",
                    "#ec4899"
                ],

                borderWidth: 2

            }]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "bottom",
                    labels: {
                        color: "#7b8ea9"
                    }
                }

            }

        }

    });

}