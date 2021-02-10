"use strict";
{
  window.addEventListener("load", () => {
    setEvent();
    setDefaultLanguage();
  });

  async function setEvent() {
    chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
      if (request.message === "test") {
        await runTests();
      } else {
        await selectLanguage(request.value);
      }
    });
  }

  function setDefaultLanguage() {
    // TODO: 再チャレンジ画面では言語を変更しないようにする
    const languageSelect = document.getElementById("language_id");
    if (languageSelect === null) return;

    const defaultLanguageId = localStorage.getItem("default_language_id");
    languageSelect.value = defaultLanguageId;
  }

  async function selectLanguage(languageId) {
    const languageSelect = document.getElementById("language_id");
    languageSelect.value = languageId;
    localStorage.setItem("default_language_id", languageId);
  }

  async function runTests() {
    const testSelectElem = document.getElementById("sample_input_no");
    const testCaseLength = testSelectElem.length;

    let isAllTestPassed = true;
    for (let i = 0; i < testCaseLength; i++) {
      const isTestPassed = await runTest(i);
      if (!isTestPassed) {
        isAllTestPassed = false;
        break;
      }
    }
    console.log(isAllTestPassed);
  }

  async function runTest(index) {
    const testSelectElem = document.getElementById("sample_input_no");
    const testRunButtonElem = document.getElementById("do_compile");

    // テストケースを選択して実行する
    testSelectElem.value = index;
    testRunButtonElem.click();

    await waitJudgeEnd();
    const testResultElem = document.querySelector(".code-result__judge-result");

    return isCorrect(testResultElem.textContent);
  }

  function waitJudgeEnd() {
    const outputElem = document.querySelector(".output_wrap");
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (outputElem.style.display !== "none") {
          clearInterval(intervalId);
          resolve();
        }
      }, 100);
    });
  }

  function isCorrect(judgeText) {
    const isContainIncorrect = /.*不正解.*/.test(judgeText);
    return !isContainIncorrect;
  }
}
