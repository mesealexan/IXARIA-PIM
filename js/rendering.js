// ---- FORM RENDERING -------------------------------------------------------

function buildGroupHtml(schemaNode, valuesNode, pathPrefix, groupLabel, isRoot) {
    if (!schemaNode) return "";
    let html = "";
    const containerClass = isRoot ? "group root-group" : "group";
    html += `<div class="${containerClass}">`;
    if (groupLabel) {
        html += `<div class="group-title">${escapeHtml(formatPropertyName(groupLabel))}</div>`;
    }

    let props;
    if (schemaNode.type === "object" && schemaNode.properties) {
        props = schemaNode.properties;
    } else {
        props = schemaNode;
    }

    for (const key in props) {
        if (!Object.prototype.hasOwnProperty.call(props, key)) continue;
        const fieldSchema = props[key];
        const childPath = pathPrefix ? pathPrefix + "." + key : key;
        const childValue = valuesNode ? valuesNode[key] : undefined;

        if (isLeafSchema(fieldSchema)) {
            html += buildFieldHtml(key, fieldSchema, childValue, childPath);
        } else {
            html += buildGroupHtml(fieldSchema, childValue || {}, childPath, key, false);
        }
    }

    html += `</div>`;
    return html;
}

function buildFieldHtml(labelKey, schema, value, path) {
    const label = formatPropertyName(labelKey);
    const t = schema.type || "string";
    const lowerName = label.toLowerCase();

    const isImageField = /image|photo|thumbnail|thumb/i.test(lowerName);
    const isVideoField = /video/i.test(lowerName) && !isImageField;
    const isLongText = /description|notes|instructions|care|maintenance|details/i.test(lowerName);

    let html = `<div class="field">`;
    html += `<label>${escapeHtml(label)}</label>`;

    if (isImageField) {
        const images = Array.isArray(value)
            ? value
            : (value ? [value] : []);
        const inputId = `file-input-${path.replace(/\./g, "-")}`;
        html += `
        <div class="image-field">
          <label for="${escapeHtml(inputId)}" class="image-drop" data-path="${escapeHtml(path)}">
            <span>Drop images here or click to upload</span>
            <input type="file" id="${escapeHtml(inputId)}" accept="image/png,image/jpeg,image/jpg,image/webp" multiple class="image-input" data-path="${escapeHtml(path)}" />
          </label>
          <div class="thumbs" data-path="${escapeHtml(path)}">
      `;
        images.forEach((src, index) => {
            html += `<div class="thumb" draggable="true" data-path="${escapeHtml(path)}" data-index="${index}">`;
            html += `<img src="${escapeHtml(src)}" draggable="false" />`;
            html += `<div class="thumb-size" data-src="${escapeHtml(src)}" data-type="image">Loading...</div>`;
            html += `<button type="button" class="thumb-remove-btn" data-path="${escapeHtml(path)}" data-index="${index}" data-src="${escapeHtml(src)}" title="Remove image">×</button>`;
            html += `<button type="button" class="thumb-preview-btn" data-type="image" data-src="${escapeHtml(src)}" title="Preview image">👁</button>`;
            html += `</div>`;
        });
        html += `</div></div>`;
        html += `</div>`;
        return html;
    }

    if (isVideoField) {
        const videos = Array.isArray(value)
            ? value
            : (value ? [value] : []);
        const inputId = `video-input-${path.replace(/\./g, "-")}`;
        html += `
        <div class="image-field">
          <label for="${escapeHtml(inputId)}" class="image-drop" data-path="${escapeHtml(path)}" data-kind="video">
            <span>Drop videos here or click to upload</span>
            <input type="file" id="${escapeHtml(inputId)}" accept="video/mp4,video/webm" multiple class="video-input" data-path="${escapeHtml(path)}" />
          </label>
          <div class="thumbs" data-path="${escapeHtml(path)}">
      `;
        videos.forEach((src, index) => {
            const thumbId = `video-thumb-${path.replace(/\./g, "-")}-${index}`;
            html += `<div class="thumb" data-path="${escapeHtml(path)}" data-index="${index}">`;
            html += `<div class="video-thumb-container" id="${escapeHtml(thumbId)}" data-video-src="${escapeHtml(src)}">`;
            html += `<div class="video-thumb-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;text-align:center;padding:4px;box-sizing:border-box;">Loading...</div>`;
            html += `</div>`;
            html += `<div class="thumb-size" data-src="${escapeHtml(src)}" data-type="video">Loading...</div>`;
            html += `<button type="button" class="thumb-remove-btn" data-path="${escapeHtml(path)}" data-index="${index}" data-src="${escapeHtml(src)}" title="Remove video">×</button>`;
            html += `<button type="button" class="thumb-preview-btn" data-type="video" data-src="${escapeHtml(src)}" title="Preview video">👁</button>`;
            html += `</div>`;
        });
        html += `</div></div>`;
        html += `</div>`;
        return html;
    }

    if (t === "boolean") {
        const checked = !!value;
        html += `
        <div class="field-row">
          <input type="checkbox" class="data-input" data-type="boolean" data-path="${escapeHtml(path)}" ${checked ? "checked" : ""} />
          <span>Yes / enabled</span>
        </div>
      `;
    } else if (t === "number") {
        const v = typeof value === "number" ? value : "";
        html += `
        <input type="number" class="data-input" data-type="number" data-path="${escapeHtml(path)}" value="${escapeHtml(v)}" />
      `;
    } else if (typeof t === "string" && t.startsWith("array")) {
        const arr = Array.isArray(value) ? value : [];
        const joined = arr.join("\n");
        html += `
        <textarea class="data-input" data-type="array" data-path="${escapeHtml(path)}" placeholder="One value per line">${escapeHtml(joined)}</textarea>
      `;
    } else {
        const v = value == null ? "" : value;
        if (isLongText) {
            html += `
          <textarea class="data-input" data-type="string" data-path="${escapeHtml(path)}">${escapeHtml(v)}</textarea>
        `;
        } else {
            html += `
          <input type="text" class="data-input" data-type="string" data-path="${escapeHtml(path)}" value="${escapeHtml(v)}" />
        `;
        }
    }

    html += `</div>`;
    return html;
}

function renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    let html = "";
    TYPE_META.forEach(meta => {
        const type = meta.key;
        const items = appState.data[type] || [];
        const isActiveType = appState.currentType === type;

        html += `<div class="sidebar-section">`;
        html += `
        <div class="sidebar-section-header ${isActiveType ? "active" : ""}" data-type="${type}">
          <span>${escapeHtml(meta.label)}</span>
          <button type="button" class="add-item-btn" data-type="${type}">+ New</button>
        </div>
      `;

        if (items.length > 0) {
            html += `<ul class="sidebar-items">`;
            items.forEach(item => {
                const isActiveItem = isActiveType && appState.selectedIds[type] === item.id;
                const label = getItemLabel(type, item);
                html += `
            <li class="sidebar-item ${isActiveItem ? "active" : ""}" data-type="${type}" data-id="${item.id}">
              <span class="sidebar-item-label">${escapeHtml(label)}</span>
              <div class="sidebar-item-actions">
                <button type="button" class="icon-btn duplicate-item-btn" title="Duplicate" data-type="${type}" data-id="${item.id}">⧉</button>
                <button type="button" class="icon-btn delete-item-btn" title="Delete" data-type="${type}" data-id="${item.id}">✕</button>
              </div>
            </li>
          `;
            });
            html += `</ul>`;
        }

        html += `</div>`;
    });

    sidebar.innerHTML = html;
    attachSidebarEvents();
}

function renderContent() {
    const content = document.getElementById("content");
    if (!content) return;

    const type = appState.currentType;
    const meta = TYPE_META.find(m => m.key === type) || { label: type };
    const items = appState.data[type] || [];
    const selectedId = appState.selectedIds[type];
    const selectedItem = items.find(it => it.id === selectedId) || null;

    let html = `<div class="content-header">`;
    html += `<h2>${escapeHtml(meta.label)} editor</h2>`;
    if (selectedItem) {
        const label = getItemLabel(type, selectedItem);
        html += `<div class="subtitle">Editing: ${escapeHtml(label)}</div>`;
    } else if (type === "product" && items.length > 0) {
        html += `<div class="subtitle">Click a product card to edit it, or use "+ New" to create another.</div>`;
    } else {
        html += `<div class="subtitle">Select or create an item from the left panel.</div>`;
    }
    html += `</div>`;

    if (items.length === 0) {
        html += `<div class="empty-state">No items yet. Use "+ New" under "${escapeHtml(meta.label)}" on the left.</div>`;
        content.innerHTML = html;
        return;
    }

    // Card "list view": when a main type is selected but no individual item is active,
    // show all items as cards with name and (where available) a cover thumbnail.
    if (!selectedItem && ["product", "part", "materialCollection", "materialColor"].includes(type)) {
        html += `<div class="item-card-grid">`;
        items.forEach(item => {
            const label = getItemLabel(type, item);
            const d = item.data || {};
            let imgSrc = "";

            if (type === "product") {
                const md = d.marketingData || {};
                const thumbs = Array.isArray(md.thumbnails) ? md.thumbnails : [];
                const covers = Array.isArray(md.coverImages) ? md.coverImages : [];
                imgSrc = (thumbs[0] || covers[0]) || "";
            } else if (type === "materialCollection") {
                const vm = d.visualMarketingData || {};
                const thumbs = Array.isArray(vm.thumbnails) ? vm.thumbnails : [];
                const covers = Array.isArray(vm.coverImages) ? vm.coverImages : [];
                imgSrc = (thumbs[0] || covers[0]) || "";
            } else if (type === "materialColor") {
                const vm = d.visualMarketingData || {};
                imgSrc = vm.thumbnail || vm.coverImage || "";
            } else if (type === "part") {
                const vm = d.visualMarketingData || {};
                const thumbs = Array.isArray(vm.thumbnails) ? vm.thumbnails : [];
                const covers = Array.isArray(vm.coverImages) ? vm.coverImages : [];
                imgSrc = (thumbs[0] || covers[0]) || "";
            }

            html += `<div class="item-card" data-type="${escapeHtml(type)}" data-id="${escapeHtml(item.id)}">`;
            html += `<div class="item-card-actions">`;
            html += `<button type="button" class="item-card-action-btn item-card-duplicate" title="Duplicate" data-type="${escapeHtml(type)}" data-id="${escapeHtml(item.id)}">⧉</button>`;
            html += `<button type="button" class="item-card-action-btn item-card-delete" title="Delete" data-type="${escapeHtml(type)}" data-id="${escapeHtml(item.id)}">✕</button>`;
            html += `</div>`;
            html += `<div class="item-card-thumb">`;
            if (imgSrc) {
                html += `<img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(label)}" />`;
            } else {
                html += `<div class="item-card-thumb-placeholder">No cover image</div>`;
            }
            html += `</div>`;
            html += `<div class="item-card-body">`;
            html += `<div class="item-card-name">${escapeHtml(label)}</div>`;
            html += `</div>`;
            html += `</div>`;
        });
        html += `</div>`;
        content.innerHTML = html;
        attachCardEvents();
        return;
    }

    const schemaRoot = (SCHEMAS[type] && SCHEMAS[type]()) || {};
    html += `<div class="form-root" id="formRoot">`;
    html += buildGroupHtml(schemaRoot, selectedItem.data, "", null, true);
    html += `</div>`;
    html += `<div class="small-text">Values are kept in memory. Click "SAVE" to persist to Firebase Storage.</div>`;

    content.innerHTML = html;
    attachFormEvents();
    
    // Load video thumbnails after rendering
    loadVideoThumbnails();
    
    // Load file sizes after rendering
    loadFileSizes();
}

function loadVideoThumbnails() {
    const content = document.getElementById("content");
    if (!content) return;
    
    content.querySelectorAll(".video-thumb-container").forEach(container => {
        const videoSrc = container.getAttribute("data-video-src");
        if (!videoSrc) return;
        
        extractVideoThumbnail(videoSrc)
            .then(thumbnailUrl => {
                const placeholder = container.querySelector(".video-thumb-placeholder");
                if (placeholder) {
                    placeholder.style.display = "none";
                }
                // Remove existing thumbnail image if any
                const existingImg = container.querySelector("img");
                if (existingImg) {
                    existingImg.remove();
                }
                const img = document.createElement("img");
                img.src = thumbnailUrl;
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "cover";
                img.style.display = "block";
                container.appendChild(img);
            })
            .catch(err => {
                console.warn("Failed to extract video thumbnail:", err);
                const placeholder = container.querySelector(".video-thumb-placeholder");
                if (placeholder) {
                    placeholder.textContent = "Video";
                    placeholder.style.display = "flex";
                }
            });
    });
}

function loadFileSizes() {
    const content = document.getElementById("content");
    if (!content) return;
    
    content.querySelectorAll(".thumb-size").forEach(sizeElement => {
        const src = sizeElement.getAttribute("data-src");
        if (!src) {
            sizeElement.textContent = "? KB";
            return;
        }
        
        getFileSize(src)
            .then(bytes => {
                if (bytes !== null && bytes !== undefined) {
                    sizeElement.textContent = formatFileSize(bytes);
                } else {
                    sizeElement.textContent = "? KB";
                }
            })
            .catch(err => {
                console.warn("Failed to get file size for", src, ":", err);
                sizeElement.textContent = "? KB";
            });
    });
}

function renderApp() {
    renderSidebar();
    renderContent();
}

