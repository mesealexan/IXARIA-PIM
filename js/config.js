// ---- SCHEMA PLACEHOLDERS --------------------------------------------------
// Replace each const below with your real JSON file content.
// The structure this app expects:
// { "product": { ...groups and fields... } }, etc.

const productSchema = {
    basicInformation: {
        productName: { type: "string" },
        variantSKU: { type: "string" },
        brand: { type: "string" },
        collection: { type: "string" },
        yearOfDesign: { type: "string | number" },
        designer: { type: "string" },
        targetMarkets: { type: "array<string>" },
        eanGTIN: { type: "string" }
    },
    marketingData: {
        coverImages: { type: "array<string>" },
        thumbnails: { type: "array<string>" },
        dimensionImage: { type: "string" },
        realPhotos: { type: "array<string>" },
        video: { type: "string" },
        shortDescription: { type: "string" },
        midDescription: { type: "string" },
        longDescription: { type: "string" },
        sellingPoints: { type: "array<string>" },
        lifestyleStoryAngle: { type: "string" }
    },
    seoData: {
        searchKeywords: { type: "array<string>" },
        searchTags: { type: "array<string>" },
        searchFilters: {
            type: "object",
            properties: {
                comfortLevel: { type: "string" },
                armType: { type: "string" },
                other: { type: "any" }
            }
        },
        comparisonAttributes: { type: "object<any>" }
    },
    complementaryProducts: {
        productIds: { type: "array<string>" }
    },
    productTypeStyle: {
        baseType: {
            type: "enum",
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
            values: ["left-facing", "right-facing"]
        }
    },
    computedDimensions: {
        totalWidthCm: {
            type: "object",
            properties: {
                min: { type: "number | null" },
                max: { type: "number | null" },
                increment: { type: "number | null" }
            }
        },
        totalDepthCm: {
            type: "object",
            properties: {
                min: { type: "number | null" },
                max: { type: "number | null" },
                increment: { type: "number | null" }
            }
        },
        totalHeightCm: {
            type: "object",
            properties: {
                min: { type: "number | null" },
                max: { type: "number | null" },
                increment: { type: "number | null" }
            }
        },
        legHeightCm: { type: "number | null" },
        numberOfLegs: { type: "number | null" },
        numberOfSeats: { type: "string | number" }
    },
    careWarranty: {
        totalWarrantyYears: { type: "number | null" },
        warrantyConditions: { type: "string" },
        warrantyBreakdown: {
            frame: { type: "string" },
            mechanisms: { type: "string" },
            cushions: { type: "string" }
        },
        expectedLifespanYears: { type: "number | null" },
        repairabilityScore: { type: "number", range: "0-5" },
        sparePartsAvailabilityYears: { type: "number | null" }
    },
    deliveryShipping: {
        deliveryMethods: { type: "array<string>" },
        deliveryRegions: { type: "array<string>" },
        estimatedDeliveryTime: { type: "string" },
        productionLeadTime: { type: "string" },
        dispatchTime: { type: "string" },
        deliveryCostRules: { type: "string" },
        freeDeliveryThreshold: { type: "number | null" },
        extraFees: {
            type: "object",
            properties: {
                stairs: { type: "number | null" },
                remoteAreas: { type: "number | null" },
                other: { type: "string" }
            }
        },
        schedulingOptions: { type: "string" },
        missedDeliveryFee: { type: "number | null" },
        returnWindow: { type: "string" },
        returnConditions: { type: "string" },
        returnPickupAvailable: { type: "boolean" },
        returnCosts: { type: "string" },
        requiresOriginalPackaging: { type: "boolean" },
        assemblyLevel: {
            type: "enum",
            values: ["none", "minimal", "full"]
        },
        assemblyGuideLink: { type: "string" }
    },
    packagingLogistics: {
        numberOfBoxesPerSize: { type: "object<number>" },
        packageDimensionsWeightPerSize: { type: "object<any>" },
        volumetricWeight: { type: "string" },
        flatPack: { type: "boolean" },
        packagingMaterial: { type: "string" }
    },
    regulatoryCompliance: {
        fireSafetyDeclaration: { type: "string" },
        reachSubstanceDisclosure: { type: "string" },
        vocEmissions: { type: "string" },
        woodSourcingCertification: { type: "string" },
        packagingRecyclability: { type: "string" },
        repairInstructions: { type: "string" },
        productSafetyCertifications: { type: "array<string>" },
        chemicalCompliance: { type: "string" },
        loadBearingStandards: { type: "string" }
    },
    lifecycleServiceability: {
        sparePartSKUs: { type: "array<string>" },
        repairabilityScore: { type: "number", range: "0-5" },
        replaceableComponents: { type: "array<string>" },
        disassemblyInstructions: { type: "string" }
    }
};

const partSchema = {
    basicModelInformation: {
        modelName: { type: "string" },
        variantSKU: { type: "string" },
        brand: { type: "string" },
        collection: { type: "string" },
        launchSeasonYear: { type: "string" }
    },
    sewing: {
        sewingType: { type: "string" },
        sewingColor: { type: "string" },
        stitchDensity: { type: "number", unit: "stitches per inch/cm" },
        reinforcementType: {
            type: "enum | string",
            values: ["edge reinforcement", "piping", "double stitch"]
        }
    },
    comfortFilling: {
        seatCushionCore: { type: "string" },
        backCushionCore: { type: "string" },
        suspensionSystem: { type: "string" },
        comfortRating: {
            type: "enum",
            values: ["soft", "medium", "firm"]
        },
        foamDensity: { type: "number", unit: "kg/m3 or lb/ft3" },
        foamFirmnessILD: { type: "number", unit: "ILD" },
        layerCompositionDiagram: {
            type: "string",
            format: "asset-id or URL"
        }
    },
    featuresFunctions: {
        recliningMechanism: {
            type: "enum",
            values: ["none", "manual", "power"]
        },
        sofaBedMechanism: { type: "string" },
        sofaBedMattressSize: {
            type: "string",
            note: "e.g. per length configuration"
        },
        storage: {
            type: "enum | string",
            values: ["none", "under-seat", "in base"]
        },
        adjustableHeadrests: { type: "boolean" },
        removableSeatCushions: { type: "boolean" },
        removableBackCushions: { type: "boolean" },
        modularConnections: {
            type: "array<string>",
            note: "hooks, rails, docking types"
        },
        usbPowerOptions: { type: "array<string>" },
        heatMassageOptions: { type: "array<string>" }
    },
    frameConstruction: {
        frameMaterialConstruction: { type: "string" },
        joineryType: { type: "string" },
        frameWarrantyYears: { type: "number | null" },
        woodCertification: {
            type: "enum | string",
            values: ["FSC", "PEFC", "none"]
        },
        recycledContentPercent: { type: "number", range: "0-100" },
        metalGauge: { type: "string" }
    },
    sizeDimensions: {
        totalWidthCm: {
            type: "object",
            properties: {
                min: { type: "number | null" },
                max: { type: "number | null" },
                increment: { type: "number | null" }
            }
        },
        totalDepthCm: {
            type: "object",
            properties: {
                min: { type: "number | null" },
                max: { type: "number | null" },
                increment: { type: "number | null" }
            }
        },
        totalHeightCm: { type: "number | null" },
        seatHeightCm: { type: "number | null" },
        seatDepthCm: { type: "number | null" },
        armHeightCm: { type: "number | null" },
        armWidthCm: { type: "number | null" },
        backHeightCm: { type: "number | null" },
        backWidthCm: { type: "number | null" },
        legHeightCm: { type: "number | null" },
        numberOfLegs: { type: "number | null" },
        numberOfSeats: {
            type: "enum | string",
            values: ["1", "2", "2.5", "3", "3.5", "custom"]
        },
        toleranceRangeCm: { type: "number", note: "+/- cm" }
    },
    deliveryConstraints: {
        assembledDimensions: {
            type: "object",
            properties: {
                widthCm: { type: "number | null" },
                depthCm: { type: "number | null" },
                heightCm: { type: "number | null" }
            }
        },
        assembledWeightKg: { type: "number | null" },
        packageDimensionsWeight: {
            type: "object<any>",
            note: "already in Packaging & Logistics – reference or override"
        },
        heaviestBoxWeightKg: { type: "number | null" },
        minimumDoorWidthRequiredCm: { type: "number | null" },
        minimumStaircaseWidthCm: { type: "number | null" },
        fitsInElevator: { type: "boolean" },
        assemblyRequired: { type: "boolean" },
        toolsRequired: { type: "array<string>" },
        assemblyTimeMinutes: { type: "number | null" },
        numberOfPeopleRequiredForLifting: { type: "number | null" }
    }
};

const materialCollectionSchema = {
    basicMaterialInformation: {
        materialName: { type: "string" },
        internalCode: { type: "string" },
        materialType: {
            type: "enum",
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
        colorName: { type: "string" },
        priceCategory: { type: "string" },
        launchSeasonYear: { type: "string" },
        availabilityStatus: {
            type: "enum",
            values: ["active", "discontinued", "limited", "made-to-order"]
        },
        supplier: { type: "string" },
        countryOfOrigin: { type: "string" }
    },
    physicalTechnicalProperties: {
        fabricProperties: {
            composition: { type: "string" },
            weightGsm: { type: "number", unit: "g/m²" },
            backingType: { type: "string" },
            abrasionResistanceMartindale: { type: "number" },
            pillingResistance: { type: "string" },
            colorFastnessToLight: { type: "string" },
            colorFastnessToRubbing: { type: "string" },
            tearStrength: { type: "string" },
            tensileStrength: { type: "string" },
            stretchElasticity: { type: "string" }
        },
        leatherProperties: {
            leatherType: {
                type: "enum | string",
                values: [
                    "aniline",
                    "semi-aniline",
                    "corrected-grain",
                    "top-grain",
                    "split"
                ]
            },
            originOfHide: { type: "string" },
            thicknessMm: { type: "number" },
            finishType: {
                type: "enum | string",
                values: ["pigmented", "waxed", "natural"]
            },
            grainType: { type: "string" },
            breathability: { type: "string" }
        },
        outdoorProperties: {
            uvResistance: { type: "string" },
            moldMildewResistance: { type: "string" },
            chlorineResistance: { type: "string" },
            waterRepellency: { type: "string" },
            outdoorCertification: { type: "string" }
        },
        woodMetalOtherHardMaterials: {
            speciesAlloyType: { type: "string" },
            surfaceFinish: {
                type: "enum | string",
                values: ["lacquer", "oil", "stain", "powder-coat"]
            },
            hardnessWood: { type: "string" },
            corrosionResistanceMetal: { type: "string" }
        },
        plasticProperties: {
            plasticType: {
                type: "enum | string",
                values: ["PP", "ABS", "PVC", "Nylon", "PU", "PET", "HDPE"]
            },
            surfaceFinish: {
                type: "enum | string",
                values: ["matte", "glossy", "textured"]
            },
            density: { type: "number" },
            impactResistance: { type: "string" },
            uvResistance: { type: "string" },
            chemicalResistance: { type: "string" },
            recyclabilityRating: { type: "string" },
            heatResistance: { type: "string" }
        },
        sewingThreadProperties: {
            fiberType: {
                type: "enum | string",
                values: ["polyester", "nylon", "cotton", "bonded thread"]
            },
            threadThicknessTex: { type: "string" },
            uvResistance: { type: "string" },
            colorFastness: { type: "string" },
            heatResistance: { type: "string" }
        }
    },
    performanceCertifications: {
        oekoTex: { type: "string" },
        reachCompliant: { type: "boolean" },
        greenguard: { type: "boolean" },
        greenguardGold: { type: "boolean" },
        isoStandards: { type: "array<string>" },
        fireRatings: {
            en1021_1: { type: "boolean" },
            en1021_2: { type: "boolean" },
            calTB117: { type: "boolean" }
        },
        sustainabilityCertifications: { type: "array<string>" },
        vocEmissionsRating: { type: "string" },
        furnitureGradeCertifications: {
            type: "array<string>",
            note: "e.g. EN 16139, EN 12520"
        },
        antiBacterialCoatingCertification: { type: "string" }
    },
    visualMarketingData: {
        coverImages: { type: "array<string>" },
        thumbnails: { type: "array<string>" },
        realPhotos: {
            type: "array<string>",
            note: "macro + context images"
        },
        videos: { type: "array<string>" },
        shortDescription: { type: "string" },
        mediumDescription: { type: "string" },
        longDescription: { type: "string" }
    },
    careMaintenance: {
        cleaningInstructions: { type: "string" },
        compatibleCleaningProducts: { type: "array<string>" },
        machineWashable: { type: "boolean" },
        ironingInstructions: { type: "string" },
        dryCleanOnly: { type: "boolean" },
        vacuumingFrequency: { type: "string" },
        spotCleanGuidelines: { type: "string" },
        protectiveSprayRecommended: { type: "boolean" },
        maintenanceInterval: { type: "string" },
        professionalCleaningCode: {
            type: "enum | string",
            values: ["W", "S", "SW", "X"]
        },
        heatSensitivity: { type: "string" },
        bleachSafe: { type: "boolean" }
    },
    hazardResistanceProperties: {
        stainResistance: { type: "string" },
        waterResistance: { type: "string" },
        scratchResistance: { type: "string" },
        petFriendlyRating: { type: "string" },
        kidsFriendlyRating: { type: "string" },
        flameResistance: { type: "string" },
        moldMildewResistance: { type: "string" },
        allergyFriendlyRating: { type: "string" },
        chemicalResistance: { type: "string" },
        liquidAbsorptionTime: { type: "string" },
        odorRetentionScore: { type: "string" }
    },
    environmentalAttributes: {
        recycledContentPercent: { type: "number", range: "0-100" },
        renewableMaterialPercent: { type: "number", range: "0-100" },
        co2FootprintPerMeter: {
            type: "number | string",
            note: "if available"
        },
        biodegradableComponents: { type: "string" },
        veganFriendly: {
            type: "boolean",
            note: "especially for leather alternatives"
        }
    }
};

const materialColorSchema = {
    basicColorInformation: {
        colorName: { type: "string" },
        internalCode: { type: "string" }
    },
    visualMarketingData: {
        coverImage: { type: "string" },
        thumbnail: { type: "string" },
        realPhotos: {
            type: "array<string>",
            note: "macro + context shots"
        },
        colorValues: {
            type: "object",
            properties: {
                hex: {
                    type: "string",
                    format: "#RRGGBB"
                },
                rgb: {
                    type: "object",
                    properties: {
                        r: { type: "number", range: "0-255" },
                        g: { type: "number", range: "0-255" },
                        b: { type: "number", range: "0-255" }
                    }
                },
                lab: {
                    type: "object",
                    properties: {
                        l: { type: "number" },
                        a: { type: "number" },
                        b: { type: "number" }
                    }
                }
            }
        },
        pantoneOrMatchingCode: { type: "string" },
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

