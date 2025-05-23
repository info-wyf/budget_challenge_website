from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculator')
def calculator():
    return render_template('calculator.html')

@app.route('/grocery')
def grocery():
    return render_template('grocery.html')

@app.route('/tracker')
def tracker():
    return render_template('tracker.html')

@app.route('/resources')
def resources():
    return render_template('resources.html')

@app.route('/calculate_net_income', methods=['POST'])
def calculate_net_income():
    data = request.get_json()
    salary = float(data['salary'])
    tax_rate = float(data['taxRate'])
    net_income = salary * (1 - tax_rate / 100)
    return jsonify({'netIncome': net_income})

@app.route('/allocate_budget', methods=['POST'])
def allocate_budget():
    data = request.get_json()
    income = float(data['income'])
    categories = data['categories']  # List of {category: percentage}
    allocations = {cat['category']: (income * cat['percentage'] / 100) for cat in categories}
    total_percentage = sum(cat['percentage'] for cat in categories)
    if total_percentage > 100:
        return jsonify({'error': 'Total percentage exceeds 100%'})
    remaining = income - sum(allocations.values())
    return jsonify({'allocations': allocations, 'remaining': remaining})

@app.route('/calculate_grocery', methods=['POST'])
def calculate_grocery():
    data = request.get_json()
    items = data['items']  # List of {name: str, price: float, quantity: int}
    budget = float(data['budget'])
    total_cost = sum(item['price'] * item['quantity'] for item in items)
    within_budget = total_cost <= budget
    return jsonify({'totalCost': total_cost, 'withinBudget': within_budget})

@app.route('/adjust_budget', methods=['POST'])
def adjust_budget():
    data = request.get_json()
    income = float(data['income'])
    expenses = float(data['expenses'])
    adjustment = float(data['adjustment'])
    new_income = income + (adjustment if data['isIncomeChange'] else 0)
    new_expenses = expenses + (adjustment if not data['isIncomeChange'] else 0)
    new_balance = new_income - new_expenses
    return jsonify({'newBalance': new_balance})

@app.route('/calculate_savings', methods=['POST'])
def calculate_savings():
    data = request.get_json()
    principal = float(data['principal'])
    rate = float(data['rate']) / 100  # Annual interest rate in percentage
    time = float(data['time'])  # Time in years
    compounds_per_year = 12  # Monthly compounding
    amount = principal * math.pow(1 + rate / compounds_per_year, compounds_per_year * time)
    interest_earned = amount - principal
    return jsonify({'amount': amount, 'interestEarned': interest_earned})

if __name__ == '__main__':
    app.run(debug=True)
