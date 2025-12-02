// ---- UTILITIES ------------------------------------------------------------

function escapeHtml(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function generateId(prefix) {
    return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
}

function isLeafSchema(node) {
    if (!node || typeof node !== "object") return false;
    if (node.type && node.type === "object" && node.properties) return false;
    if (node.type && node.type !== "object") return true;
    return false;
}

function createDefaultValuesFromSchema(node, pathKey) {
    if (!node || typeof node !== "object") return null;

    // Handle JSON-schema like { type: "object", properties: { ... } }
    if (node.type === "object" && node.properties) {
        const result = {};
        for (const key in node.properties) {
            if (!Object.prototype.hasOwnProperty.call(node.properties, key)) continue;
            result[key] = createDefaultValuesFromSchema(node.properties[key], key);
        }
        return result;
    }

    if (node.type && node.type !== "object") {
        const t = node.type;
        const key = (pathKey || "").toLowerCase();

        const isImageField = /image|photo|thumbnail|thumb/i.test(key);
        if (isImageField) return [];

        if (t === "string") return "";
        if (t === "number") return 0;
        if (t === "boolean") return false;
        if (typeof t === "string" && t.startsWith("array")) return [];
        return "";
    }

    const result = {};
    for (const key in node) {
        if (!Object.prototype.hasOwnProperty.call(node, key)) continue;
        result[key] = createDefaultValuesFromSchema(node[key], key);
    }
    return result;
}

function getValueByPath(obj, path) {
    if (!obj || !path) return undefined;
    const parts = path.split(".");
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
        if (current == null) return undefined;
        current = current[parts[i]];
    }
    return current;
}

function setValueByPath(obj, path, value) {
    if (!obj || !path) return;
    const parts = path.split(".");
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!current[p] || typeof current[p] !== "object") {
            current[p] = {};
        }
        current = current[p];
    }
    current[parts[parts.length - 1]] = value;
}

function formatPropertyName(camelCase) {
    if (!camelCase || typeof camelCase !== "string") return camelCase;
    // Split camelCase by detecting uppercase letters
    return camelCase
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // Handle consecutive capitals
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

function getItemLabel(type, item) {
    if (!item || !item.data) return item?.id || "";
    const d = item.data;

    if (type === "product") {
        return d.basicInformation?.productName || item.id;
    }
    if (type === "part") {
        // Part schema uses "basicModelInformation.modelName" as the primary name.
        return d.basicModelInformation?.modelName || item.id;
    }
    if (type === "materialCollection") {
        return d.basicMaterialInformation?.materialName || item.id;
    }
    if (type === "materialColor") {
        return d.basicColorInformation?.colorName || item.id;
    }
    return item.id;
}

// Get file size in bytes from a URL
async function getFileSize(url) {
    try {
        // For data URLs, calculate size from the base64 data
        if (url.startsWith("data:")) {
            const parts = url.split(",");
            if (parts.length > 1) {
                const base64Data = parts[1];
                // Base64 encoding: 4 base64 chars = 3 bytes
                // Account for padding (trailing = characters)
                const padding = (base64Data.match(/=/g) || []).length;
                const size = Math.round((base64Data.length * 3) / 4) - padding;
                return size;
            }
            return 0;
        }
        
        // For Firebase Storage URLs, try to get metadata from Storage API
        if (url.includes("firebasestorage.googleapis.com")) {
            // Check if firebaseStorage is available (it's declared in firebase.js)
            if (typeof window !== "undefined" && window.firebaseStorage) {
                try {
                    const urlObj = new URL(url);
                    const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
                    if (pathMatch) {
                        const encodedPath = pathMatch[1];
                        const storagePath = decodeURIComponent(encodedPath);
                        const ref = window.firebaseStorage.ref().child(storagePath);
                        const metadata = await ref.getMetadata();
                        if (metadata && metadata.size) {
                            return parseInt(metadata.size, 10);
                        }
                    }
                } catch (firebaseError) {
                    // Firebase metadata fetch failed, fall through to HTTP methods
                }
            }
            
            // Also try accessing firebaseStorage from the global scope if available
            if (typeof firebaseStorage !== "undefined" && firebaseStorage) {
                try {
                    const urlObj = new URL(url);
                    const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
                    if (pathMatch) {
                        const encodedPath = pathMatch[1];
                        const storagePath = decodeURIComponent(encodedPath);
                        const ref = firebaseStorage.ref().child(storagePath);
                        const metadata = await ref.getMetadata();
                        if (metadata && metadata.size) {
                            return parseInt(metadata.size, 10);
                        }
                    }
                } catch (firebaseError) {
                    // Fall through to HTTP methods
                }
            }
        }
        
        // For remote URLs, try HEAD request (let browser handle CORS)
        try {
            const response = await fetch(url, { 
                method: "HEAD",
                cache: "no-cache"
            });
            
            if (response.ok || response.status === 200 || response.status === 206) {
                const contentLength = response.headers.get("Content-Length");
                if (contentLength) {
                    const size = parseInt(contentLength, 10);
                    if (!isNaN(size) && size > 0) {
                        return size;
                    }
                }
            }
        } catch (headError) {
            // HEAD request failed (likely CORS), try GET with range header
            try {
                const rangeResponse = await fetch(url, {
                    method: "GET",
                    headers: { Range: "bytes=0-0" },
                    cache: "no-cache"
                });
                
                if (rangeResponse.ok || rangeResponse.status === 206) {
                    const contentRange = rangeResponse.headers.get("Content-Range");
                    if (contentRange) {
                        const match = contentRange.match(/\/(\d+)/);
                        if (match) {
                            const size = parseInt(match[1], 10);
                            if (!isNaN(size) && size > 0) {
                                return size;
                            }
                        }
                    }
                    
                    // If Content-Range not available, try Content-Length
                    const contentLength = rangeResponse.headers.get("Content-Length");
                    if (contentLength) {
                        const size = parseInt(contentLength, 10);
                        if (!isNaN(size) && size > 0) {
                            return size;
                        }
                    }
                }
            } catch (rangeError) {
                // Both methods failed - might be CORS issue
            }
        }
        
        return null;
    } catch (err) {
        return null;
    }
}

// Format file size in KB
function formatFileSize(bytes) {
    if (bytes === null || bytes === undefined) return "? KB";
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
}

// Extract first frame from video as thumbnail
function extractVideoThumbnail(videoUrl) {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.preload = "metadata";
        video.muted = true; // Mute to allow autoplay if needed
        video.playsInline = true;
        
        let resolved = false;
        
        const cleanup = () => {
            video.src = "";
            video.load();
        };
        
        const handleSuccess = (thumbnailUrl) => {
            if (resolved) return;
            resolved = true;
            cleanup();
            resolve(thumbnailUrl);
        };
        
        const handleError = (err) => {
            if (resolved) return;
            resolved = true;
            cleanup();
            reject(err);
        };
        
        video.addEventListener("loadedmetadata", () => {
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                handleError(new Error("Invalid video dimensions"));
                return;
            }
            video.currentTime = 0.1; // Seek to first frame (0.1s to ensure frame is loaded)
        });
        
        video.addEventListener("seeked", () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
                handleSuccess(thumbnailUrl);
            } catch (err) {
                handleError(err);
            }
        });
        
        video.addEventListener("error", (e) => {
            handleError(new Error("Failed to load video: " + (e.message || "Unknown error")));
        });
        
        // Timeout after 10 seconds
        const timeout = setTimeout(() => {
            handleError(new Error("Video thumbnail extraction timeout"));
        }, 10000);
        
        video.addEventListener("seeked", () => {
            clearTimeout(timeout);
        }, { once: true });
        
        video.src = videoUrl;
    });
}

