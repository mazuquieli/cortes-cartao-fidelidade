import { cardsFetch } from "./services/cards-fetch";

const cardIdInput = document.getElementById("card-id");
const searchButton = document.getElementById("search-button");
const clientName = document.getElementById("client-name");
const clientSince = document.getElementById("client-since");
const cardIdNumber = document.getElementById("card-id-number");
const cutsRemaining = document.getElementById("cuts-remaining");
const cutsCompleted = document.getElementById("cuts-completed");
const cutsNeeded = document.getElementById("cuts-needed");
const totalCuts = document.getElementById("total-cuts");
const appointmentList = document.getElementById("appointment-list");
const progressFill = document.querySelector(".progress-fill");
const stampsContainer = document.querySelector(".stamps-container");
const congratulationsModal = document.getElementById("congratulations-modal");
const countText = document.getElementById("count-text");

async function displayClientInfo(cardId) {
  const client = await cardsFetch(cardId);

  if (!client) {
    alert("Cliente não encontrado. Por favor, verifique o número do cartão.");
    return;
  }

  clientName.textContent = client.name;
  clientSince.textContent = `Cliente desde ${client.clientSince}`;
  cardIdNumber.textContent = `ID: ${client.id}`;

  cutsRemaining.textContent = client.loyaltyCard.cutsRemaining;
  cutsCompleted.textContent = client.loyaltyCard.totalCuts;
  cutsNeeded.textContent = client.loyaltyCard.cutsNeeded;
  totalCuts.textContent = `${client.loyaltyCard.totalCuts} cortes`;
  console.log("Cuts remaining:", client.loyaltyCard.cutsNeeded);
  countText.textContent = `Ao fazer cortes de cabelo, o ${numeroExtenso(
    client.loyaltyCard.cutsNeeded
  )} sai de graça!`;

  const progressPercentage =
    (client.loyaltyCard.totalCuts / client.loyaltyCard.cutsNeeded) * 100;
  progressFill.style.width = `${progressPercentage}%`;

  // updateStamps(client.loyaltyCard.totalCuts, client.loyaltyCard.cutsNeeded);

  generateStamps(client.loyaltyCard.totalCuts, client.loyaltyCard.cutsNeeded);

  appointmentList.innerHTML = "";
  client.appointmentHistory.forEach((appointment) => {
    const listItem = document.createElement("li");
    listItem.className = "history-item";

    listItem.innerHTML = `
      <div class="history-date">
        <div>${appointment.date}</div>
        <div class="history-time">${appointment.time}</div>
      </div>
      <div class="history-check">
        <img src="./src/assets/vector1.svg" alt="Concluído" />
      </div>
    `;

    appointmentList.appendChild(listItem);
  });
  if (client.loyaltyCard.cutsNeeded === client.loyaltyCard.totalCuts) {
    alert("Parabéns! Seu próximo corte é gratuito!");
  }
}

function numeroExtenso(num) {
  console.log("Numero:", num);
  const unidade =
    num === 5
      ? "quinto"
      : num === 6
      ? "sexto"
      : num === 7
      ? "sétimo"
      : num === 8
      ? "oitavo"
      : num === 9
      ? "nono"
      : "décimo";
  return unidade;
}

function updateStamps(completedCuts, totalNeeded) {
  const stamps = document.querySelectorAll(".stamp:not(.gift)");

  stamps.forEach((stamp) => {
    console.log("Resetting stamp:", stamp);
    stamp.className = "stamp";
    stamp.innerHTML = "";
  });

  for (let i = 0; i < completedCuts && i < stamps.length; i++) {
    stamps[i].className = "stamp active";
  }
}

function generateStamps(completedCuts, totalNeeded) {
  stampsContainer.innerHTML = "";

  const regularStampsCount = totalNeeded - 1;

  const stampsPerRow = 5;

  const rowsNeeded =
    Math.ceil(regularStampsCount / stampsPerRow) +
    (regularStampsCount % stampsPerRow === 0 ? 1 : 0);

  let stampIndex = 0;

  for (let row = 0; row < rowsNeeded; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "stamps-row";

    const isLastRow = row === rowsNeeded - 1;

    let stampsInThisRow = isLastRow
      ? regularStampsCount - stampIndex
      : Math.min(stampsPerRow, regularStampsCount - stampIndex);

    if (isLastRow) {
      for (let i = 0; i < stampsInThisRow; i++) {
        const stamp = document.createElement("div");
        stamp.className = stampIndex < completedCuts ? "stamp active" : "stamp";
        rowDiv.appendChild(stamp);
        stampIndex++;
      }

      const giftStamp = document.createElement("div");
      giftStamp.className = "stamp gift";
      giftStamp.innerHTML =
        '<img src="/src/assets/gift-fill.svg" alt="Prêmio" />';
      rowDiv.appendChild(giftStamp);
    } else {
      for (let i = 0; i < stampsInThisRow; i++) {
        const stamp = document.createElement("div");
        stamp.className = stampIndex < completedCuts ? "stamp active" : "stamp";
        rowDiv.appendChild(stamp);
        stampIndex++;
      }
    }

    stampsContainer.appendChild(rowDiv);
  }
}

searchButton.addEventListener("click", () => {
  const cardId = cardIdInput.value.trim();
  console.log("Card ID:", cardId);
  if (cardId) {
    displayClientInfo(cardId);
  } else {
    alert("Por favor, insira um número de cartão válido.");
  }
});

cardIdInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchButton.click();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  displayClientInfo("1");
});
