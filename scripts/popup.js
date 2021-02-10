"use strict";
{
  window.addEventListener("load", () => {
    setEvents();
    setDefaultLanguage();
  });

  function setDefaultLanguage() {
    const selectButton = document.getElementById("language-select");

    // ローカルストレージから復元する
    const defaultLanguageId = localStorage.getItem("default_language_id");
    console.log(defaultLanguageId, selectButton);
    selectButton.value = defaultLanguageId;
  }

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
      const newLanguageId = event.target.value;
      sendMessage({ message: "select", value: newLanguageId });

      // ローカルストレージに保存する
      localStorage.setItem("default_language_id", newLanguageId);
    });
  }
}
