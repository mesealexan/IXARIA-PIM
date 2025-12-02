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

