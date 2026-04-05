let transactions = JSON.parse(localStorage.getItem("transactions")) || [
  { id: 1, date: "2026-04-01", amount: 5000, category: "Salary", type: "income" },
  { id: 2, date: "2026-04-02", amount: 200, category: "Food", type: "expense" }
];

let filter = "all";

function save() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function render() {
  let income = 0, expense = 0;

  const table = document.getElementById("tableBody");
  table.innerHTML = "";

  let filtered = transactions.filter(t => filter === "all" || t.type === filter);

  filtered.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;

    table.innerHTML += `
      <tr>
        <td>${t.date}</td>
        <td>₹${t.amount}</td>
        <td>${t.category}</td>
        <td>${t.type}</td>
        <td><button onclick="deleteTransaction(${t.id})">Delete</button></td>
      </tr>`;
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expenses").innerText = expense;
  document.getElementById("balance").innerText = income - expense;

  renderCharts();
  renderInsights();
  save();
}

function addTransaction() {
  const date = document.getElementById("date").value;
  const amount = +document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;

  if (!date || !amount || !category) {
    alert("Fill all fields!");
    return;
  }

  transactions.push({
    id: Date.now(),
    date,
    amount,
    category,
    type
  });

  render();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  render();
}

function setFilter(f) {
  filter = f;
  render();
}

function renderInsights() {
  const expenses = transactions.filter(t => t.type === "expense");

  let map = {};
  expenses.forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });

  let highest = Object.entries(map).sort((a, b) => b[1] - a[1])[0];

  document.getElementById("insight").innerText =
    highest ? `Top Spending: ${highest[0]} | Total Transactions: ${transactions.length}`
            : "No data";
}

function renderCharts() {
  document.querySelector(".charts").innerHTML = `
    <canvas id="lineChart"></canvas>
    <canvas id="pieChart"></canvas>
  `;

  new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: transactions.map(t => t.date),
    datasets: [{
      label: "Amount",
      data: transactions.map(t => t.amount)
    }]
  },
  options: {
    animation: {
      duration: 1500
    }
  }
});

  let categories = {};
  transactions.forEach(t => {
    if (t.type === "expense") {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    }
  });

 new Chart(document.getElementById("pieChart"), {
  type: "pie",
  data: {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories)
    }]
  },
  options: {
    animation: {
      duration: 1500
    }
  }
});
function toggleDark() {
  document.body.classList.toggle("dark");
}
function animateValue(id, start, end) {
  let current = start;
  let interval = setInterval(() => {
    current += Math.ceil((end - start) / 20);
    if (current >= end) {
      current = end;
      clearInterval(interval);
    }
    document.getElementById(id).innerText = current;
  }, 30);
}
}
function toggleDark(){
  document.body.classList.toggle("dark");
}
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });
}
render(function animateValue(id, start, end) {
  let current = start;
  let interval = setInterval(() => {
    current += Math.ceil((end - start) / 20);
    if (current >= end) {
      current = end;
      clearInterval(interval);
    }
    document.getElementById(id).innerText = current;
  }, 30);
});