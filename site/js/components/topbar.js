export function createTopbar() {
    const header = document.createElement("header");
    header.className = "topbar";
  
    const inner = document.createElement("div");
    inner.className = "topbar-inner";
  
    const title = document.createElement("span");
    title.className = "topbar-title";
    title.textContent = "Dataset Explorer";
    inner.appendChild(title);
  
    const searchBar = document.createElement("div");
    searchBar.className = "search-bar";
    searchBar.setAttribute("aria-disabled", "true");
  
    const svgNS = "http://www.w3.org/2000/svg";
    const icon = document.createElementNS(svgNS, "svg");
    icon.setAttribute("class", "search-icon");
    icon.setAttribute("width", "16");
    icon.setAttribute("height", "16");
    icon.setAttribute("viewBox", "0 0 16 16");
    icon.setAttribute("fill", "none");
    icon.setAttribute("aria-hidden", "true");
  
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "7");
    circle.setAttribute("cy", "7");
    circle.setAttribute("r", "5.25");
    circle.setAttribute("stroke", "currentColor");
    circle.setAttribute("stroke-width", "1.4");
  
    const line = document.createElementNS(svgNS, "path");
    line.setAttribute("d", "M11 11L14 14");
    line.setAttribute("stroke", "currentColor");
    line.setAttribute("stroke-width", "1.4");
    line.setAttribute("stroke-linecap", "round");
  
    icon.appendChild(circle);
    icon.appendChild(line);
    searchBar.appendChild(icon);
  
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search datasets";
    input.disabled = true;
    searchBar.appendChild(input);
  
    inner.appendChild(searchBar);
    header.appendChild(inner);
    return header;
  }