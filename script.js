var charMaps = [
    " .,:ilw░▒▓█",
    " .,:ilwW",
    " ^*GS#",
    " .;:codkO0KXNWM",
    " .oO",
  " ':░▒▓█",
  "  -┌x░▒▓█",
];

var currentCharMap = 0;
var complex = true;

$(function () {
  $("body").css("overflow", "unset");

  var $container = $(".render-container");

  var $charMapPicker = $(".chartMapPicker");
  $charMapPicker.change(function () {
    currentCharMap = $(this).val();
    $(".custom-map").val(charMaps[$(this).val()]);
    draw();
  });
  for (var i = 0; i < charMaps.length; i++)
    $charMapPicker.append(
      "<option " +
        (currentCharMap == i ? "selected" : "") +
        ' value = "' +
        i +
        '">' +
        charMaps[i] +
        "</select>"
    );

  $(".custom-map").val(charMaps[$charMapPicker.val()]);

  var initialHeight = 100;
  // Because letters are taller than wider, we want the pixel ratio in the canvas to reflect that proportion
  var pixelRatio = 1.654;
  var canvasHeight = initialHeight;
  var canvasWidth = 1;
  var contrast = 1.3;
  var blackPoint = 1.3;
  var initialFontSize = 6;
  var fontSize = initialFontSize;
  var prevFontSize = fontSize;

  var canvas = undefined;
  $container.css("font-size", fontSize + "px");
  $container.css("line-height", fontSize + "px");

  $(".black-point").val(blackPoint);
  $(".contrast").val(contrast);
  $(".scale").val(initialHeight);

  $(".black-point").on("input", function () {
    blackPoint = $(this).val() * 1;
    draw();
  });
  $(".scale").on("input", function () {
    canvasHeight = $(this).val() * 1;
    fontSize = (100 * initialFontSize) / $(this).val() * 1;
    imageLoaded();
  });
  $(".contrast").on("input", function () {
    contrast = $(this).val() * 1;
    draw();
  });
  $(".custom-map").on("input", function () {
    draw();
  });

  function imageLoaded() {
    canvasWidth = Math.round(
      (pixelRatio * canvasHeight * $("img")[0].clientWidth) /
        $("img")[0].clientHeight
    );
    createCanvasImage();
    draw();
  }

  if ($("img")[0].clientWidth) imageLoaded();

  $("img").load(function () {
    imageLoaded();
  });

  const fileInput = $(".file");
  fileInput.on("change", handleFileInput);
  function handleFileInput() {
    handleFile(this.files[0]);
  }

  document.addEventListener("dragenter", dragenter, false);
  document.addEventListener("dragover", dragover, false);
  document.addEventListener("drop", drop, false);

  function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const file = dt.files[0];

    handleFile(file);
  }

  function handleFile(file) {
    if (file) {
      console.log(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        $("img").attr('src', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // draw
  function draw() {
    var charMap = $(".custom-map").val() ? $(".custom-map").val() : " ";

    var maxValues = charMap.length;

    var output = "";

    if (fontSize != prevFontSize) {
      $container.css("font-size", fontSize + "px");
      $container.css("line-height", fontSize + "px");
      prevFontSize = fontSize;
    }

    var pixelData = canvas
      .getContext("2d")
      .getImageData(0, 0, canvasWidth, canvasHeight).data;

    for (var y = 0; y < canvasHeight; y++) {
      for (var x = 0; x < canvasWidth; x++) {
        var pixelPos = (x + y * canvasWidth) * 4;
        var pixel =
          1 -
          contrast *
            ((pixelData[pixelPos] +
              pixelData[pixelPos + 1] +
              pixelData[pixelPos + 2]) /
              (3 * 255));

        if (blackPoint > 0)
          pixel = Math.sqrt(pixel) * blackPoint + pixel * (1 - blackPoint);

        var charIndex = Math.abs(Math.floor(pixel * maxValues));

        if (charIndex < 0 || charIndex == undefined) charIndex = 0;
        if (charIndex >= maxValues) charIndex = maxValues - 1;

        output += charMap[charIndex] ? charMap[charIndex] : charMap[0];
      }
      output += "\n";
    }

    $container.text(output);
  }

  function createCanvasImage() {
    $("canvas").remove();
    var $img = $("#ref-image");
    canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.getContext("2d").drawImage($img[0], 0, 0, canvasWidth, canvasHeight);
    $("body").append(canvas);
  }
});
