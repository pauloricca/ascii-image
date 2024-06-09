
var charMaps = [
    " .,:ilw░▒▓█",
    "  ..-*x##",
    " .;:cdk0XNM",
    " ':░▒▓█",
    "  -┌x░▒▓█",
];

var currentCharMap = 0;
var complex = true;

$(function(){

    $("body").css("overflow", "unset");

    var $container = $('.anim-container');

    var $charMapPicker = $('.chartMapPicker');
    $charMapPicker.change(function(){
        currentCharMap = $(this).val();
        $('.custom-map').val(charMaps[$(this).val()]);
    });
    for(var i = 0; i < charMaps.length; i++)
        $charMapPicker.append('<option ' + ( currentCharMap==i ? 'selected' : '' ) + ' value = "' + i + '">' + charMaps[i] + '</select>');
        
    
    $('.custom-map').val(charMaps[$charMapPicker.val()]);

    var fps = 50;
    var boardWidth = 90;
    var boardRatio = 0.4;
    var boardHeight=Math.floor(boardWidth*boardRatio);
    var sqrtWeight = 0;
    var scale = 30;
    var fontSize = 6;
    var prevFontSize = fontSize;

	$('.font-size').val(fontSize);
	$("body").css("font-size", fontSize+"px");

    var canvas = undefined;
    var multiplier = 1;
    
    $('.font-size').attr("min", 2);
    
    $('.scale').attr("min", 10);
    $('.scale').attr("max", 200);
    $('.scale').attr("step", 1);
    $('.scale').val(90);
    
    $('.speed').attr("min", 0.5);
    $('.speed').attr("max", 3);
    $('.speed').attr("step", 0.01);
    $('.speed').val(1);
    
    $('.sqrtWeight').val(sqrtWeight).on('input', function(){ sqrtWeight = $(this).val()*1; });
    $('.scale').val(scale).on('input', function(){ boardWidth = $(this).val()*1; boardHeight=Math.floor(boardWidth*boardRatio); createCanvasImage(); });
    $('.font-size').on('input', function(){ fontSize = $(this).val(); });
    $('.speed').on('input', function(){ multiplier = $(this).val(); });
    $('.custom-map').on('input', function(){ });

    createCanvas();

    // draw
    function draw()
    {
        var charMap = $('.custom-map').val() ? $('.custom-map').val() : ' ';
	    
        
        var maxValues = charMap.length;
        
        var output = '';

        if(fontSize != prevFontSize)
        {
            $("body").css("font-size", fontSize+"px");
            prevFontSize = fontSize;
        }

        var pixelData = canvas.getContext('2d').getImageData(0, 0, boardWidth, boardHeight).data;
        

        for (var y = 0; y < boardHeight; y++) 
        {
            for (var x = 0; x < boardWidth; x++)
            {
	            var pixelPos = (x+(y*boardWidth))*4;
	            var pixel = 1 - multiplier * ( ( pixelData[pixelPos] + pixelData[pixelPos+1] + pixelData[pixelPos+2] ) / ( 3 * 255 ) );
	            
	            if(sqrtWeight>0) pixel = Math.sqrt(pixel) * sqrtWeight + pixel * (1-sqrtWeight);
	            
                var charIndex = Math.abs(Math.floor( pixel * maxValues ));

                if( charIndex < 0 || charIndex == undefined ) charIndex = 0;
                if( charIndex >= maxValues ) charIndex = maxValues-1;

                output += charMap[charIndex] ? charMap[charIndex] : charMap[0] ;
            }
            output += "\n";
        }

        $container.text(output);


    }

    function createCanvas()
    {
        canvas = document.createElement('canvas');
        $('body').append(canvas);
        var ctx = canvas.getContext('2d');
        
        const constraints = {video: true, audio: false};
		
		const video = document.querySelector('video');
		
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {video.srcObject = stream});
        
       setInterval(function(){
           ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0,0, boardWidth, boardHeight);
            draw();
       }, 1000/25);
    }

})