// ---- FIREBASE INITIALIZATION AND STORAGE ----------------------------------

let firebaseApp = null;
let firebaseStorage = null;

(function initFirebase() {
    try {
        if (window.firebase && firebaseConfig && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
            if (!firebase.apps.length) {
                firebaseApp = firebase.initializeApp(firebaseConfig);
            } else {
                firebaseApp = firebase.app();
            }
            if (firebase.storage) {
                firebaseStorage = firebase.storage();
            }
        } else {
            console.info("Firebase config not set – skipping cloud storage init.");
        }
    } catch (e) {
        console.warn("Failed to initialize Firebase", e);
    }
})();

// ---- STATE PERSISTENCE ----------------------------------------------------

async function loadStateFromFirebaseStorage() {
    if (!firebaseStorage) return;
    try {
        const ref = firebaseStorage.ref().child(STORAGE_PATH);
        const url = await ref.getDownloadURL();
        const resp = await fetch(url);
        if (!resp.ok) return;
        const remote = await resp.json();
        if (remote && typeof remote === "object") {
            if (remote.data && typeof remote.data === "object") {
                appState.data = Object.assign(appState.data, remote.data);
            }
            if (remote.selectedIds && typeof remote.selectedIds === "object") {
                appState.selectedIds = Object.assign(appState.selectedIds, remote.selectedIds);
            }
        }
        // Fallback: if no selection, select first existing item per type
        TYPE_META.forEach(meta => {
            const list = appState.data[meta.key] || [];
            if (!appState.selectedIds[meta.key] && list.length > 0) {
                appState.selectedIds[meta.key] = list[0].id;
            }
        });
    } catch (e) {
        console.warn("Failed to load data from Firebase Storage", e);
    }
}

async function saveStateToFirebaseStorage() {
    if (!firebaseStorage) return;
    const statusEl = document.getElementById("saveStatus");
    try {
        const payload = {
            data: appState.data,
            selectedIds: appState.selectedIds
        };
        const json = JSON.stringify(payload);
        const blob = new Blob([json], { type: "application/json" });
        const ref = firebaseStorage.ref().child(STORAGE_PATH);
        await ref.put(blob, { contentType: "application/json" });
        
        // Show success message
        if (statusEl) {
            statusEl.textContent = "Saved successfully!";
            statusEl.style.color = "#28a745";
            
            // Clear message after 3 seconds
            setTimeout(() => {
                if (statusEl.textContent === "Saved successfully!") {
                    statusEl.textContent = "";
                }
            }, 3000);
        }
    } catch (e) {
        console.warn("Failed to save to Firebase Storage", e);
        if (statusEl) {
            statusEl.textContent = "Cloud save failed";
            statusEl.style.color = "#dc3545";
        }
    }
}

