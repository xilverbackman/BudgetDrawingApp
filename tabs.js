const tabs = {};
let id = 1,
  activeTab = null,
  display = true;

function addNewTab() {
  id++;
  // const toolboxId = toolBoxCount
  // const tabId = tabCount;
  const div = document.createElement("div");
  div.className = "content";
  div.id = `tab${id}`;
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.border = "2px solid #aaa";
  div.style.marginBottom = "10px";
  div.style.display = "block";
  div.innerText = `tab${id}`;
  document.getElementById("contentBox").appendChild(div);
  const p5Instance = drawingApp(id);
  tabs[id] = p5Instance;
  displayTab(id);
}

function displayTab(id) {
  // Hide unselected tab
  const allTabs = document.querySelectorAll(".content");
  allTabs.forEach((tab) => {
    tab.style.display = "none";
  });
  const selectedTab = document.getElementById(`tab${id}`);
  if (selectedTab) {
    selectedTab.style.display = "block";
  } else {
  }

  // Hide unselected toolbox
  // const toolboxIdSelector = `toolbox${id}`;
  const allToolBoxes = document.querySelectorAll(".toolbox");
  allToolBoxes.forEach((toolbox) => {
    toolbox.style.display = "none";
  });
  const selectedToolBox = document.getElementById(`toolbox${id}`);
  if (selectedToolBox) {
    selectedToolBox.style.display = "block";
  } else {
  }

  // Hide unselected colour palette
  // const colourPaletteSelector
  const allColourBoxes = document.querySelectorAll(".colourBox");
  allColourBoxes.forEach((cb) => {
    cb.style.display = "none";
  });
  const selectedColourPalette = document.getElementById(`colourBox${id}`);
  if (selectedColourPalette) {
    selectedColourPalette.style.display = "flex";
  } else {
  }
}
