import { Dispatch, SetStateAction } from 'react';
import { Pokemon } from "../Configuration/types";
import { FETCH_POKEMON } from "../Configuration/constants";


export const fetchPokemonDataRange = async (
  setPokemon: Dispatch<SetStateAction<Pokemon[]>>, 
  setTotalPokemon: Dispatch<SetStateAction<number>>,
  limit: number, 
  offset: number): Promise<void> => {
  try {

    const url: string = `${FETCH_POKEMON}?limit=${limit}&offset=${offset}`;
    const response: Response = await fetch(url);
   

    if (!response.ok) {
      console.error("Error fetching Pokémon data");
      return;
    }

    const data: {count: number, results: { name: string; url: string; }[] } = await response.json();
    const results: { name: string; url: string; }[] = data.results;
    setTotalPokemon(data.count);
    
    const chunkPokemonData: Pokemon[] = await Promise.all(
      results.map(async (result) => {
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
      const uniquePokemon = chunkPokemonData.filter((newPoke) => {
        return !prevPokemon.some((prevPoke) => prevPoke.id === newPoke.id);
      });
      return [...prevPokemon, ...uniquePokemon];
    });
    

  } catch (error: any) {
    console.error(`Error fetching Pokémon data in App.tsx fetchPokemonData: ${error} ${error.code}`);
  }
};

export function capitalizeFirstLetter(str: string): string {
  if (!str) {
    return "";
  } else {
    return str.replace(/\b\w/g, (match: string) => match.toUpperCase());
  }
};

export const sortByHandler = (setSortOrder: Dispatch<SetStateAction<"NAME" | "ID">>) => (
  event: React.ChangeEvent<HTMLInputElement>
): void => {
  const value: "NAME" | "ID" = event.target.value as "NAME" | "ID";
  setSortOrder(value);
};
