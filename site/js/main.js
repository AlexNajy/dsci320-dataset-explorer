import { createTopbar } from "./components/topbar.js";
import { createCard } from "./components/card.js";

function createMain() {
  const main = document.createElement("main");
  main.className = "content";

  const grid = document.createElement("div");
  grid.id = "dataset-grid";
  grid.className = "dataset-grid";

  main.appendChild(grid);
  return main;
}

async function init() {
  const app = document.getElementById("app");
  app.appendChild(createTopbar());
  app.appendChild(createMain());

  const grid = document.getElementById("dataset-grid");

  try {
    const response = await fetch("data.json");
    const datasets = await response.json();
    datasets.forEach(dataset => {
      grid.appendChild(createCard(dataset));
    });
  } catch (err) {
    const message = document.createElement("p");
    message.style.color = "#5F6368";
    message.textContent = "Could not load dataset data.";
    grid.appendChild(message);
    console.error(err);
  }
}

init();