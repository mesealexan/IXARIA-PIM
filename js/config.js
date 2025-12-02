// ---- SCHEMA PLACEHOLDERS --------------------------------------------------
// Replace each const below with your real JSON file content.
// The structure this app expects:
// { "product": { ...groups and fields... } }, etc.

const productSchema = {
    basicInformation: {
        productName: { type: "string", note: "" },
        variantSKU: { type: "string", note: "" },
        brand: { type: "string", note: "" },
        collection: { type: "string", note: "" },
        yearOfDesign: { type: "string | number", note: "" },
        designer: { type: "string", note: "" },
        targetMarkets: { type: "array<string>", note: "Add target countries as a list of strings" },
        eanGTIN: { type: "string", note: "" }
    },
    marketingData: {
        coverImages: { type: "array<string>", note: "Add cover images as a list of strings. The order is important for the cover image to be the first one." },
        thumbnails: { type: "array<string>", note: "" },
        dimensionImage: { type: "string", note: "" },
        realPhotos: { type: "array<string>", note: "" },
        video: { type: "string", note: "" },
        shortDescription: { type: "string", note: "Max 160 characters" },
        midDescription: { type: "string", note: "Max 400 characters" },
        longDescription: { type: "string", note: "Max 800 characters" },
        sellingPoints: { type: "array<string>", note: "List the most important aspect of the product. The top one is the most important." },
        lifestyleStoryAngle: { type: "string", note: "A story of how the product was created and how it can be used in a home." }
    },
    seoData: {
        searchKeywords: { type: "array<string>", note: "" },
        searchTags: { type: "array<string>", note: "" },
        searchFilters: {
            type: "object",
            note: "",
            properties: {
                comfortLevel: { type: "string", note: "" },
                armType: { type: "string", note: "" },
                other: { type: "any", note: "" }
            }
        },
        comparisonAttributes: { type: "object<any>", note: "" }
    },
    complementaryProducts: {
        productIds: { type: "array<string>", note: "" }
    },
    productTypeStyle: {
        baseType: {
            type: "enum",
            note: "",
            values: [
                "Armchair",
                "2-seater",
                "2.5-seater",
                "3-seater",
                "3.5-seater",
                "Custom length"
            ]
        },
        style: {
            type: "array<enum>",
            note: "",
            values: [
                "Modern",
                "Contemporary",
                "Scandinavian",
                "Mid-Century Modern",
                "Minimalist",
                "Japandi",
                "Industrial",
                "Classic",
                "Traditional",
                "Transitional",
                "Chesterfield",
                "French Provincial",
                "Coastal",
                "Farmhouse",
                "Bohemian",
                "Glam / Art Deco",
                "Luxury Modern",
                "Rustic",
                "Mediterranean"
            ]
        },
        intendedRoom: {
            type: "array<enum>",
            note: "",
            values: [
                "Living Room",
                "Hallway",
                "Bathroom",
                "Bedroom",
                "Kitchen",
                "Outdoor"
            ]
        },
        orientation: {
            type: "enum | null",
            note: "",
            values: ["left-facing", "right-facing"]
        }
    },
    computedDimensions: {
        totalWidthCm: {
            type: "object",
            note: "",
            properties: {
                min: { type: "number | null", note: "" },
                max: { type: "number | null", note: "" },
                increment: { type: "number | null", note: "" }
            }
        },
        totalDepthCm: {
            type: "object",
            note: "",
            properties: {
                min: { type: "number | null", note: "" },
                max: { type: "number | null", note: "" },
                increment: { type: "number | null", note: "" }
            }
        },
        totalHeightCm: {
            type: "object",
            note: "",
            properties: {
                min: { type: "number | null", note: "" },
                max: { type: "number | null", note: "" },
                increment: { type: "number | null", note: "" }
            }
        },
        legHeightCm: { type: "number | null", note: "" },
        numberOfLegs: { type: "number | null", note: "" },
        numberOfSeats: { type: "string | number", note: "" }
    },
    careWarranty: {
        totalWarrantyYears: { type: "number | null", note: "" },
        warrantyConditions: { type: "string", note: "" },
        warrantyBreakdown: {
            note: "",
            frame: { type: "string", note: "" },
            mechanisms: { type: "string", note: "" },
            cushions: { type: "string", note: "" }
        },
        expectedLifespanYears: { type: "number | null", note: "" },
        repairabilityScore: { type: "number", range: "0-5", note: "" },
        sparePartsAvailabilityYears: { type: "number | null", note: "" }
    },
    deliveryShipping: {
        deliveryMethods: { type: "array<string>", note: "" },
        deliveryRegions: { type: "array<string>", note: "" },
        estimatedDeliveryTime: { type: "string", note: "" },
        productionLeadTime: { type: "string", note: "" },
        dispatchTime: { type: "string", note: "" },
        deliveryCostRules: { type: "string", note: "" },
        freeDeliveryThreshold: { type: "number | null", note: "" },
        extraFees: {
            type: "object",
            note: "",
            properties: {
                stairs: { type: "number | null", note: "" },
                remoteAreas: { type: "number | null", note: "" },
                other: { type: "string", note: "" }
            }
        },
        schedulingOptions: { type: "string", note: "" },
        missedDeliveryFee: { type: "number | null", note: "" },
        returnWindow: { type: "string", note: "" },
        returnConditions: { type: "string", note: "" },
        returnPickupAvailable: { type: "boolean", note: "" },
        returnCosts: { type: "string", note: "" },
        requiresOriginalPackaging: { type: "boolean", note: "" },
        assemblyLevel: {
            type: "enum",
            note: "",
            values: ["none", "minimal", "full"]
        },
        assemblyGuideLink: { type: "string", note: "" }
    },
    packagingLogistics: {
        numberOfBoxesPerSize: { type: "object<number>", note: "" },
        packageDimensionsWeightPerSize: { type: "object<any>", note: "" },
        volumetricWeight: { type: "string", note: "" },
        flatPack: { type: "boolean", note: "" },
        packagingMaterial: { type: "string", note: "" }
    },
    regulatoryCompliance: {
        fireSafetyDeclaration: { type: "string", note: "" },
        reachSubstanceDisclosure: { type: "string", note: "" },
        vocEmissions: { type: "string", note: "" },
        woodSourcingCertification: { type: "string", note: "" },
        packagingRecyclability: { type: "string", note: "" },
        repairInstructions: { type: "string", note: "" },
        productSafetyCertifications: { type: "array<string>", note: "" },
        chemicalCompliance: { type: "string", note: "" },
        loadBearingStandards: { type: "string", note: "" }
    },
    lifecycleServiceability: {
        sparePartSKUs: { type: "array<string>", note: "" },
        repairabilityScore: { type: "number", range: "0-5", note: "" },
        replaceableComponents: { type: "array<string>", note: "" },
        disassemblyInstructions: { type: "string", note: "" }
    },
    mediaAssets: {
        images: { type: "array<string>", note: "" },
        videos: { type: "array<string>", note: "" },
        threeDModels: {
            note: "",
            fbx: { type: "string", note: "" },
            glb: { type: "string", note: "" },
            obj: { type: "string", note: "" },
            stl: { type: "string", note: "" },
            ply: { type: "string", note: "" },
            usdz: { type: "string", note: "" },
            usdc: { type: "string", note: "" },
            ifc: { type: "string", note: "" },
            dwg: { type: "string", note: "" },
            max: { type: "string", note: "" },
            skp: { type: "string", note: "" },
        }
    }
};

const partSchema = {
    basicModelInformation: {
        modelName: { type: "string", note: "" },
        variantSKU: { type: "string", note: "" },
        brand: { type: "string", note: "" },
        collection: { type: "string", note: "" },
        launchSeasonYear: { type: "string", note: "" }
    },
    sewing: {
        sewingType: { type: "string", note: "" },
        sewingColor: { type: "string", note: "" },
        stitchDensity: { type: "number", unit: "stitches per inch/cm", note: "" },
        reinforcementType: {
            type: "enum | string",
            note: "",
            values: ["edge reinforcement", "piping", "double stitch"]
        }
    },
    comfortFilling: {
        seatCushionCore: { type: "string", note: "" },
        backCushionCore: { type: "string", note: "" },
        suspensionSystem: { type: "string", note: "" },
        comfortRating: {
            type: "enum",
            note: "",
            values: ["soft", "medium", "firm"]
        },
        foamDensity: { type: "number", unit: "kg/m3 or lb/ft3", note: "" },
        foamFirmnessILD: { type: "number", unit: "ILD", note: "" },
        layerCompositionDiagram: {
            type: "string",
            format: "asset-id or URL",
            note: ""
        }
    },
    featuresFunctions: {
        recliningMechanism: {
            type: "enum",
            note: "",
            values: ["none", "manual", "power"]
        },
        sofaBedMechanism: { type: "string", note: "" },
        sofaBedMattressSize: {
            type: "string",
            note: "e.g. per length configuration"
        },
        storage: {
            type: "enum | string",
            note: "",
            values: ["none", "under-seat", "in base"]
        },
        adjustableHeadrests: { type: "boolean", note: "" },
        removableSeatCushions: { type: "boolean", note: "" },
        removableBackCushions: { type: "boolean", note: "" },
        modularConnections: {
            type: "array<string>",
            note: "hooks, rails, docking types"
        },
        usbPowerOptions: { type: "array<string>", note: "" },
        heatMassageOptions: { type: "array<string>", note: "" }
    },
    frameConstruction: {
        frameMaterialConstruction: { type: "string", note: "" },
        joineryType: { type: "string", note: "" },
        frameWarrantyYears: { type: "number | null", note: "" },
        woodCertification: {
            type: "enum | string",
            note: "",
            values: ["FSC", "PEFC", "none"]
        },
        recycledContentPercent: { type: "number", range: "0-100", note: "" },
        metalGauge: { type: "string", note: "" }
    },
    sizeDimensions: {
        totalWidthCm: {
            type: "object",
            note: "",
            properties: {
                min: { type: "number | null", note: "" },
                max: { type: "number | null", note: "" },
                increment: { type: "number | null", note: "" }
            }
        },
        totalDepthCm: {
            type: "object",
            note: "",
            properties: {
                min: { type: "number | null", note: "" },
                max: { type: "number | null", note: "" },
                increment: { type: "number | null", note: "" }
            }
        },
        totalHeightCm: { type: "number | null", note: "" },
        seatHeightCm: { type: "number | null", note: "" },
        seatDepthCm: { type: "number | null", note: "" },
        armHeightCm: { type: "number | null", note: "" },
        armWidthCm: { type: "number | null", note: "" },
        backHeightCm: { type: "number | null", note: "" },
        backWidthCm: { type: "number | null", note: "" },
        legHeightCm: { type: "number | null", note: "" },
        numberOfLegs: { type: "number | null", note: "" },
        numberOfSeats: {
            type: "enum | string",
            note: "",
            values: ["1", "2", "2.5", "3", "3.5", "custom"]
        },
        toleranceRangeCm: { type: "number", note: "+/- cm" }
    },
    deliveryConstraints: {
        assembledDimensions: {
            type: "object",
            note: "",
            properties: {
                widthCm: { type: "number | null", note: "" },
                depthCm: { type: "number | null", note: "" },
                heightCm: { type: "number | null", note: "" }
            }
        },
        assembledWeightKg: { type: "number | null", note: "" },
        packageDimensionsWeight: {
            type: "object<any>",
            note: "already in Packaging & Logistics – reference or override"
        },
        heaviestBoxWeightKg: { type: "number | null", note: "" },
        minimumDoorWidthRequiredCm: { type: "number | null", note: "" },
        minimumStaircaseWidthCm: { type: "number | null", note: "" },
        fitsInElevator: { type: "boolean", note: "" },
        assemblyRequired: { type: "boolean", note: "" },
        toolsRequired: { type: "array<string>", note: "" },
        assemblyTimeMinutes: { type: "number | null", note: "" },
        numberOfPeopleRequiredForLifting: { type: "number | null", note: "" }
    }
};

const materialCollectionSchema = {
    basicMaterialInformation: {
        materialName: { type: "string", note: "" },
        internalCode: { type: "string", note: "" },
        materialType: {
            type: "enum",
            note: "",
            values: [
                "Textile",
                "Leather",
                "Eco-leather",
                "Velvet",
                "Bouclé",
                "Microfiber",
                "Outdoor fabric",
                "Wood",
                "Metal",
                "Plastic",
                "Foam",
                "Sewing Thread"
            ]
        },
        subCategory: {
            type: "string",
            note: "weave/finish type: Chenille, Twill, Plain weave, Knitted, Nubuck, Aniline, etc."
        },
        colorName: { type: "string", note: "" },
        priceCategory: { type: "string", note: "" },
        launchSeasonYear: { type: "string", note: "" },
        availabilityStatus: {
            type: "enum",
            note: "",
            values: ["active", "discontinued", "limited", "made-to-order"]
        },
        supplier: { type: "string", note: "" },
        countryOfOrigin: { type: "string", note: "" }
    },
    physicalTechnicalProperties: {
        fabricProperties: {
            note: "",
            composition: { type: "string", note: "" },
            weightGsm: { type: "number", unit: "g/m²", note: "" },
            backingType: { type: "string", note: "" },
            abrasionResistanceMartindale: { type: "number", note: "" },
            pillingResistance: { type: "string", note: "" },
            colorFastnessToLight: { type: "string", note: "" },
            colorFastnessToRubbing: { type: "string", note: "" },
            tearStrength: { type: "string", note: "" },
            tensileStrength: { type: "string", note: "" },
            stretchElasticity: { type: "string", note: "" }
        },
        leatherProperties: {
            note: "",
            leatherType: {
                type: "enum | string",
                note: "",
                values: [
                    "aniline",
                    "semi-aniline",
                    "corrected-grain",
                    "top-grain",
                    "split"
                ]
            },
            originOfHide: { type: "string", note: "" },
            thicknessMm: { type: "number", note: "" },
            finishType: {
                type: "enum | string",
                note: "",
                values: ["pigmented", "waxed", "natural"]
            },
            grainType: { type: "string", note: "" },
            breathability: { type: "string", note: "" }
        },
        outdoorProperties: {
            note: "",
            uvResistance: { type: "string", note: "" },
            moldMildewResistance: { type: "string", note: "" },
            chlorineResistance: { type: "string", note: "" },
            waterRepellency: { type: "string", note: "" },
            outdoorCertification: { type: "string", note: "" }
        },
        woodMetalOtherHardMaterials: {
            note: "",
            speciesAlloyType: { type: "string", note: "" },
            surfaceFinish: {
                type: "enum | string",
                note: "",
                values: ["lacquer", "oil", "stain", "powder-coat"]
            },
            hardnessWood: { type: "string", note: "" },
            corrosionResistanceMetal: { type: "string", note: "" }
        },
        plasticProperties: {
            note: "",
            plasticType: {
                type: "enum | string",
                note: "",
                values: ["PP", "ABS", "PVC", "Nylon", "PU", "PET", "HDPE"]
            },
            surfaceFinish: {
                type: "enum | string",
                note: "",
                values: ["matte", "glossy", "textured"]
            },
            density: { type: "number", note: "" },
            impactResistance: { type: "string", note: "" },
            uvResistance: { type: "string", note: "" },
            chemicalResistance: { type: "string", note: "" },
            recyclabilityRating: { type: "string", note: "" },
            heatResistance: { type: "string", note: "" }
        },
        sewingThreadProperties: {
            note: "",
            fiberType: {
                type: "enum | string",
                note: "",
                values: ["polyester", "nylon", "cotton", "bonded thread"]
            },
            threadThicknessTex: { type: "string", note: "" },
            uvResistance: { type: "string", note: "" },
            colorFastness: { type: "string", note: "" },
            heatResistance: { type: "string", note: "" }
        }
    },
    performanceCertifications: {
        oekoTex: { type: "string", note: "" },
        reachCompliant: { type: "boolean", note: "" },
        greenguard: { type: "boolean", note: "" },
        greenguardGold: { type: "boolean", note: "" },
        isoStandards: { type: "array<string>", note: "" },
        fireRatings: {
            note: "",
            en1021_1: { type: "boolean", note: "" },
            en1021_2: { type: "boolean", note: "" },
            calTB117: { type: "boolean", note: "" }
        },
        sustainabilityCertifications: { type: "array<string>", note: "" },
        vocEmissionsRating: { type: "string", note: "" },
        furnitureGradeCertifications: {
            type: "array<string>",
            note: "e.g. EN 16139, EN 12520"
        },
        antiBacterialCoatingCertification: { type: "string", note: "" }
    },
    visualMarketingData: {
        coverImages: { type: "array<string>", note: "" },
        thumbnails: { type: "array<string>", note: "" },
        realPhotos: {
            type: "array<string>",
            note: "macro + context images"
        },
        videos: { type: "array<string>", note: "" },
        shortDescription: { type: "string", note: "" },
        mediumDescription: { type: "string", note: "" },
        longDescription: { type: "string", note: "" }
    },
    careMaintenance: {
        cleaningInstructions: { type: "string", note: "" },
        compatibleCleaningProducts: { type: "array<string>", note: "" },
        machineWashable: { type: "boolean", note: "" },
        ironingInstructions: { type: "string", note: "" },
        dryCleanOnly: { type: "boolean", note: "" },
        vacuumingFrequency: { type: "string", note: "" },
        spotCleanGuidelines: { type: "string", note: "" },
        protectiveSprayRecommended: { type: "boolean", note: "" },
        maintenanceInterval: { type: "string", note: "" },
        professionalCleaningCode: {
            type: "enum | string",
            note: "",
            values: ["W", "S", "SW", "X"]
        },
        heatSensitivity: { type: "string", note: "" },
        bleachSafe: { type: "boolean", note: "" }
    },
    hazardResistanceProperties: {
        stainResistance: { type: "string", note: "" },
        waterResistance: { type: "string", note: "" },
        scratchResistance: { type: "string", note: "" },
        petFriendlyRating: { type: "string", note: "" },
        kidsFriendlyRating: { type: "string", note: "" },
        flameResistance: { type: "string", note: "" },
        moldMildewResistance: { type: "string", note: "" },
        allergyFriendlyRating: { type: "string", note: "" },
        chemicalResistance: { type: "string", note: "" },
        liquidAbsorptionTime: { type: "string", note: "" },
        odorRetentionScore: { type: "string", note: "" }
    },
    environmentalAttributes: {
        recycledContentPercent: { type: "number", range: "0-100", note: "" },
        renewableMaterialPercent: { type: "number", range: "0-100", note: "" },
        co2FootprintPerMeter: {
            type: "number | string",
            note: "if available"
        },
        biodegradableComponents: { type: "string", note: "" },
        veganFriendly: {
            type: "boolean",
            note: "especially for leather alternatives"
        }
    }
};

const materialColorSchema = {
    basicColorInformation: {
        colorName: { type: "string", note: "" },
        internalCode: { type: "string", note: "" }
    },
    visualMarketingData: {
        coverImage: { type: "string", note: "" },
        thumbnail: { type: "string", note: "" },
        realPhotos: {
            type: "array<string>",
            note: "macro + context shots"
        },
        colorValues: {
            type: "object",
            note: "",
            properties: {
                hex: {
                    type: "string",
                    format: "#RRGGBB",
                    note: ""
                },
                rgb: {
                    type: "object",
                    note: "",
                    properties: {
                        r: { type: "number", range: "0-255", note: "" },
                        g: { type: "number", range: "0-255", note: "" },
                        b: { type: "number", range: "0-255", note: "" }
                    }
                },
                lab: {
                    type: "object",
                    note: "",
                    properties: {
                        l: { type: "number", note: "" },
                        a: { type: "number", note: "" },
                        b: { type: "number", note: "" }
                    }
                }
            }
        },
        pantoneOrMatchingCode: { type: "string", note: "" },
        glossLevel: {
            type: "string | number",
            note: "for leather, wood, lacquered surfaces"
        },
        patternOrientation: {
            type: "string",
            note: "e.g. vertical / horizontal / multi-directional"
        }
    }
};

// Map each editor type to the root of its schema.
// Our inline schema constants are already the inner objects (e.g. they start
// at "basicInformation", "marketingData", etc.), so we return them directly
// instead of expecting an extra nesting level like productSchema.product.
const SCHEMAS = {
    product: () => productSchema || {},
    part: () => partSchema || {},
    materialCollection: () => materialCollectionSchema || {},
    materialColor: () => materialColorSchema || {}
};

const ALLOWED_IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const ALLOWED_VIDEO_MIME_TYPES = ["video/mp4", "video/webm"];

// ---- FIREBASE (STORAGE) CONFIG --------------------------------------------
// Fill this object with your real Firebase web app config from the Firebase
// console (Project settings → Your apps → Web app).
const firebaseConfig = {
    apiKey: "AIzaSyCUAG14O8NmHVfNtrFR6vMbwecn0gebU68",
    authDomain: "replace-74b35.firebaseapp.com",
    projectId: "replace-74b35",
    storageBucket: "replace-74b35.appspot.com",
    messagingSenderId: "546141390373",
    appId: "1:546141390373:web:e31ce08a7725a13f68e1cc"
};

const STORAGE_PATH = "PIM/appState.json";

const TYPE_META = [
    { key: "product", label: "Product" },
    { key: "part", label: "Part" },
    { key: "materialCollection", label: "Material Collection" },
    { key: "materialColor", label: "Material Color" }
];

