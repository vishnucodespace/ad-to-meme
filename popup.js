document.addEventListener("DOMContentLoaded", () => {
  const replacementTypeSelect = document.getElementById("replacementType");
  const customMessageSection = document.getElementById("customMessageSection");
  const customMessageInput = document.getElementById("customMessage");
  const saveCustomMessageButton = document.getElementById("saveCustomMessage");

  // Load saved settings
  chrome.storage.sync.get(["replacementType", "customMessage"], (data) => {
    replacementTypeSelect.value = data.replacementType || "default";
    customMessageInput.value = data.customMessage || "";
    toggleCustomMessageSection(replacementTypeSelect.value);
  });

  // Handle dropdown change and close popup
  replacementTypeSelect.addEventListener("change", () => {
    const selectedValue = replacementTypeSelect.value;
    chrome.storage.sync.set({ replacementType: selectedValue }, () => {
      console.log("Replacement type saved:", selectedValue);
      window.close(); // Close the popup
    });
    toggleCustomMessageSection(selectedValue);
  });

  // Handle custom message save and close popup
  saveCustomMessageButton.addEventListener("click", () => {
    const message = customMessageInput.value;
    chrome.storage.sync.set({ customMessage: message }, () => {
      console.log("Custom message saved:", message);
      window.close(); // Close the popup
    });
  });

  // Show/hide custom message section
  function toggleCustomMessageSection(value) {
    customMessageSection.style.display = value === "custom" ? "block" : "none";
  }
});