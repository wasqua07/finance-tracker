function formatDate(date) {
    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }; 

    return new
Date(date).toLocaleDateString("en-IN", options);
}


function getCategoryIcon(category) {
    const icons = {
        Food: "🍔",
        Shopping: "🛍️",
        Travel: "✈️",
        Salary: "💸",
        Entertainment: "🎬",
        Bills: "📄",
        Others: "📦"
    };

    return icons[category] || "📌";
}

function formatCurrency(amount) {
    return amount.toLocaleString("en-IN");
}