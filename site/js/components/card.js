function createStatItem(label, value) {
    const item = document.createElement("div");
    item.className = "stat-item";
  
    const labelEl = document.createElement("span");
    labelEl.className = "stat-label";
    labelEl.textContent = label;
  
    const valueEl = document.createElement("span");
    valueEl.className = "stat-value";
    valueEl.textContent = value;
  
    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }
  
  function createTagRow(tagsString) {
    const tags = (tagsString || "")
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
  
    if (tags.length === 0) return null;
  
    const row = document.createElement("div");
    row.className = "tag-row";
  
    tags.forEach(tag => {
      const chip = document.createElement("span");
      chip.className = "tag-chip";
      chip.textContent = tag;
      row.appendChild(chip);
    });
  
    return row;
  }
  
  export function createCard(dataset) {
    const card = document.createElement("div");
    card.className = "dataset-card";
  
    const body = document.createElement("div");
    body.className = "card-body";
  
    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = dataset.name;
    body.appendChild(name);
  
    const statGrid = document.createElement("div");
    statGrid.className = "stat-grid";
    statGrid.appendChild(createStatItem("Quantitative", dataset.num_quantitative));
    statGrid.appendChild(createStatItem("Categorical", dataset.num_categorical));
    statGrid.appendChild(createStatItem("Temporal", dataset.num_temporal));
    statGrid.appendChild(createStatItem("Geographic", dataset.num_geographic));
    body.appendChild(statGrid);
  
    const tagRow = createTagRow(dataset.ml_tags);
    if (tagRow) body.appendChild(tagRow);
  
    const meetsMinimum = dataset.meets_minimum === true || dataset.meets_minimum === "True" || dataset.meets_minimum === "true";
    const badge = document.createElement("span");
    badge.className = "status-badge " + (meetsMinimum ? "pass" : "fail");
    badge.textContent = meetsMinimum ? "Meets minimum" : "Below minimum";
    body.appendChild(badge);
  
    card.appendChild(body);
    return card;
  }