import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fakerFR as faker } from '@faker-js/faker';
import debug from 'debug';

/**
 * Ce fichier sert à générer les données pour alimenter la db du projet O-Resto
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const log = debug('seeding');

const NB_MANAGERS = 500;
const NB_RESTAURANTS = 2_000;
const NB_RATINGS = 10_000;
const NB_CUISINE = 15;
const NB_CITIES = 15; // pas trop de villes sinon ça flood l'api de météo !
const SQL_FILE_PATH = path.join(__dirname, '../init-oresto-db/seeding.sql');

generateSeedingFile();

function pgQuoteEscape(row) {
  const newRow = {};
  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.entries(row).forEach(([prop, value]) => {
    if (typeof value !== 'string') {
      newRow[prop] = value;
      return;
    }
    newRow[prop] = value.replaceAll("'", "''");
  });
  return newRow;
}

function saveQuery(query) {
  fs.appendFileSync(SQL_FILE_PATH, `${query}\n`);
}

function generateManagers(nbManagers) {
  const managers = [];
  for (let iManager = 0; iManager < nbManagers; iManager += 1) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const manager = {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      password: faker.internet.password(),
    };
    managers.push(manager);
  }
  return managers;
}

async function insertManagers(managers) {
  const managerValues = managers.map(
    (manager) => `(
      '${manager.firstName}',
      '${manager.lastName}',
      '${manager.email}',
      '${manager.password}'
    )`,
  );

  const queryStr = `
    INSERT INTO "manager"
      ("first_name", "last_name", "email", "password")
    VALUES
      ${managerValues};
  `;
  saveQuery(queryStr);
}

function generateCuisines(nbCuisines) {
  const cuisines = [];
  for (let i = 0; i < nbCuisines; i += 1) {
    const cuisine = {
      label: faker.food.ethnicCategory(),
    };
    cuisines.push(cuisine);
  }
  return cuisines;
}

async function insertCuisines(cuisines) {
  const cuisinesValues = cuisines.map((cuisine) => {
    const newCuisine = pgQuoteEscape(cuisine);
    return `('${newCuisine.label}')`;
  });

  const queryStr = `
    INSERT INTO "cuisine"
      ("label")
    VALUES
      ${cuisinesValues}
    ;
  `;
  saveQuery(queryStr);
}

function generateCities(nbCities) {
  const cities = [];
  for (let i = 0; i < nbCities; i += 1) {
    let name = faker.location.city();

    while (cities.find((city) => city.name === name)) {
      name = faker.location.city();
    }

    const d1 = faker.number.int({ min: 0, max: 9 });
    const d2 = faker.number.int({ min: 0, max: 9 });
    const d3 = faker.number.int({ min: 0, max: 9 });
    const d4 = faker.number.int({ min: 0, max: 9 });

    const postalCode = `${d1}${d2}${d3}${d4}0`;

    const city = {
      name,
      postal_code: postalCode,
      location: faker.location.nearbyGPSCoordinate({
        isMetric: true,
        origin: [46.71109, 1.7191036],
        radius: 500,
      }),
    };
    cities.push(city);
  }
  return cities;
}

async function insertCities(cities) {
  const citiesValues = cities.map((city) => {
    const newCity = pgQuoteEscape(city);
    return `(
      '${newCity.name}',
      '${newCity.postal_code}',
      '${newCity.location}'
    )`;
  });
  const queryStr = `
    INSERT INTO "city"
      ("name", "postal_code", "location")
    VALUES
      ${citiesValues}
    ;
  `;
  saveQuery(queryStr);
}

function generateRestaurant(nbResto, managerIds, cityIds) {
  const restaurants = [];
  for (let i = 0; i < nbResto; i += 1) {
    let name = `${faker.food.adjective()} ${faker.food.dish()}`;

    while (restaurants.find((restaurant) => restaurant.name === name)) {
      name = `${faker.food.adjective()} ${faker.food.dish()}`;
    }
    const restaurant = {
      name,
      description: faker.food.description(),
      terrace: faker.datatype.boolean(),
      manager_id:
        managerIds[
          faker.number.int({
            min: 0,
            max: managerIds.length - 1,
          })
        ],
      city_id:
        cityIds[
          faker.number.int({
            min: 0,
            max: cityIds.length - 1,
          })
        ],
    };

    restaurants.push(restaurant);
  }
  return restaurants;
}

async function insertRestaurant(restaurants) {
  const restaurantValues = restaurants.map((restaurant) => {
    const newRestaurant = pgQuoteEscape(restaurant);
    return `(
      '${newRestaurant.name}',
      '${newRestaurant.description}',
      ${newRestaurant.terrace},
      ${newRestaurant.manager_id},
      ${newRestaurant.city_id}
    )`;
  });

  const queryStr = `
    INSERT INTO "restaurant"
      ("name", "description", "terrace", "manager_id", "city_id")
    VALUES
      ${restaurantValues}
    ;
  `;
  saveQuery(queryStr);
}

function generateRatings(nbRatings) {
  const ratings = [];
  for (let i = 0; i < nbRatings; i += 1) {
    const rating = {
      value: faker.number.int({ min: 1, max: 5 }),
      restaurant_id: faker.number.int({ min: 1, max: NB_RESTAURANTS }),
    };
    ratings.push(rating);
  }
  return ratings;
}

function insertRatings(ratings) {
  const ratingsValues = ratings.map(
    (rating) => `(
      ${rating.value},
      ${rating.restaurant_id}
    )`,
  );

  const queryStr = `
    INSERT INTO "rating"
      ("value", "restaurant_id")
    VALUES
      ${ratingsValues}
    ;
  `;
  saveQuery(queryStr);
}

function generateRestaurantHasCuisine(restaurantIds, cuisineIds) {
  const restaurantHasCuisines = restaurantIds.flatMap((restaurantId) => {
    const cuisineIdsFree = [...cuisineIds];
    const nbRestaurantCuisine = faker.number.int({ min: 1, max: 2 });
    const cuisines = [];
    for (let i = 0; i < nbRestaurantCuisine; i += 1) {
      const randomCuisineIndex = faker.number.int(cuisineIdsFree.length - 1);
      const cuisineId = cuisineIdsFree.splice(randomCuisineIndex, 1)[0];

      cuisines.push({
        cuisineId,
        restaurantId,
      });
    }
    return cuisines;
  });
  return restaurantHasCuisines;
}

async function insertRestaurantHasCuisine(restaurantHasCuisines) {
  const restaurantHasCuisineValues = restaurantHasCuisines.map(
    (restaurantHasCuisine) => `(
      ${restaurantHasCuisine.cuisineId},
      ${restaurantHasCuisine.restaurantId}
    )`,
  );

  const queryStr = `
    INSERT INTO "restaurant_has_cuisine"
      ("cuisine_id", "restaurant_id")
    VALUES
      ${restaurantHasCuisineValues}
    ;
  `;
  saveQuery(queryStr);
}

async function generateSeedingFile() {
  /**
   * Générations d'utilisateurs fake
   * Ajout de ces utilisateurs en BDD
   */
  const managers = generateManagers(NB_MANAGERS);
  await insertManagers(managers);
  log(`${managers.length} managers queries saved`);

  /**
   * Génération des style de cuisine fake
   * Ajout de ces style de cuisine en BDD
   */
  const cuisines = generateCuisines(NB_CUISINE);
  await insertCuisines(cuisines);
  log(`${cuisines.length} cuisines queries saved`);

  /**
   * Génération des villes fake
   * Ajout de ces villes en BDD
   */
  const cities = generateCities(NB_CITIES);
  await insertCities(cities);
  log(`${cities.length} cities queries saved`);

  /**
   * Génération des restaurants fake
   * Ajout de ces restaurants dans la BDD
   */
  const restaurants = await generateRestaurant(
    NB_RESTAURANTS,
    managers.map((_, i) => i + 1),
    cities.map((_, i) => i + 1),
  );
  await insertRestaurant(restaurants);
  log(`${restaurants.length} restaurants queries saved`);

  /**
   * Génération des ratings fake
   * Ajout de ces ratings dans la BDD
   */
  const ratings = await generateRatings(NB_RATINGS);
  await insertRatings(ratings);
  log(`${ratings.length} ratings queries saved`);

  /**
   * Association des restaurants et des styles de cuisine
   * Ajout de ces associations en BDD
   */
  const restaurantHasCuisines = generateRestaurantHasCuisine(
    restaurants.map((_, i) => i + 1),
    cuisines.map((_, i) => i + 1),
  );
  await insertRestaurantHasCuisine(restaurantHasCuisines);
  log(
    `${restaurantHasCuisines.length} restaurant <> cuisine association queries saved`,
  );
}
