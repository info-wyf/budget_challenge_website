let categoryCount = 3;
let itemCount = 1;

// Week 1-2: Calculate Net Income
function calculateNetIncome() {
    const salary = parseFloat(document.getElementById('salary').value);
    const taxRate = parseFloat(document.getElementById('taxRate').value);

    if (isNaN(salary) || isNaN(taxRate)) {
        document.getElementById('netIncomeResult').innerText = 'Please enter valid numbers.';
        return;
    }

    fetch('/calculate_net_income', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ salary, taxRate }),
    })
    .then(response => response.json())
    .then(data => {
        const monthlyNetIncome = data.netIncome / 12;
        document.getElementById('netIncomeResult').innerText = `Your monthly net income: $${monthlyNetIncome.toFixed(2)}`;
        document.getElementById('income').value = monthlyNetIncome.toFixed(2);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('netIncomeResult').innerText = 'Error calculating net income.';
    });
}

// Week 3-4: Allocate Budget
function addCategory() {
    categoryCount++;
    const div = document.createElement('div');
    div.className = 'category';
    div.innerHTML = `
        <label>Category ${categoryCount}:</label>
        <input type="text" placeholder="Category Name" class="category-name">
        <input type="number" placeholder="Percentage" class="category-percentage" step="0.01">
    `;
    document.getElementById('budgetCategories').appendChild(div);
}

function allocateBudget() {
    const income = parseFloat(document.getElementById('income').value);
    const categories = [];
    document.querySelectorAll('.category').forEach(categoryDiv => {
        const name = categoryDiv.querySelector('.category-name').value;
        const percentage = parseFloat(categoryDiv.querySelector('.category-percentage').value);
        if (name && !isNaN(percentage)) {
            categories.push({ category: name, percentage });
        }
    });

    if (isNaN(income) || categories.length === 0) {
        document.getElementById('budgetResult').innerText = 'Please enter valid income and categories.';
        return;
    }

    fetch('/allocate_budget', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ income, categories }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('budgetResult').innerHTML = data.error;
        } else {
            let result = '<h3>Budget Allocation:</h3>';
            for (const [category, amount] of Object.entries(data.allocations)) {
                result += `<p>${category}: $${amount.toFixed(2)}</p>`;
            }
            result += `<p>Remaining: $${data.remaining.toFixed(2)}</p>`;
            document.getElementById('budgetResult').innerHTML = result;
            document.getElementById('budgetChart').src = 'data:image/png;base64,' + data.chart;
            document.getElementById('budgetChart').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('budgetResult').innerText = 'Error allocating budget.';
    });
}

// Week 5-6: Grocery Challenge
function addItem() {
    itemCount++;
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
        <label>Item ${itemCount}:</label>
        <input type="text" placeholder="Item Name" class="item-name">
        <input type="number" placeholder="Price ($)" class="item-price" step="0.01">
        <input type="number" placeholder="Quantity" class="item-quantity" value="1">
    `;
    document.getElementById('groceryItems').appendChild(div);
}

function calculateGrocery() {
    const budget = parseFloat(document.getElementById('groceryBudget').value);
    const items = [];
    document.querySelectorAll('.item').forEach(itemDiv => {
        const name = itemDiv.querySelector('.item-name').value;
        const price = parseFloat(itemDiv.querySelector('.item-price').value);
        const quantity = parseInt(itemDiv.querySelector('.item-quantity').value);
        if (name && !isNaN(price) && !isNaN(quantity)) {
            items.push({ name, price, quantity });
        }
    });

    if (isNaN(budget) || items.length === 0) {
        document.getElementById('groceryResult').innerText = 'Please enter valid budget and items.';
        return;
    }

    fetch('/calculate_grocery', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ budget, items }),
    })
    .then(response => response.json())
    .then(data => {
        let result = `<h3>Grocery Total: $${data.totalCost.toFixed(2)}</h3>`;
        result += `<p>Within Budget: ${data.withinBudget ? 'Yes' : 'No'}</p>`;
        document.getElementById('groceryResult').innerHTML = result;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('groceryResult').innerText = 'Error calculating grocery total.';
    });
}

// Week 7-8: Adjust Budget
function adjustBudget() {
    const income = parseFloat(document.getElementById('currentIncome').value);
    const expenses = parseFloat(document.getElementById('currentExpenses').value);
    const adjustment = parseFloat(document.getElementById('adjustment').value);
    const isIncomeChange = document.getElementById('isIncomeChange').checked;

    if (isNaN(income) || isNaN(expenses) || isNaN(adjustment)) {
        document.getElementById('adjustResult').innerText = 'Please enter valid numbers.';
        return;
    }

    fetch('/adjust_budget', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ income, expenses, adjustment, isIncomeChange }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('adjustResult').innerText = `New Balance: $${data.newBalance.toFixed(2)}`;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('adjustResult').innerText = 'Error adjusting budget.';
    });
}

// Week 9-10: Calculate Savings
function calculateSavings() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const time = parseFloat(document.getElementById('time').value);

    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        document.getElementById('savingsResult').innerText = 'Please enter valid numbers.';
        return;
    }

    fetch('/calculate_savings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ principal, rate, time }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('savingsResult').innerText = `Total Savings: $${data.amount.toFixed(2)} (Interest Earned: $${data.interestEarned.toFixed(2)})`;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('savingsResult').innerText = 'Error calculating savings.';
    });
}