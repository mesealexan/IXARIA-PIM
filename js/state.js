// ---- APPLICATION STATE ----------------------------------------------------

const appState = {
    currentType: "product",
    selectedIds: {
        product: null,
        part: null,
        materialCollection: null,
        materialColor: null
    },
    data: {
        product: [],
        part: [],
        materialCollection: [],
        materialColor: []
    },
    collapsedSections: {
        sidebar: {}, // e.g., { product: true, part: false }
        formGroups: {} // e.g., { "basicInformation": false, "marketingData": true }
    }
};

