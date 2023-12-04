document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generateMarkdown');
    generateButton.addEventListener('click', function () {
      const fileNameInput = document.getElementById('fileName');
      const fileName = fileNameInput.value.trim();
      if (fileName) {
        chrome.runtime.sendMessage({ action: 'generateMarkdown', fileName: fileName });
      } else {
        alert('Ingresa un nombre para el archivo Markdown.');
      }
    });
  });
  