import { sanityClient } from './sanity';

export async function getAllWords() {
  return await sanityClient.fetch();
}