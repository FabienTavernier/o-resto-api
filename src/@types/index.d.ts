export type QueryArgs = {
  id: number;
};

export type Restaurant = {
  id: number;
  name: string;
  description: string;
  terrace: boolean;
  cityId: number;
  managerId: number;
};

export type Manager = {
  id: number;
  name: string;
  email: string;
  lastName: string;
  firstName: string;
  password: string;
};

export type Cuisine = {
  id: number;
  label: string;
};

export type City = {
  id: number;
  name: string;
  postalCode: string;
  location: Location;
};

export type Location = {
  x: number;
  y: number;
};
