import Search from "./modules/Search";
import Recipe from "./modules/Recipe";
import List from "./modules/List";
import Likes from "./modules/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/* Global satete of the app
- Search object
- Curent recipie object
-Shoping list object
-Liked recipies
*/

const state = {};
//window.state = state;

/* 
  ---------------------SEARCH CONTROLER---------------------
*/

const controlSearch = async () => {
  // 1) Get the query as a string from searchView
  const query = searchView.getInput(); //it's input for our query selection

  //console.log(query);
  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);
    //console.log(state.search);
    try {
      // 3) Prepare UI for result
      searchView.clearInput();
      searchView.clearResults();
      renderLoader(elements.searchRes);

      // 4) Search for recipies
      await state.search.getResults();

      // 5) render result on UI
      clearLoader();
      searchView.renderResults(state.search.result);
      //console.log(state.search.result);
    } catch (error) {
      console.log(error);
      alert("Error related to contolSearch func");
      clearLoader();
    }
  }
};

elements.serchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

// //TESTING
// window.addEventListener("load", e => {
//   e.preventDefault();
//   controlSearch();
// });

/* ----------------RECIPIES BUTONS TO LIST MANAGE------------------ */
elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});
/* ------END-------RECIPIES BUTONS TO LIST MANAGE---------END------ */

/* 
  ---------------------RECIPE CONTROLER---------------------
*/
const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  //console.log(id);

  if (id) {
    //Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Highlits selected search item
    if (state.search) searchView.highlightSelected(id);

    //Create new Recipe object
    state.recipe = new Recipe(id);

    // //TESTING
    window.r = state.recipe;

    try {
      //Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      //Calculate servings and items
      state.recipe.calcTime();
      state.recipe.calcServings();

      //Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
      //console.log(state.recipe);
    } catch (error) {
      console.log(error);
      alert("Error processing recipe!");
    }
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

/* ----------------LIST CONTROLER------------------ */

const controlList = () => {
  //Creating new list if there is none yet
  if (!state.list) state.list = new List();
  //add each ingredients to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

//Handle delete and update item events
elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  //Handle the delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);

    //Delete from UI
    listView.deleteItem(id);

    //Handle count update
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);

    state.list.updateCount(id, val);
  }
});

/* ----------------LIKE CONTROLER------------------ */

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // case where is no liked recipe by user
  if (!state.likes.isLiked(currentID)) {
    // add like to state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //toggle the like button
    likesView.toggleLikeBtb(true);
    //add like to UI list
    likesView.renderLike(newLike);

    // recipe is liked
  } else {
    // remove like to state
    state.likes.deleteLike(currentID);
    //toggle the like button
    likesView.toggleLikeBtb(false);
    //remove like to UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// restore likes recipeies on page load
window.addEventListener("load", () => {
  state.likes = new Likes();

  //restore likes
  state.likes.readStorage();

  //toggle button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  //render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

//handling recipe buttons click
elements.recipe.addEventListener("click", e => {
  //.btn-decrease * --> any child of the btn-decrease
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});

//window.l = new List();
