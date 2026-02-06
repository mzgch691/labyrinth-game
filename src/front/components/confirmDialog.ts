// Show simple yes/no confirm dialog
export function showSimpleConfirmDialog(
  message: string,
  onConfirm: () => void
): void {
  const dialogOverlay = document.createElement("div");
  dialogOverlay.style.position = "fixed";
  dialogOverlay.style.top = "0";
  dialogOverlay.style.left = "0";
  dialogOverlay.style.width = "100%";
  dialogOverlay.style.height = "100%";
  dialogOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  dialogOverlay.style.display = "flex";
  dialogOverlay.style.justifyContent = "center";
  dialogOverlay.style.alignItems = "center";
  dialogOverlay.style.zIndex = "10000";

  const dialogBox = document.createElement("div");
  dialogBox.style.backgroundColor = "white";
  dialogBox.style.padding = "20px";
  dialogBox.style.borderRadius = "8px";
  dialogBox.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
  dialogBox.style.maxWidth = "400px";
  dialogBox.style.textAlign = "center";

  const messageText = document.createElement("p");
  messageText.textContent = message;
  messageText.style.marginBottom = "20px";
  messageText.style.fontSize = "16px";
  dialogBox.appendChild(messageText);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "10px";
  buttonContainer.style.justifyContent = "center";

  const yesBtn = document.createElement("button");
  yesBtn.textContent = "はい";
  yesBtn.onclick = () => {
    document.body.removeChild(dialogOverlay);
    onConfirm();
  };
  buttonContainer.appendChild(yesBtn);

  const noBtn = document.createElement("button");
  noBtn.textContent = "いいえ";
  noBtn.onclick = () => {
    document.body.removeChild(dialogOverlay);
  };
  buttonContainer.appendChild(noBtn);

  dialogBox.appendChild(buttonContainer);
  dialogOverlay.appendChild(dialogBox);
  document.body.appendChild(dialogOverlay);
}

// Show alert dialog
export function showAlertDialog(message: string): void {
  const dialogOverlay = document.createElement("div");
  dialogOverlay.style.position = "fixed";
  dialogOverlay.style.top = "0";
  dialogOverlay.style.left = "0";
  dialogOverlay.style.width = "100%";
  dialogOverlay.style.height = "100%";
  dialogOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  dialogOverlay.style.display = "flex";
  dialogOverlay.style.justifyContent = "center";
  dialogOverlay.style.alignItems = "center";
  dialogOverlay.style.zIndex = "10000";

  const dialogBox = document.createElement("div");
  dialogBox.style.backgroundColor = "white";
  dialogBox.style.padding = "20px";
  dialogBox.style.borderRadius = "8px";
  dialogBox.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
  dialogBox.style.maxWidth = "400px";
  dialogBox.style.textAlign = "center";

  const messageText = document.createElement("p");
  messageText.textContent = message;
  messageText.style.marginBottom = "20px";
  messageText.style.fontSize = "16px";
  dialogBox.appendChild(messageText);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "10px";
  buttonContainer.style.justifyContent = "center";

  const okBtn = document.createElement("button");
  okBtn.textContent = "了解";
  okBtn.onclick = () => {
    document.body.removeChild(dialogOverlay);
  };
  buttonContainer.appendChild(okBtn);

  dialogBox.appendChild(buttonContainer);
  dialogOverlay.appendChild(dialogBox);
  document.body.appendChild(dialogOverlay);
}

// Show confirmation dialog
export function showConfirmDialog(options: {
  message: string;
  onSave: () => boolean;
  onDiscard: () => void;
  onCancel: () => void;
  root: HTMLElement;
}): void {
  const dialogOverlay = document.createElement("div");
  dialogOverlay.style.position = "fixed";
  dialogOverlay.style.top = "0";
  dialogOverlay.style.left = "0";
  dialogOverlay.style.width = "100%";
  dialogOverlay.style.height = "100%";
  dialogOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  dialogOverlay.style.display = "flex";
  dialogOverlay.style.justifyContent = "center";
  dialogOverlay.style.alignItems = "center";
  dialogOverlay.style.zIndex = "10000";

  const dialogBox = document.createElement("div");
  dialogBox.style.backgroundColor = "white";
  dialogBox.style.padding = "20px";
  dialogBox.style.borderRadius = "8px";
  dialogBox.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
  dialogBox.style.maxWidth = "400px";
  dialogBox.style.textAlign = "center";

  const messageText = document.createElement("p");
  messageText.textContent = options.message;
  messageText.style.marginBottom = "20px";
  messageText.style.fontSize = "16px";
  dialogBox.appendChild(messageText);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "10px";
  buttonContainer.style.justifyContent = "center";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "保存する";
  saveBtn.onclick = () => {
    if (options.onSave()) {
      options.root.removeChild(dialogOverlay);
    }
  };
  buttonContainer.appendChild(saveBtn);

  const discardBtn = document.createElement("button");
  discardBtn.textContent = "保存しない";
  discardBtn.onclick = () => {
    options.root.removeChild(dialogOverlay);
    options.onDiscard();
  };
  buttonContainer.appendChild(discardBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "キャンセル";
  cancelBtn.onclick = () => {
    options.root.removeChild(dialogOverlay);
    options.onCancel();
  };
  buttonContainer.appendChild(cancelBtn);

  dialogBox.appendChild(buttonContainer);
  dialogOverlay.appendChild(dialogBox);
  options.root.appendChild(dialogOverlay);
}
