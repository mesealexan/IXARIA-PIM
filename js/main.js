// ---- INITIALIZATION -------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
    loadStateFromFirebaseStorage().then(() => {
        renderApp();
    });

    const saveButton = document.getElementById("saveButton");
    if (saveButton) {
        saveButton.addEventListener("click", handleSaveClick);
    }
});

