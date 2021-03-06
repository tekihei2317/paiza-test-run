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

  async function setDefaultLanguage() {
    const languageSelect = document.getElementById("language_id");
    if (languageSelect === null) return;

    const defaultLanguageId = localStorage.getItem("default_language_id");
    languageSelect.value = defaultLanguageId;

    // changeイベントを発火させる(参考: https://ja.stackoverflow.com/questions/55862/%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%A7%E8%A1%A8%E7%A4%BA%E3%81%97%E3%81%A6%E3%81%84%E3%82%8Bweb%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AEselect%E8%A6%81%E7%B4%A0%E3%81%AEonchange%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%82%92%E7%99%BA%E7%81%AB%E3%81%95%E3%81%9B%E3%82%8B%E6%96%B9%E6%B3%95)
    languageSelect.dispatchEvent(new Event("change"));
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
    return judgeText.indexOf("◎") !== -1;
  }
}
