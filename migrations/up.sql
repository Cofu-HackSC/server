  
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS address_standardizer;
CREATE EXTENSION IF NOT EXISTS address_standardizer_data_us;

CREATE TABLE Users (
    id UUID NOT NULL PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    bio TEXT NOT NULL,
    photoUrl TEXT,
    location geography(POINT),
    address TEXT,
    isCook BOOLEAN,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    hidePurchases BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Items (
    id UUID NOT NULL PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
    sellerID UUID REFERENCES Users (id),
    cost NUMERIC CHECK (cost > 0),
    name TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    photoUrl TEXT,
    -- TODO: REPLACE WITH AVG
    averageItemRating NUMERIC,
    ingredients TEXT NOT NULL,
    description TEXT NOT NULL,
    delivery BOOLEAN,
    pickup BOOLEAN
);

CREATE TABLE Tags (
    itemID UUID NOT NULL,
    tag TEXT NOT NULL,
    PRIMARY KEY(itemID, tag)
);

CREATE TABLE Sales (
    id UUID NOT NULL PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
    -- REPETITIVE - DELETE LATER - HERE NOW FOR EASE OF JOINS
    sellerID UUID REFERENCES Users (id),
    buyerID UUID REFERENCES Users (id),
    itemID UUID REFERENCES Items (id),
    itemAmount INTEGER NOT NULL DEFAULT 1,
    totalCost NUMERIC NOT NULL CHECK (totalCost > 0),
    -- TODO: CHECK BETWEEN 0 AND 5
    rating NUMERIC,
    ratingText TEXT,
    hide BOOLEAN DEFAULT FALSE
);

CREATE TABLE CookProfiles (
    id UUID NOT NULL PRIMARY KEY UNIQUE REFERENCES Users (id),
    -- TODO: REPLACE WITH AVG
    averageSaleRating NUMERIC,
    insuranceProofURI TEXT,
    cottageFoodLicenseURI TEXT,
    deliveryDistance NUMERIC
);

CREATE TABLE CookApplication (
    id UUID NOT NULL PRIMARY KEY UNIQUE REFERENCES Users (id),
    insuranceProofURI TEXT,
    cottageFoodLicenseURI TEXT,
    approved BOOLEAN
);