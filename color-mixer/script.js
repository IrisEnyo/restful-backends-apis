const redSlider = document.querySelector("#red");
const greenSlider = document.querySelector("#green");
const blueSlider = document.querySelector("#blue");
const colorValue = document.querySelector("#color-value");
const button = document.querySelector("button");

function rangeValueToHex(value) {
  value = Number.parseInt(value);
  return ("0" + value.toString(16)).substr(-2);
}

function setBackgroundColor() {
  const red = rangeValueToHex(redSlider.value);
  const green = rangeValueToHex(greenSlider.value);
  const blue = rangeValueToHex(blueSlider.value);

  const color = "#" + red + green + blue;
  document.body.style.backgroundColor = color;
  colorValue.innerText = color;
}
setBackgroundColor();

document.body.addEventListener("input", setBackgroundColor);

button.addEventListener("click", () => {
  fetchApiColor();
});

function fetchApiColor() {
  fetch("https://dummy-apis.netlify.app/api/color")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((color) => {
      redSlider.value = color.rgb.r;
      greenSlider.value = color.rgb.g;
      blueSlider.value = color.rgb.b;
      setBackgroundColor();
    });
}
