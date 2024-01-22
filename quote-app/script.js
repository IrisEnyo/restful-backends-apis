const button = document.querySelector("button");
const quoteList = document.querySelector("main");

// Load state from local storage
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Add a default quote to the app state
if (quotes.length === 0) {
  quotes.push({
    quote:
      "The question isn't who is going to let me; it's who is going to stop me.",
    author: "Ayn Rand",
  });
}
quoteList.append(quotes[0].quote, " - " + quotes[0].author);

// Add button with eventhandler to get quotes by click
button.addEventListener("click", getQuote);

// Function to get/fetch and render/display the quote from the API
function getQuote() {
  quoteList.innerHTML = "";

  fetch("https://dummy-apis.netlify.app/api/quote")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      const quote = document.createElement("p");
      quote.setAttribute("class", "quote");
      quote.append(document.createTextNode(data.quote));

      const author = document.createElement("p");
      author.setAttribute("class", "author");
      author.append(document.createTextNode("- " + data.author));

      quoteList.append(quote, author);
    });
}
