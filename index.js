const input = document.querySelector("#input");
const btn = document.querySelector("button");
const pokemonList = document.querySelector(".pokemon_filter");
const pokemonContainer = document.querySelector(".pokemon-container");

input.onfocus = () => {
    input.setAttribute("placeholder", "search pokemon ...");
    input.style.border = "1px solid rgb(255, 153, 0)";
}


btn.addEventListener("click", fetchData);

function fetchData(e) {
    e.preventDefault();

    if (!input.value) {
        input.style.border = "1px solid red";
        input.setAttribute("placeholder", "nothing entered");
        return;
    }

    const userInput = input.value.toLowerCase();
    input.value = "";

    const url = `https://pokeapi.co/api/v2/pokemon/${userInput}`;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("response was not ok.");
            }
        })
        .then(data => {
            //console.log(data);
            const pokemonObj = {
                name: data.name,
                imgFront: data.sprites.front_default,
                stats: data.stats,
                abilities: data.abilities,
            };
            displayData(pokemonObj);
        })
        .catch(error => {
            console.log(error);
            input.setAttribute("placeholder", "pokemon not found");
            input.style.border = "1px solid red";
        })
}

const pokemonElement = document.createElement("div");
pokemonElement.classList.add("pokemon-element")

function displayData(obj) {
    pokemonList.style.display = "none";
    if (pokemonContainer.children.length > 0) {
        pokemonContainer.removeChild(pokemonElement)
    }

    pokemonElement.innerHTML = `<h2>${obj.name}</h2>
        <img src="${obj.imgFront}"/>
            <h3>stats</h3>
        <ul>
			${obj.stats.map(stat => `<li class='stat'><span>${stat.stat.name}</span><span>${stat.base_stat}</span></li>`).join("")}
		</ul>
            <h3>abilities</h3>
        <ul>
			${obj.abilities.map(power => `<li class='ability'>${power.ability.name}</li>`).join("")}
		</ul>`

    pokemonContainer.appendChild(pokemonElement)
}

input.addEventListener("keyup", pokemonFind);

function pokemonFind() {
    if (pokemonContainer.contains(pokemonElement)) {
        pokemonContainer.removeChild(pokemonElement);
        //console.log("removed pokemonElement");
    }
    //console.log(e.key);
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1154")
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error("response was not ok.")
            }
        })
        .then(data => {
            //console.log(data);
            const pokemonNames = data.results.map(pokemonObj => pokemonObj.name)
            //console.log(pokemonNames);
            const pokemonFilter = pokemonNames.filter(name => name.startsWith(input.value));
            //console.log(pokemonFilter);
            if (pokemonFilter.length === 0) {
                input.value = "";
                input.setAttribute("placeholder", "pokemon not found");
                return;
            }
            const pokmonFilterList = pokemonFilter.map(pokemon => {
                //console.log(pokemon);
                const newLi = document.createElement("li");
                newLi.classList.add("list-group-item");
                newLi.textContent = pokemon;
                return newLi;
            });
            return pokmonFilterList;
        })
        .then(list => {
            //console.log(list);
            pokemonList.innerHTML = "";
            if (input.value) {
                list.forEach(li => {
                    pokemonList.append(li);
                    li.addEventListener("click", () => {
                        input.value = li.textContent;
                        pokemonList.style.display = "none";
                    })
                });
                pokemonList.style.display = "block";
            }

        })
        .catch(error => {
            console.log(error);
        })
};

