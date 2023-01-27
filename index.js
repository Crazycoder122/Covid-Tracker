// Defining API Constants
const API = "https://disease.sh/v3/covid-19/countries";
const WORLD_API = "https://disease.sh/v3/covid-19/all";

// Targetting the DOM Elements
const main_container = document.getElementsByClassName("main-container")[0];
const country = document.getElementsByClassName("country");
const infected = document.getElementsByClassName("infected");
const recovered = document.getElementsByClassName("recovered");
const deaths = document.getElementsByClassName("deaths");
const update_btn = document.getElementsByClassName("update")[0];
const inf_inc = document.getElementsByClassName("infected-inc")[0];
const inf_dec = document.getElementsByClassName("infected-dec")[0];
const rec_inc = document.getElementsByClassName("recovered-inc")[0];
const rec_dec = document.getElementsByClassName("recovered-dec")[0];
const dead_inc = document.getElementsByClassName("death-inc")[0];
const dead_dec = document.getElementsByClassName("death-dec")[0];
const list_sort_heading =
  document.getElementsByClassName("list-sort-heading")[0];
const search_ip = document.getElementsByClassName("search-ip")[0];
const view_full = document.getElementsByClassName("full-view")[0];
const inf_world_count = document.getElementsByClassName("inf-world-count")[0];
const rec_world_count = document.getElementsByClassName("rec-world-count")[0];
const death_world_count =
  document.getElementsByClassName("death-world-count")[0];

// Adding the Row for a given country and its details
function add_row(flag, country, infected, recovered, deceased) {
  // Creating the main div for a country
  let created_div_1 = document.createElement("div");
  created_div_1.classList.add("data-row");

  // Inserting the "flag" div
  let country_div = document.createElement("div");
  country_div.innerHTML = `<img src="${flag}" class="flag"> &nbsp; ${country}`;
  country_div.classList.add("country");

  // Inserting the "infected" div
  let infected_div = document.createElement("div");
  infected_div.innerHTML = infected;
  infected_div.classList.add("infected");

  // Inserting the "recovered" div
  let recovered_div = document.createElement("div");
  recovered_div.innerHTML = recovered;
  recovered_div.classList.add("recovered");

  // Inserting the "death" div
  let death_div = document.createElement("div");
  death_div.innerHTML = deceased;
  death_div.classList.add("deaths");

  // Mounting the child div within the parent div
  created_div_1.appendChild(country_div);
  created_div_1.appendChild(infected_div);
  created_div_1.appendChild(recovered_div);
  created_div_1.appendChild(death_div);

  // Mounting the Parent Div to the main app
  main_container.appendChild(created_div_1);
}

// Function for adding the row with the NAME HIGHLIGHTING Feature while searching
function add_row_while_ip(
  start,
  end,
  flag,
  country,
  infected,
  recovered,
  deceased
) {
  let created_div_1 = document.createElement("div");
  created_div_1.classList.add("data-row");

  let country_div = document.createElement("div");
  country_div.innerHTML = `<img src="${flag}" class="flag"> &nbsp;`;
  for (let i = 0; i < start; i++) country_div.innerHTML += `${country[i]}`;
  for (let i = start; i < end; i++)
    country_div.innerHTML += `<span class='ip-dec'>${country[i]}</span>`;
  for (let i = end; i < country.length; i++)
    country_div.innerHTML += `${country[i]}`;

  country_div.classList.add("country");

  let infected_div = document.createElement("div");
  infected_div.innerHTML = infected;
  infected_div.classList.add("infected");

  let recovered_div = document.createElement("div");
  recovered_div.innerHTML = recovered;
  recovered_div.classList.add("recovered");

  let death_div = document.createElement("div");
  death_div.innerHTML = deceased;
  death_div.classList.add("deaths");

  created_div_1.appendChild(country_div);
  created_div_1.appendChild(infected_div);
  created_div_1.appendChild(recovered_div);
  created_div_1.appendChild(death_div);

  main_container.appendChild(created_div_1);
}

// Function to update the world data
function update_world_data() {
  // Fetching the World Data and then putting it in the main page
  fetch(WORLD_API)
    .then((d) => {
      return d.json();
    })
    .then((d) => {
      inf_world_count.innerHTML = d.cases;
      rec_world_count.innerHTML = d.recovered;
      death_world_count.innerHTML = d.deaths;
    });
}

// Function for setting the Heading
function set_heading() {
  country[0].style.backgroundColor = "rgb(143, 97, 37)";
  infected[0].style.backgroundColor = "rgb(199, 199, 22)";
  recovered[0].style.backgroundColor = "rgb(28, 160, 28)";
  deaths[0].style.backgroundColor = "rgb(211, 93, 93)";
}

// Getting the Data
const getDataFromAPI = async () => {
  let res = await (await fetch(API)).json();
  return res;
};

// Populating the whole JSON Array in the page
const populateData = (d) => {
  main_container.innerHTML = "";
  for (let i = 0; i < d.length; i++)
    add_row(
      d[i].countryInfo["flag"],
      d[i].country,
      d[i].cases,
      d[i].recovered,
      d[i].deaths
    );
};

// Update the whole data
async function update_data() {
  main_container.innerHTML = "";

  const d = await getDataFromAPI();

  populateData(d);
}

// JSON Array sorting function
const sortArrayByProperty = (property, isIncreasing) => {
  return function (a, b) {
    if (a[property] > b[property]) return isIncreasing ? 1 : -1;
    else if (a[property] < b[property]) return isIncreasing ? -1 : 1;

    return 0;
  };
};

// Function for sorting the JSON Array given the params name on which we are going to sort
const updateJSON = (json_array, param, isIncreasing = true) => {
  return json_array.sort(sortArrayByProperty(param, isIncreasing));
};

// Click Listener for Update Button
update_btn.addEventListener("click", function () {
  update_data();
  update_world_data();
  list_sort_heading.innerHTML =
    "The List is Sorted Based on Alphabetical Ordering of Country Names";
});

// Click Listener for "Sort by Increasing Infection" Button
inf_inc.addEventListener("click", async function () {
  const sortedData = updateJSON(await getDataFromAPI(), "cases");

  populateData(sortedData);

  list_sort_heading.innerHTML =
    "The List is in Increasing Order of Infected Cases";
});

// Click Listener for "Sort by Decreasing Infection" Button
inf_dec.addEventListener("click", async function () {
  const sortedData = updateJSON(await getDataFromAPI(), "cases", false);
  populateData(sortedData);
  list_sort_heading.innerHTML =
    "The List is in Decreasing Order of Infected Cases";
});

// Click Listener for "Sort by Increasing Recovered" Button
rec_inc.addEventListener("click", async function () {
  const sortedData = updateJSON(await getDataFromAPI(), "recovered");
  populateData(sortedData);
  list_sort_heading.innerHTML =
    "The List is in Increasing Order of Recovered Cases";
});

// Click Listener for "Sort by Decreasing Recovered" Button
rec_dec.addEventListener("click", async function () {
  const sortedData = updateJSON(await getDataFromAPI(), "recovered", false);
  populateData(sortedData);
  list_sort_heading.innerHTML =
    "The List is in Decreasing Order of Recovered Cases";
});

// Click Listener for "Sort by Increasing Death" Button
dead_inc.addEventListener("click", async function () {
  const sortedData = updateJSON(await getDataFromAPI(), "deaths");
  populateData(sortedData);
  list_sort_heading.innerHTML = "The List is in Increasing Order of Deaths";
});

// Click Listener for "Sort by Decreasing Death" Button
dead_dec.addEventListener("click", async function () {
  const sortedData = updateJSON(await getDataFromAPI(), "deaths", false);
  populateData(sortedData);
  list_sort_heading.innerHTML = "The List is in Decreasing Order of Deaths";
});

// Click Listener for Viewing the Whole List
view_full.addEventListener("click", function () {
  list_sort_heading.innerHTML =
    "The List is Sorted Based on Alphabetical Ordering of Country Names";
  search_ip.value = "";
  update_data();
});

// Function to handle Search Functionality
search_ip.addEventListener("input", async function () {
  // Getting the Search Argument
  if (search_ip.value == "")
    list_sort_heading.innerHTML =
      "The List is Sorted Based on Alphabetical Ordering of Country Names";

  let name = search_ip.value.toLowerCase();

  const data = await getDataFromAPI();
  let count = 0;

  // If Search Arhument satisfies any element, then its shown else we show a warning
  main_container.innerHTML = "";
  list_sort_heading.innerHTML =
    "List Showing Those Countries Whose Name Somewhat or Fully Matches with your Search";

  for (let i = 0; i < data.length; i++) {
    if (data[i].country.toLowerCase().includes(name)) {
      count++;
      let start = data[i].country.toLowerCase().indexOf(name);
      let end = start + name.length;
      add_row_while_ip(
        start,
        end,
        data[i].countryInfo["flag"],
        data[i].country,
        data[i].cases,
        data[i].recovered,
        data[i].deaths
      );
    }
  }

  if (count == 0)
    main_container.innerHTML =
      '<h3 class="not-found">Sorry,No Countries Match Your Search!!!</h3>';
});

// IIFE to start the execution
(() => {
  update_data();
  update_world_data();
  set_heading();
})();
