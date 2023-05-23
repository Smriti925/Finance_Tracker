document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const descriptionInput = document.getElementById("descriptionInput");
  const amountInput = document.getElementById("amountInput");
  const typeSelect = document.getElementById("typeSelect");
  const transactionList = document.getElementById("transactionList");
  const balanceAmount = document.getElementById("balanceAmount");
  const transactionsPerformed = [];

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;
    const date = new Date();

    if (
      description === "" ||
      !isFinite(amount) ||
      isNaN(amount) ||
      amount <= 0
    ) {
      alert("Enter a valid description and amount.");
      return;
    }

    const transaction = {
      id: Date.now(),
      description,
      amount,
      type,
      date,
    };
    transactionsPerformed.push(transaction);

    renderTransactionList();
    updateBalance();

    descriptionInput.value = "";
    amountInput.value = "";
  });

  function renderTransactionList() {
    transactionList.innerHTML = "";

    transactionsPerformed.forEach(function (transaction) {
      const listItem = document.createElement("div");
      listItem.classList.add(
        "w-full",
        "flex",
        "items-center",
        "justify-between",
        "border-b",
        "border-gray-300",
        "py-2"
      );

      const description = document.createElement("div");
      description.textContent = transaction.description;

      const amount = document.createElement("div");
      amount.textContent = transaction.amount.toFixed(2);
      amount.classList.add(
        transaction.type === "income" ? "text-green-600" : "text-red-600"
      );
      const date = document.createElement("div");
      date.textContent = transaction.date.toLocaleString();

      const buttons = document.createElement("div");
      buttons.innerHTML = `
              <button data-id="${transaction.id}" class="editButton text-blue-600 mr-2">Edit</button>
              <button data-id="${transaction.id}" class="deleteButton text-red-600">Delete</button>
            `;

      listItem.appendChild(description);
      listItem.appendChild(amount);
      listItem.appendChild(date);
      listItem.appendChild(buttons);

      transactionList.appendChild(listItem);
    });

    const deleteButtons = document.getElementsByClassName("deleteButton");
    const editButtons = document.getElementsByClassName("editButton");

    Array.from(deleteButtons).forEach(function (button) {
      button.addEventListener("click", function () {
        const id = parseInt(button.getAttribute("data-id"));
        deleteTransaction(id);
      });
    });

    Array.from(editButtons).forEach(function (button) {
      button.addEventListener("click", function () {
        const id = parseInt(button.getAttribute("data-id"));
        editTransaction(id);
      });
    });
  }

  function deleteTransaction(id) {
    const index = transactionsPerformed.findIndex(function (transaction) {
      return transaction.id === id;
    });

    if (index !== -1) {
      transactionsPerformed.splice(index, 1);
      renderTransactionList();
      updateBalance();
    }
  }
  //edit transaction----------
  function editTransaction(id) {
    const transaction = transactionsPerformed.find(function (transaction) {
      return transaction.id === id;
    });

    if (transaction) {
      descriptionInput.value = transaction.description;
      amountInput.value = transaction.amount;
      typeSelect.value = transaction.type;

      deleteTransaction(id);
    }
  }
  //update balance--------------
  function updateBalance() {
    const balance = transactionsPerformed.reduce(function (total, transaction) {
      return transaction.type === "income"
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);

    balanceAmount.textContent = balance.toFixed(2);
  }
});
