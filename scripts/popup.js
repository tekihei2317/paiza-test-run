"use strict";
{
  window.addEventListener("load", () => {
    setEvents();
  });

  function sendMessage(data) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabId = tabs[0].id;
      chrome.tabs.sendMessage(currentTabId, data);
    });
  }

  function setEvents() {
    const executeButton = document.getElementById("execute-button");
    executeButton.addEventListener("click", () => {
      sendMessage({ message: "test" });
    });

    const selectButton = document.getElementById("language-select");
    selectButton.addEventListener("change", (event) => {
      sendMessage({ message: "select", value: event.target.value });
    });
  }
}
