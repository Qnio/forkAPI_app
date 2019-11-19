export const elements = {
  searchInput: document.querySelector(".search__field"),
  serchForm: document.querySelector(".search"),
  searchRes: document.querySelector(".results"),
  searchResultList: document.querySelector(".results__list"),
  searchResPages: document.querySelector(".results__pages"), //to mark element to handle buttons for recipies list
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likes: document.querySelector(".likes__list"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list")
};

export const elementString = {
  loader: "loader"
};

//adding loader spining circle before loading the list of the results of query
export const renderLoader = parent => {
  const loader = `
    <div class="${elementString.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

//clearing loader after returning recipe items
export const clearLoader = () => {
  const loader = document.querySelector(`.${elementString.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};
