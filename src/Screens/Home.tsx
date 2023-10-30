import { LazyLoadImage } from "react-lazy-load-image-component";
import React, {
    useEffect,
    useState,
    Dispatch,
    SetStateAction
} from "react";

import {
    capitalizeFirstLetter,
    fetchPokemonDataRange,
    fetchTotalPokemonCount,
    sortByHandler
} from "../Utilities/utilities";
import ShowIf from "../Components/ShowIf";
import { Pokemon } from "../Configuration/types";
import placeholderImage from '../assets/placeholder_image.webp';
import classes from "./Home.module.css";


const Home: React.FC = () => {

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [sortOrder, setSortOrder] = useState<"NAME" | "ID">("ID");
    const [totalPokemon, setTotalPokemon] = useState<number>(0);

    const itemsPerPage: number = 12;
    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const endIndex: number = startIndex + itemsPerPage;

    const sortedPokemon: Pokemon[] = [...pokemon].sort((a: Pokemon, b: Pokemon) => {
        if (sortOrder === "NAME") {
            return a.name.localeCompare(b.name);
        } else {
            return parseInt(a.id) - parseInt(b.id);
        }
    });

    const itemsToDisplay: Pokemon[] = sortedPokemon.slice(startIndex, endIndex);


    const loadAllPokemonData = async (
        setPokemon: Dispatch<SetStateAction<Pokemon[]>>,
        setTotalPokemon: Dispatch<SetStateAction<number>>): Promise<void> => {

        const batchSize: number = 100;
        const totalPokemonCount: number = await fetchTotalPokemonCount();
        let offset: number = 0;

        while (offset < totalPokemonCount) {
            const limit: number = Math.min(batchSize, totalPokemonCount - offset);
            await fetchPokemonDataRange(setPokemon, setTotalPokemon, limit, offset);
            offset += batchSize;
            await new Promise((resolve) => setTimeout(resolve, 1));
        }
    };


    useEffect(() => {
        setLoading(true);
        loadAllPokemonData(setPokemon, setTotalPokemon);
        const timer: any = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => {
            clearTimeout(timer);
        }
    }, []);



    return (
        <div className={classes.wrapper}>
            <main className={classes.container}>
                <div className={classes.headingContainer}>
                    <h3>All the Pokemon!</h3>
                    <div className={classes.btnContainerRadio}>
                        <div className={classes.sortOption}>
                            <input
                                checked={sortOrder === "NAME"}
                                name="sort"
                                onChange={sortByHandler(setSortOrder)}
                                type="radio"
                                value="NAME"
                            />
                            <p style={{ paddingLeft: 10 }}>Sort Name</p>
                        </div>
                        <div className={classes.sortOption}>
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
                    <ShowIf
                        condition={!loading}
                        render={() => {
                            return (
                                itemsToDisplay.map((poke: Pokemon, index: number) => {
                                    const formattedName: string = capitalizeFirstLetter(poke?.name);
                                    const image: string = poke?.imageUrl ? poke.imageUrl : placeholderImage;
                                    return (
                                        <div
                                            className={classes.gridItemContainer}
                                            key={poke.name + index}>
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
                            );
                        }}
                        renderElse={() => {
                            return (
                                <p>Catching them all...</p>
                            );
                        }} />
                </div>
                
                <footer>
                    <div className={classes.btnContainerPagination}>
                        <ShowIf
                            condition={!loading && currentPage > 1}
                            render={() => {
                                return (
                                    <div
                                        className={classes.btnPagination}
                                        onClick={() => setCurrentPage((previous: number) => previous - 1)}>
                                        <p>Previous {currentPage > 1 ? currentPage - 1 : ""}</p>
                                    </div>
                                );
                            }}
                            renderElse={() => {
                                return (
                                    <div></div>
                                );
                            }} />
                        <ShowIf
                            condition={!loading && (Math.ceil(totalPokemon / itemsPerPage) - currentPage) > 0}
                            render={() => {
                                return (
                                    <div onClick={() => setCurrentPage((prevPage: number) => prevPage + 1)}
                                        className={classes.btnPagination}>
                                        <p>Next {(Math.ceil(totalPokemon / itemsPerPage) - currentPage) < 1 ? ""
                                            : (Math.ceil((totalPokemon - 1) / itemsPerPage) - currentPage)}</p>
                                    </div>
                                );
                            }}
                            renderElse={() => {
                                return (
                                    <div></div>
                                );
                            }} />
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Home;
