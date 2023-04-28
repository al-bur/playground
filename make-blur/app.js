const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const download = document.getElementById("download");
const blurSlider = document.getElementById("blur-slider");
const sliderValue = document.getElementById("slider-value");
let img;

function applyBlur() {
  const blurAmount = blurSlider.value;
  sliderValue.textContent = blurAmount;

  if (img) {
    ctx.filter = `blur(${blurAmount / 10}px)`;
    ctx.drawImage(img, 0, 0, img.width, img.height);
  }
}

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    img = new Image();
    img.src = event.target.result;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      applyBlur();
    };
  };

  reader.readAsDataURL(file);
});

download.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "blurred-image.png";
  link.href = canvas.toDataURL();
  link.click();
});

blurSlider.addEventListener("input", applyBlur);

const blurButtonGroup = document.querySelector("#blur-button-group");

blurButtonGroup.addEventListener("click", (e) => {
  const blurAmount = e.target.getAttribute("data-blur");
  blurSlider.value = blurAmount;
  applyBlur();
});
