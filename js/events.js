// ---- EVENT HANDLERS -------------------------------------------------------

function attachSidebarEvents() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    // Events: switch type (click header)
    sidebar.querySelectorAll(".sidebar-section-header").forEach(el => {
        el.addEventListener("click", (e) => {
            const t = el.getAttribute("data-type");
            if (!t) return;
            appState.currentType = t;
            const list = appState.data[t] || [];
            // For main types, clicking the header should show the card list,
            // so we clear the current selection to enter "list view".
            if (["product", "part", "materialCollection", "materialColor"].includes(t)) {
                appState.selectedIds[t] = null;
            } else if (!appState.selectedIds[t] && list.length > 0) {
                appState.selectedIds[t] = list[0].id;
            }
            renderApp();
        });
    });

    // Events: add new item
    sidebar.querySelectorAll(".add-item-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const t = btn.getAttribute("data-type");
            if (!t) return;
            handleAddItem(t);
        });
    });

    // Events: select item
    sidebar.querySelectorAll(".sidebar-item").forEach(li => {
        li.addEventListener("click", () => {
            const t = li.getAttribute("data-type");
            const id = li.getAttribute("data-id");
            if (!t || !id) return;
            appState.currentType = t;
            appState.selectedIds[t] = id;
            renderApp();
        });
    });

    // Events: duplicate
    sidebar.querySelectorAll(".duplicate-item-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const t = btn.getAttribute("data-type");
            const id = btn.getAttribute("data-id");
            if (!t || !id) return;
            handleDuplicateItem(t, id);
        });
    });

    // Events: delete
    sidebar.querySelectorAll(".delete-item-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const t = btn.getAttribute("data-type");
            const id = btn.getAttribute("data-id");
            if (!t || !id) return;
            handleDeleteItem(t, id);
        });
    });
}

function attachCardEvents() {
    const content = document.getElementById("content");
    if (!content) return;

    // Clicking a card selects that item and opens the editor view.
    content.querySelectorAll(".item-card").forEach(card => {
        card.addEventListener("click", () => {
            const tKey = card.getAttribute("data-type");
            const id = card.getAttribute("data-id");
            if (!tKey || !id) return;
            appState.currentType = tKey;
            appState.selectedIds[tKey] = id;
            renderApp();
        });
    });

    // Duplicate / delete buttons on cards
    content.querySelectorAll(".item-card-duplicate").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const tKey = btn.getAttribute("data-type");
            const id = btn.getAttribute("data-id");
            if (!tKey || !id) return;
            handleDuplicateItem(tKey, id);
        });
    });
    content.querySelectorAll(".item-card-delete").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const tKey = btn.getAttribute("data-type");
            const id = btn.getAttribute("data-id");
            if (!tKey || !id) return;
            handleDeleteItem(tKey, id);
        });
    });
}

function attachFormEvents() {
    const content = document.getElementById("content");
    if (!content) return;

    // Use event delegation on content to catch ALL file input changes
    // This is more reliable than attaching to individual inputs
    const handleFileChange = (e) => {
        const target = e.target;
        if (target.matches('input.image-input, input.video-input')) {
            const path = target.getAttribute("data-path");
            if (!path) return;
            
            if (target.files && target.files.length > 0) {
                if (target.classList.contains('image-input')) {
                    handleImageFiles(target.files, path);
                } else if (target.classList.contains('video-input')) {
                    // TODO: Add video handler
                }
            }
        }
    };
    
    // Remove any existing listener first
    content.removeEventListener("change", handleFileChange);
    // Add listener with capture phase to catch early
    content.addEventListener("change", handleFileChange, true);

    // Helper function to handle image files
    async function handleImageFiles(files, path) {
        const typeKey = appState.currentType;
        const id = appState.selectedIds[typeKey];
        if (!id) return;
        const list = appState.data[typeKey] || [];
        const item = list.find(it => it.id === id);
        if (!item) return;

        const filesArr = Array.from(files || []);
        if (!filesArr.length) return;

        let current = getValueByPath(item.data, path);
        let images = Array.isArray(current)
            ? current.slice()
            : (current ? [current] : []);

        // If Firebase Storage is available, upload images there and store the
        // resulting download URLs. Otherwise, fall back to in-memory data URLs.
        if (firebaseStorage) {
            for (const file of filesArr) {
                if (!file.type || !ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) continue;
                try {
                    const safePath = path.replace(/\./g, "/");
                    const ext = (file.name && file.name.includes("."))
                        ? file.name.substring(file.name.lastIndexOf(".") + 1)
                        : "bin";
                    const filename = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
                    const storageRef = firebaseStorage
                        .ref()
                        .child(`PIM/uploads/${typeKey}/${id}/${safePath}/${filename}`);

                    const snapshot = await storageRef.put(file, { contentType: file.type });
                    const url = await snapshot.ref.getDownloadURL();
                    images.push(url);
                } catch (err) {
                    console.error("Failed to upload image to Firebase Storage", err);
                }
            }
            setValueByPath(item.data, path, images);
            renderContent(); // re-render form with new thumbs
        } else {
            const validFiles = filesArr.filter(file => file.type && ALLOWED_IMAGE_MIME_TYPES.includes(file.type));
            if (validFiles.length === 0) return;
            
            let processedCount = 0;
            const newImages = [...images]; // Start with existing images
            
            validFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newImages.push(e.target.result);
                    processedCount++;
                    
                    // Update only when all files are processed
                    if (processedCount === validFiles.length) {
                        setValueByPath(item.data, path, newImages);
                        renderContent(); // re-render form with new thumbs
                    }
                };
                reader.onerror = (err) => {
                    console.error("FileReader error:", err);
                    processedCount++;
                    // Still update even if one fails
                    if (processedCount === validFiles.length) {
                        setValueByPath(item.data, path, newImages);
                        renderContent();
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    }

    // Text / number / array / boolean
    content.querySelectorAll(".data-input").forEach(el => {
        el.addEventListener("change", () => {
            const path = el.getAttribute("data-path");
            const t = el.getAttribute("data-type");
            if (!path || !t) return;

            const typeKey = appState.currentType;
            const id = appState.selectedIds[typeKey];
            if (!id) return;
            const list = appState.data[typeKey] || [];
            const item = list.find(it => it.id === id);
            if (!item) return;

            let newValue;
            if (t === "boolean") {
                newValue = el.checked;
            } else if (t === "number") {
                const v = el.value;
                newValue = v === "" ? null : Number(v);
            } else if (t === "array") {
                const lines = el.value.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
                newValue = lines;
            } else {
                newValue = el.value;
            }

            setValueByPath(item.data, path, newValue);
        });
    });

    // Image fields - use :not() selector instead of != which doesn't exist in CSS
    content.querySelectorAll('.image-drop:not([data-kind="video"])').forEach(drop => {
        const path = drop.getAttribute("data-path");
        if (!path) return;

        // Find the file input directly within the drop element (there should be only one)
        const fileInput = drop.querySelector('input.image-input');
        
        if (!fileInput) return;

        // Label element handles clicks automatically, but ensure the span doesn't block clicks
        const span = drop.querySelector("span");
        if (span) {
            span.style.pointerEvents = "none";
        }

        drop.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
            drop.classList.add("drag-over");
        });
        drop.addEventListener("dragleave", (e) => {
            e.preventDefault();
            e.stopPropagation();
            drop.classList.remove("drag-over");
        });
        drop.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();
            drop.classList.remove("drag-over");
            if (e.dataTransfer && e.dataTransfer.files) {
                handleImageFiles(e.dataTransfer.files, path);
            }
        });
    });

    // Video fields
    content.querySelectorAll('.image-drop[data-kind="video"]').forEach(drop => {
        const path = drop.getAttribute("data-path");
        if (!path) return;

        // Find the file input directly within the drop element (there should be only one)
        const fileInput = drop.querySelector('input.video-input');
        
        if (!fileInput) return;

        async function handleVideoFiles(files) {
            const typeKey = appState.currentType;
            const id = appState.selectedIds[typeKey];
            if (!id) return;
            const list = appState.data[typeKey] || [];
            const item = list.find(it => it.id === id);
            if (!item) return;

            const filesArr = Array.from(files || []);
            if (!filesArr.length) return;

            const current = getValueByPath(item.data, path);
            let videos = Array.isArray(current)
                ? current.slice()
                : (current ? [current] : []);

            if (firebaseStorage) {
                for (const file of filesArr) {
                    if (!file.type || !ALLOWED_VIDEO_MIME_TYPES.includes(file.type)) continue;
                    try {
                        const safePath = path.replace(/\./g, "/");
                        const ext = (file.name && file.name.includes("."))
                            ? file.name.substring(file.name.lastIndexOf(".") + 1)
                            : "bin";
                        const filename = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
                        const storageRef = firebaseStorage
                            .ref()
                            .child(`PIM/uploads/${typeKey}/${id}/${safePath}/${filename}`);

                        const snapshot = await storageRef.put(file, { contentType: file.type });
                        const url = await snapshot.ref.getDownloadURL();
                        videos.push(url);
                    } catch (err) {
                        console.warn("Failed to upload video to Firebase Storage", err);
                    }
                }
                // For scalar video fields, store only the first video URL
                // Check if the field path suggests it's an array field
                const isArrayField = path.toLowerCase().includes("videos") || path.toLowerCase().includes("video");
                const newValue = isArrayField
                    ? videos
                    : (videos[0] || "");
                setValueByPath(item.data, path, newValue);
                renderContent();
            } else {
                filesArr.forEach(file => {
                    if (!file.type || !ALLOWED_VIDEO_MIME_TYPES.includes(file.type)) return;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        videos.push(e.target.result);
                        const isArrayField = path.toLowerCase().includes("videos") || path.toLowerCase().includes("video");
                        const newValue = isArrayField
                            ? videos
                            : (videos[0] || "");
                        setValueByPath(item.data, path, newValue);
                        renderContent();
                    };
                    reader.readAsDataURL(file);
                });
            }
        }

        // Label element handles clicks automatically, but ensure the span doesn't block clicks
        const span = drop.querySelector("span");
        if (span) {
            span.style.pointerEvents = "none";
        }

        drop.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
            drop.classList.add("drag-over");
        });
        drop.addEventListener("dragleave", (e) => {
            e.preventDefault();
            e.stopPropagation();
            drop.classList.remove("drag-over");
        });
        drop.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();
            drop.classList.remove("drag-over");
            if (e.dataTransfer && e.dataTransfer.files) {
                handleVideoFiles(e.dataTransfer.files);
            }
        });

        fileInput.addEventListener("change", () => {
            handleVideoFiles(fileInput.files);
            fileInput.value = ""; // reset
        });
    });

    // Remove individual uploaded images (thumbnails)
    content.querySelectorAll(".thumb-remove-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const path = btn.getAttribute("data-path");
            const indexAttr = btn.getAttribute("data-index");
            const src = btn.getAttribute("data-src");
            if (!path || indexAttr == null) return;
            const index = Number(indexAttr);
            if (Number.isNaN(index)) return;

            const typeKey = appState.currentType;
            const id = appState.selectedIds[typeKey];
            if (!id) return;
            const list = appState.data[typeKey] || [];
            const item = list.find(it => it.id === id);
            if (!item) return;

            const current = getValueByPath(item.data, path);
            const images = Array.isArray(current)
                ? current.slice()
                : (current ? [current] : []);
            if (index < 0 || index >= images.length) return;

            images.splice(index, 1);
            setValueByPath(item.data, path, images);

            renderContent();
        });
    });

    // Drag and drop reordering for thumbnails
    let draggedThumb = null;
    let draggedIndex = null;

    content.querySelectorAll(".thumb").forEach(thumb => {
        // Prevent remove button from triggering drag
        const removeBtn = thumb.querySelector(".thumb-remove-btn");
        if (removeBtn) {
            removeBtn.addEventListener("mousedown", (e) => {
                e.stopPropagation();
                e.preventDefault();
            });
            removeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        }

        thumb.addEventListener("dragstart", (e) => {
            // Don't start drag if clicking on remove button
            if (e.target.closest(".thumb-remove-btn")) {
                e.preventDefault();
                return;
            }
            
            draggedThumb = thumb;
            draggedIndex = Number(thumb.getAttribute("data-index"));
            thumb.classList.add("dragging");
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/html", thumb.innerHTML);
        });

        thumb.addEventListener("dragend", (e) => {
            thumb.classList.remove("dragging");
            content.querySelectorAll(".thumb").forEach(t => {
                t.classList.remove("drag-over");
            });
            draggedThumb = null;
            draggedIndex = null;
        });

        thumb.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = "move";
            
            if (draggedThumb && draggedThumb !== thumb) {
                const overIndex = Number(thumb.getAttribute("data-index"));
                if (overIndex !== draggedIndex) {
                    thumb.classList.add("drag-over");
                }
            }
        });

        thumb.addEventListener("dragleave", (e) => {
            thumb.classList.remove("drag-over");
        });

        thumb.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();
            thumb.classList.remove("drag-over");

            if (!draggedThumb || draggedThumb === thumb) return;

            const path = thumb.getAttribute("data-path");
            const dropIndex = Number(thumb.getAttribute("data-index"));
            
            if (draggedIndex === null || dropIndex === null || draggedIndex === dropIndex) return;

            const typeKey = appState.currentType;
            const id = appState.selectedIds[typeKey];
            if (!id) return;
            const list = appState.data[typeKey] || [];
            const item = list.find(it => it.id === id);
            if (!item) return;

            const current = getValueByPath(item.data, path);
            const images = Array.isArray(current)
                ? current.slice()
                : (current ? [current] : []);

            if (draggedIndex < 0 || draggedIndex >= images.length || 
                dropIndex < 0 || dropIndex >= images.length) return;

            // Reorder: remove from old position and insert at new position
            const [movedItem] = images.splice(draggedIndex, 1);
            images.splice(dropIndex, 0, movedItem);

            setValueByPath(item.data, path, images);
            renderContent();
        });
    });
}

// ---- ITEM OPERATIONS ------------------------------------------------------

function handleAddItem(typeKey) {
    const schemaRootFn = SCHEMAS[typeKey];
    if (!schemaRootFn) return;
    const schemaRoot = schemaRootFn() || {};

    const defaultData = createDefaultValuesFromSchema(schemaRoot, "");
    const item = {
        id: generateId(typeKey),
        data: defaultData
    };

    if (!Array.isArray(appState.data[typeKey])) {
        appState.data[typeKey] = [];
    }
    appState.data[typeKey].push(item);
    appState.currentType = typeKey;
    appState.selectedIds[typeKey] = item.id;
    renderApp();
}

function handleDuplicateItem(typeKey, id) {
    const list = appState.data[typeKey] || [];
    const original = list.find(it => it.id === id);
    if (!original) return;

    const clone = {
        id: generateId(typeKey),
        data: JSON.parse(JSON.stringify(original.data))
    };
    list.push(clone);
    appState.currentType = typeKey;
    appState.selectedIds[typeKey] = clone.id;
    renderApp();
}

function handleDeleteItem(typeKey, id) {
    let list = appState.data[typeKey] || [];
    const idx = list.findIndex(it => it.id === id);
    if (idx === -1) return;
    list.splice(idx, 1);
    appState.data[typeKey] = list;

    if (appState.selectedIds[typeKey] === id) {
        appState.selectedIds[typeKey] = list.length ? list[0].id : null;
    }
    renderApp();
}

async function handleSaveClick() {
    await saveStateToFirebaseStorage();
}

