let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and display existing toys
  fetch("http://localhost:3000/toys")
    .then((res) => res.json())
    .then((toys) => {
      toys.forEach(renderToyCard);
    });

  // Handle new toy form submission
  document.querySelector(".add-toy-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = {
      name: name,
      image: image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then((res) => res.json())
      .then((toy) => {
        renderToyCard(toy); // Add to DOM
        e.target.reset();    // Clear the form
      });
  });
});

// Render a toy as a card
function renderToyCard(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  const likeBtn = card.querySelector(".like-btn");
  const likesP = card.querySelector("p");

  // Handle like button click
  likeBtn.addEventListener("click", () => {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        toy.likes = updatedToy.likes;
        likesP.textContent = `${updatedToy.likes} Likes`;
      });
  });

  toyCollection.appendChild(card);
}
