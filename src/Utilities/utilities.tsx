import { Dispatch, SetStateAction } from 'react';
import { Pokemon } from "../Configuration/types";
import { FETCH_POKEMON } from "../Configuration/constants";


/**
 * Gets the pokemon.
 * @param setPokemon 
 * @param setTotalPokemon 
 * @param limit 
 * @param offset 
 * @returns void
 */
export const fetchPokemonDataRange = async (
  setPokemon: Dispatch<SetStateAction<Pokemon[]>>,
  setTotalPokemon: Dispatch<SetStateAction<number>>,
  limit: number,
  offset: number): Promise<void> => {
  try {

    const url: string = `${FETCH_POKEMON}?limit=${limit}&offset=${offset}`;
    const response: Response = await fetch(url);


    if (!response.ok) {
      console.error("Error fetching Pokémon data.");
      alert("Error catching all pokemon, please try again.")
      return;
    }

    const data: { count: number, results: { name: string; url: string; }[] } = await response.json();
    const results: { name: string; url: string; }[] = data.results;
    setTotalPokemon(data.count);

    const chunkPokemonData: Pokemon[] = await Promise.all(
      results.map(async (result: { name: string; url: string; }) => {
        const response: Response = await fetch(result.url);
        const poke: { name: string; id: string; sprites: { front_default: string } } = await response.json();

        const name: string = poke.name;
        const id: string = poke.id;
        const imageUrl: string = poke.sprites.front_default;

        return {
          name,
          id,
          imageUrl,
        };
      })
    );

    setPokemon((prevPokemon) => {
      const uniquePokemon: Pokemon[] = chunkPokemonData.filter((newPoke: Pokemon) => {
        return !prevPokemon.some((prevPoke: Pokemon) => prevPoke.id === newPoke.id);
      });
      return [...prevPokemon, ...uniquePokemon];
    });

  } catch (error: any) {
    console.error(`Error fetching Pokémon data in utilities.tsx at fetchPokemonData: ${error} ${error.code}`);
  }
};


/**
 * Fetch the total number of Pokemon.
 * Helper function for loadAllPokemonData
 * @returns number
 */
export const fetchTotalPokemonCount = async (): Promise<number> => {
  try{
    const response: Response = await fetch(`${FETCH_POKEMON}?limit=1`);
  if (!response.ok) {
    console.error("Error fetching total Pokémon count");
    return 0;
  }
  const data: { count: number } = await response.json();
  return data.count;
  }catch(error: any){
    console.error(`Error fetching Pokémon count: ${error} ${error.code}`);
    return 0;
  }
};


/**
 * Capitalizes the first word in a string.
 * @param str
 * @returns string
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) {
    return "";
  } else {
    return str.replace(/\b\w/g, (match: string) => match.toUpperCase());
  }
};


/**
 * Set the property to sort the pokemon.
 * @param setSortOrder 
 * @returns void
 */
export const sortByHandler = (setSortOrder: Dispatch<SetStateAction<"NAME" | "ID">>) => (
  event: React.ChangeEvent<HTMLInputElement>
): void => {
  const value: "NAME" | "ID" = event.target.value as "NAME" | "ID";
  setSortOrder(value);
};
