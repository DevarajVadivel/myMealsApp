let categoriesMealsArray = [];
let MealsListArray = [];

const fetchMealsCategory = async function () {
  try {
    await fetch("https://www.themealdb.com/api/json/v1/1/categories.php", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        data.categories.map((datas) => {
          categoriesMealsArray.push(
            datas.strCategory.toString().toLocaleLowerCase()
          );
        });
      });
  } catch (error) {
    console.log("fetchMealsCategory api catch error", error);
  }
};

//To get meals category list, This function is called initally once webpage loaded.
fetchMealsCategory();

// --------------------------------------------------------------//

//To get meal list of particular category which user searched for!
const fetchMeals = async function (mealCategory) {
  try {
    await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealCategory}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        MealsListArray = [];
        data.meals.forEach((meal) => {
          meal.selected = false;
          MealsListArray.push(meal);
        });

        showMealsList();
      });
  } catch (error) {
    console.log("fetchMeals api catch error", error);
  }
};

let list = "";
function showMealsList() {
  list = "";
  console.log("list is empty", list);
  let localStoargeItems = JSON.parse(localStorage.getItem("favItemList"));
  // console.log("MealsListArraydd",MealsListArray);
  MealsListArray.forEach((data) => {
    localStoargeItems.forEach((lsdata) => {
      if (data.idMeal == lsdata.idMeal) {
        data.selected = true;
      }
    });
  });

  updateMealsList();
}

let searchInput = document.getElementsByClassName("searchInput");
let suggestionBox = document.getElementsByClassName("suggestionBox");
let listArray = [];
let searchInputValue;

// Based on the user input, We filter the category from mealcategory list array and list it as search results.
for (let i = 0; i < searchInput.length; i++) {
  searchInput[i].addEventListener("input", function () {
    suggestionBox[i].innerHTML = "";
    categoriesMealsArray.forEach((data) => {
      if (
        searchInput[i].value.toLocaleLowerCase() != "" &&
        data.includes(searchInput[i].value.toLocaleLowerCase())
      ) {
        let list = document.createElement("li");
        list.innerText = data;

        list.addEventListener("click", function (e) {
          searchInput[i].value = e.currentTarget.innerText;
          searchInputValue = e.currentTarget.innerText;
          suggestionBox[i].innerHTML = "";
        });

        suggestionBox[i].appendChild(list);
      }
    });
  });
}

let buttonSearch = document.getElementsByClassName("buttonSearch");
let homepage = document.getElementsByClassName("home-page")[0];
let homePageContent = document.getElementsByClassName("home-page-content")[0];

let homeLink = document.getElementsByClassName("home")[0];
let searchPage = document.getElementsByClassName("search")[0];
let flag = false;

for (let j = 0; j < buttonSearch.length; j++) {
  buttonSearch[j].addEventListener("click", function () {
    if (searchInput.value != "") {
      // also check whether search value has match with category!
      homepage.classList.remove("hide");
      homepage.classList.add("show");

      searchPage.classList.remove("show");
      searchPage.classList.add("hide");

      searchInput[j].value = "";
      fetchMeals(searchInputValue);

      //set the flag true, so that by clicking home, navigates to home
      flag = true;
    }
  });
}

//whenever we remove a meal from favourite list, we will update the same in Home Page.
//Also, we'll use this function to show  meals list in home page for initial loading as well to make sure favourite meals
//are in red colour in fav icon.
function updateMealsList() {
  list = "";

  MealsListArray.forEach((data) => {
    if (data.selected == true) {
      list += `<div class="card" >
             <img src=${data.strMealThumb} class="cardImage" onclick="meal(${
        data.idMeal
      })">
            <div class="cardDetails">
          <h3 class="mealName" onclick="meal(${data.idMeal})">${
        data.strMeal
      }</h3>
            <i class="fa-solid fa-heart" style="color:red;" onclick='addToFav(this,${JSON.stringify(
              data.idMeal
            )})'></i>
            </div>
 
          </div>`;
      homePageContent.innerHTML = list;
    } else {
      list += `<div class="card" >
      <img src=${data.strMealThumb} class="cardImage" onclick="meal(${
        data.idMeal
      })">
      <div class="cardDetails">
        <h3 class="mealName" onclick="meal(${data.idMeal})">${data.strMeal}</h3>
        <i class="fa-solid fa-heart" style="color:grey;" onclick='addToFav(this,${JSON.stringify(
          data.idMeal
        )})'></i>
      </div>
     
    </div>`;

      homePageContent.innerHTML = list;
    }
  });
}

// ================================================//

// This function brings the details of user selected meal
async function meal(mealId) {
  console.log("mealId", mealId);
  // alert("meal id",mealId);
  try {
    await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        showMeal(data);
      });
  } catch (error) {
    console.log("fetchMeals api catch error", error);
  }
}

let mealsDetailsPage = document.getElementsByClassName("meal-detail-page")[0];
let modal = document.getElementsByClassName("modal")[0];
let list1;

// This function displays the results of meal function like a modal.
function showMeal(mealDetails) {
  mealsDetailsPage.classList.remove("hide");
  mealsDetailsPage.classList.add("show");
  console.log("meal id", mealDetails.meals[0].idMeal);
  list1 = "";

  list1 = `<div class="mealCard">
        <img src=${mealDetails.meals[0].strMealThumb} class="mealImage">
        <div class="mealDetails">
          <div class="mealNameAndFavWrapper">
            <h3 class="mealName">${mealDetails.meals[0].strMeal}</h3>
            <div class="linksAndFav">

            <a href=${mealDetails.meals[0].strYoutube}><i class="fa-brands fa-youtube"></i></a>
            </div>
            
          </div>
          <div class="mealCategoryAndAreaWrapper">
            <h4 class="mealCategory">Catogery : ${mealDetails.meals[0].strCategory}</h4>
            <h4 class="mealRegion">Meal region : ${mealDetails.meals[0].strArea}</h4>
          </div>
          <div class="mealInstructions">
              <p>Instruction : ${mealDetails.meals[0].strInstructions}</p>
          </div>
         
        </div>
       
      </div>`;

  modal.innerHTML = list1;
}

let closeIcon = document.getElementsByClassName("fa-xmark")[0];

//this event close the modal when click event is triggered.
closeIcon.addEventListener("click", function () {
  mealsDetailsPage.classList.remove("show");
  mealsDetailsPage.classList.add("hide");
});

// ===================================//

let favourites = [];
let heartButton = document.getElementsByClassName("fa-heart");
let checkDuplicate = false;

function addToFav(currentIcon, mealId) {
  //After refreshing, Updating the favourites array to have sync with local storage.
  favourites = JSON.parse(localStorage.getItem("favItemList"));
  let meal;
  MealsListArray.forEach((meals) => {
    if (meals.idMeal == mealId) {
      meals.selected = true;
      meal = meals;
      console.log("check condtion in adding meals");
    }
  });

  if (favourites == null) {
    favourites = [];
  }

  favourites.forEach((favItem) => {
    if (favItem.idMeal == mealId) {
      removeFromFav(mealId);
      checkDuplicate = true;
      console.log("=== duplicate found ===");
      return;
    }
  });

  console.log("checkDuplicate state ", !checkDuplicate);
  if (!checkDuplicate) {
    console.log("=== fav added ===");

    favourites.push(meal);
    localStorage.setItem("favItemList", JSON.stringify(favourites));
    currentIcon.style.color = "red";
  } else {
    currentIcon.style.color = "grey";
    checkDuplicate = false;
    console.log("=== fav not  added ===");
  }
}

function removeFromFav(mealID) {
  favourites = favourites.filter((meals) => meals.idMeal != mealID);
  localStorage.setItem("favItemList", JSON.stringify(favourites));

  MealsListArray.forEach((meals) => {
    if (meals.idMeal == mealID) {
      meals.selected = false;
      console.log("check condtion in removing meals");
    }
  });

  listFavs();
  // updateMealsList(mealID);
}

let localStorageFavList;
// This function lists the favourite meals in Favourite page
function listFavs() {
  list2 = "";
  favouritePageContent.innerHTML = "";
  localStorageFavList = JSON.parse(localStorage.getItem("favItemList"));

  if (localStorageFavList.length > 0) {
    localStorageFavList.forEach((data) => {
      list2 += `<div class="card">
      <img src=${data.strMealThumb} class="cardImage" onclick="meal(${data.idMeal})">
      <div class="cardDetails">
        <h3 class="mealName" onclick="meal(${data.idMeal})">${data.strMeal}</h3>
        <i class="fa-solid fa-heart" style="color:red" onclick="removeFromFav(${data.idMeal})"></i>
      </div>
     
    </div>`;
    });

    favouritePageContent.innerHTML = list2;
  } else {
    favouritePageContent.style.marginTop = "0px";
    favouritePageContent.innerHTML = `
    <div class="emptyFav">
    <img src="./assets/fav.png" height="50%" width="40%" >
    <h1> Uh-oh! It seems your favorites are on vacation. Time to bring them back with a bang!</h1>
    </div>
    `;
  }
}

let favouritePage = document.getElementsByClassName("favourite-meals-page")[0];
let favouritePageContent = document.getElementsByClassName(
  "favourite-page-content"
)[0];

let favouritesButton = document.getElementsByClassName("favourites");
let modal1 = document.getElementsByClassName("modal1")[0];

let list2 = "";
for (let index = 0; index < favouritesButton.length; index++) {
  favouritesButton[index].addEventListener("click", function () {
    favouritePage.classList.remove("hide");
    favouritePage.classList.add("show");

    homepage.classList.remove("show");
    homepage.classList.add("hide");

    searchPage.classList.remove("show");
    searchPage.classList.add("hide");

    //After refreshing, Updating the favourites array to have sync with local storage.
    favourites = JSON.parse(localStorage.getItem("favItemList"));

    console.log("favourites from local storage =>", favourites);

    if (favourites && favourites.length > 0) {
      listFavs();
    } else {
      favouritePageContent.style.marginTop = "0px";
      favouritePageContent.innerHTML = `
    <div class="emptyFav">
    <img src="./assets/fav.png" height="50%" width="40%" >
    <h1> Uh-oh! It seems your favorites are on vacation. Time to bring them back with a bang!</h1>
    </div>
    `;
    }
  });
}

// ========================//

let home = document.getElementsByClassName("home");

for (let index = 0; index < home.length; index++) {
  home[index].addEventListener("click", function () {
    if (flag) {
      favouritePage.classList.remove("show");
      favouritePage.classList.add("hide");

      homepage.classList.remove("hide");
      homepage.classList.add("show");
      updateMealsList();
    } else {
      favouritePage.classList.remove("show");
      favouritePage.classList.add("hide");

      searchPage.classList.remove("hide");
      searchPage.classList.add("show");
    }
  });
}

let homeScreen = document.getElementsByClassName("homeScreen");

for (let index = 0; index < homeScreen.length; index++) {
  homeScreen[index].addEventListener("click", navigateToHome);
}

function navigateToHome() {
  location.reload();
}
