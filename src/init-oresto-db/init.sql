BEGIN;

CREATE DOMAIN "postal_code_fr" AS text
CHECK(
    value ~ '^\d{5}$'
);

CREATE DOMAIN "email" AS text
CHECK(
    value ~ '(?:[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])'
);

CREATE TABLE "manager" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" email NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "cuisine" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "city" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "postal_code" postal_code_fr NOT NULL UNIQUE,
    "location" POINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "restaurant" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "terrace" BOOLEAN NOT NULL DEFAULT FALSE,
    "manager_id" INT NOT NULL REFERENCES "manager" ("id") ON DELETE CASCADE,
    "city_id" INT NOT NULL REFERENCES "city" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ,
    UNIQUE ("name", "city_id")
);

CREATE TABLE "rating" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "value" INT NOT NULL CHECK(value >= 0 AND value <= 5),
    "restaurant_id" INT NOT NULL REFERENCES "restaurant" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "restaurant_has_cuisine" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "restaurant_id" INT NOT NULL REFERENCES "restaurant" ("id") ON DELETE CASCADE,
    "cuisine_id" INT NOT NULL REFERENCES "cuisine" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ,
    UNIQUE ("restaurant_id", "cuisine_id")
);

/*
    View = « bookmark » d'une requête

    Objectif :
    - récupérer toutes les infos d'un restaurant (`r.*`)
    - avec le nombre d'avis de ce restaurant → GROUP BY + COUNT
    - avec la note moyenne des avis → GROUP BY + AVG
        - AVG → moyenne
        - ROUND(avg, 1) → on arrondit à 1 chiffre après la virgule
        - COALESCE(round, 0.0) → si pas de `round`, alors on le définit `0.0`
*/
CREATE VIEW "restaurant_with_rating" AS
SELECT 
    "r".*,
    COALESCE(ROUND(AVG("rt"."value")::NUMERIC, 1), 0.0) AS "rating",
    COUNT("rt"."value") AS "rating_count"
FROM 
    "restaurant" "r"
LEFT JOIN 
    "rating" "rt"
ON 
    "r"."id" = "rt"."restaurant_id"
GROUP BY 
    "r"."id", "r"."name";

COMMIT;