/*
  J'ai organisé mes schémas dans des fichiers GraphQL spécifiques,
  je vais ici définir le schéma global.

  Apollo Server attend une chaîne de caractères,
  je vais chercher le contenu de chaque fichier pour les concaténer
  et exporter le résultat
*/
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;

const manager = readFileSync(join(__dirname, './manager.gql'), 'utf-8');

const schema = `
  ${manager}
`;

export default schema;
