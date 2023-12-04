chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "createMarkdown",
    title: "Crear archivo Markdown",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "createMarkdown") {
    let text = info.selectionText;
    if (!text) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getClipboardContent" }, function (response) {
          text = response.clipboardContent;
          openPopup(text);
        });
      });
    } else {
      openPopup(text);
    }
  }
});

function openPopup(selectedText) {
  chrome.windows.create({
    url: "popup.html",
    type: "popup",
    width: 300,
    height: 200
  });

  chrome.storage.local.set({ selectedText: selectedText });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  alert(request.action)
  if (request.action === 'generateMarkdown' && request.fileName) {
    chrome.storage.local.get(['selectedText'], function (result) {
      const selectedText = result.selectedText || '';
      createMarkdownFile(selectedText, request.fileName);
    });
  }
});

function createMarkdownFile(content, fileName) {
  const markdownContent = `# Contenido Seleccionado\n\n${content}`;
  const blob = new Blob([markdownContent], { type: 'text/markdown' });
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = `${fileName}.md`;
  downloadLink.click();
  URL.revokeObjectURL(blobUrl);
  console.log("Contenido seleccionado:", content);
  console.log("Archivo descargado:", `${fileName}.md`);
}
