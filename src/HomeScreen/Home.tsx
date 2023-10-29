import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { AutoSizer, ListRowRenderer } from "react-virtualized";
import { Pokemon } from "../Configuration/types";
import { capitalizeFirstLetter, sortByHandler } from "../Utilities/utilities";
import placeholderImage from '../assets/placeholder_image.webp';
import { fetchPokemonDataRange } from "../Utilities/utilities"

import classes from "./Home.module.css";


const Home: React.FC = () => {

    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [sortOrder, setSortOrder] = useState<"NAME" | "ID">("NAME");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage: number = 12;
    const initialOffset: number = 0;
    const initialLimit: number = 12;

    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const endIndex: number = startIndex + itemsPerPage;
    const sortedPokemon: Pokemon[] = [...pokemon].sort((a, b) => {
        if (sortOrder === "NAME") {
            return a.name.localeCompare(b.name);
        } else {
            return parseInt(a.id) - parseInt(b.id);
        }
    });

    const itemsToDisplay: Pokemon[] = sortedPokemon.slice(startIndex, endIndex);

    const loadMore = async () => {

        const offset = currentPage * itemsPerPage;
        const limit = itemsPerPage;
console.log("OFFSET", offset)
console.log("pokemon.lenght", pokemon.length)
console.log("Math.ceil((pokemon.length / 12))", Math.ceil((pokemon.length / 12)))

        await fetchPokemonDataRange(setPokemon, limit, offset);

        setCurrentPage((prevPage) => prevPage + 1);
      };
   
    useEffect(() => {
        fetchPokemonDataRange(setPokemon, initialLimit, initialOffset);
        setSortOrder("ID");
    }, []);


    return (
        <div className={classes.wrapper}>
            <main className={classes.container}>
                <div className={classes.headingContainer}>
                    <h3>All the Pokemon!</h3>
                    <div className={classes.btnContainerRadio}>
                        <div
                            className={classes.sortOption}
                        >
                            <input
                                checked={sortOrder === "NAME"}
                                name="sort"
                                onChange={sortByHandler(setSortOrder)}
                                type="radio"
                                value="NAME"
                            />
                            <p style={{ paddingLeft: 10 }}>Sort Name</p>
                        </div>
                        <div
                            className={classes.sortOption}
                        >
                            <input
                                checked={sortOrder === "ID"}
                                name="sort"
                                onChange={sortByHandler(setSortOrder)}
                                type="radio"
                                value="ID"
                            />
                            <p style={{ paddingLeft: 10 }}>Sort ID</p>
                        </div>
                    </div>
                </div>
                <div className={classes.grid}>

                    {itemsToDisplay.length > 0 ? (
                        itemsToDisplay.map((poke, index) => {
                            const formattedName: string = capitalizeFirstLetter(poke?.name);
                            const image: string = poke?.imageUrl ? poke.imageUrl : placeholderImage;
                            return (
                                <div
                                    className={classes.gridItemContainer}
                                    key={poke.name + index}
                                >
                                    <div className={classes.itemContainer}>
                                        <div className={classes.itemImageContainer}>
                                            <LazyLoadImage
                                                alt={`Pokemon character: ${poke?.name}`}
                                                className={classes.itemImage}
                                                loading="lazy"
                                                src={image}
                                            />
                                        </div>
                                        <p>{formattedName}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Catching them all...</p>
                    )}
                </div>
                <footer className={classes.footer}>
                    <div className={classes.btnContainerPagination}>
                        {currentPage > 1 ? (
                            <div
                                onClick={() => {
                                    if (currentPage > 1) {
                                        setCurrentPage((previous) => previous - 1);
                                    }
                                }}
                                className={classes.btnPagination}>
                                <p>Previous {currentPage > 1 ? currentPage - 1 : ""}</p>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        {currentPage <= Math.ceil((pokemon.length / 12)) ? (
                            <div onClick={() => {loadMore()}}
                                className={classes.btnPagination}>
                                <p>Next {currentPage <= Math.ceil((pokemon.length / 12)) ? Math.ceil((pokemon.length / 12)) : " "}</p>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </footer>
            </main>

        </div>
    );
};

export default Home;
