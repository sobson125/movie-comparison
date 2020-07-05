const autoCompleteConfig = {
    renderOption: (movie) => {
        const imgSrc = movie.Poster === 'N/A' ? "" : movie.Poster;
        return `
            <img src="${imgSrc}"/>
            ${movie.Title}
            ${movie.Year}
        `;
    },
    inputValue: (movie) => {
        return movie.Title;
    },
    fetchData: async (query) => {
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: "cfed9d4e",
                s: query
            }
        })
        if (response.data.Error) {
            return [];
        }
        return response.data.Search;
    }
}

createAutoCompleteWidget({
    root: document.querySelector("#left-autocomplete"),
    ...autoCompleteConfig,
    onOptionSelect: (movie) => {
        document.querySelector(".tutorial").classList.add("is-hidden");
        fetchDetailsSelectData(movie, document.querySelector("#left-summary"), "left");
    },
})

createAutoCompleteWidget({
    root: document.querySelector("#right-autocomplete"),
    ...autoCompleteConfig,
    onOptionSelect: (movie) => {
        document.querySelector(".tutorial").classList.add("is-hidden");
        fetchDetailsSelectData(movie, document.querySelector("#right-summary"), "right");
    },
})

const compareMovies = () => {
    const leftStats = document.querySelectorAll("#left-summary .notification");
    const rightStats = document.querySelectorAll("#right-summary .notification");
    leftStats.forEach((leftStat, index) =>{
        const rightStat = rightStats[index];
        const leftStatValue  = parseInt(leftStat.dataset.value);
        const rightStatValue = parseInt(rightStat.dataset.value);
        if (rightStatValue>leftStatValue){
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        } else{
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }
    })

}

let leftMovie, rightMovie;
const fetchDetailsSelectData = async (movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "cfed9d4e",
            i: movie.imdbID
        }
    })
    if (response.data.Error) {
        return [];
    }
    summaryElement.innerHTML = movieDetailsTemplate(response.data)
    if (side === "left") {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        compareMovies();
    }

}

const movieDetailsTemplate = (movieDetail) => {

    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
    const metascore = parseInt(movieDetail.Metascore)
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const numberOfVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""))
    const numberOfAwards = movieDetail.Awards.split(" ").reduce((previousValue, word) => {
        const number = parseInt(word);
        if (isNaN(number)) {
            return previousValue;
        } else {
            return previousValue += number;
        }
    }, 0)
    console.log(dollars, metascore, imdbRating, numberOfVotes);
    console.log(numberOfAwards);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" alt="Poster of a movie"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary" data-value = ${numberOfAwards}>
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary" data-value = ${dollars}>
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">BoxOffice</p>
        </article>
        <article class="notification is-primary" data-value = ${metascore}>
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary" data-value = ${imdbRating}>
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary" data-value = ${numberOfVotes}>
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}

