"use strict";
{
  window.addEventListener("load", () => {
    setEvent();
  });

  function setEvent() {
    const executeButton = document.getElementById("execute-button");
    executeButton.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTabId = tabs[0].id;
        chrome.tabs.sendMessage(currentTabId, {}, function (response) {});
      });
    });
  }
}
