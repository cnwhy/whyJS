function rgb2hsb(rgb){
    var rgbarr = [rgb.r,rgb.g,rgb.b];
    rgbarr.sort(function(a,b){return a-b;});
    var max = rgbarr[2];
    var min = rgbarr[0];
    var hsbB = max / 255;
    var hsbS = max == 0 ? 0 : (max -min)/max;
    var hsbH = 0;
    if (max == rgb.r && rgb.g >= rgb.b) {  
        hsbH = (rgb.g - rgb.b) * 60 / (max - min) + 0;  
    } else if (max == rgb.r && rgb.g < rgb.b) {  
        hsbH = (rgb.g - rgb.b) * 60 / (max - min) + 360;  
    } else if (max == rgb.g) {  
        hsbH = (rgb.b - rgb.r) * 60 / (max - min) + 120;  
    } else if (max == rgb.b) {  
        hsbH = (rgb.r - rgb.g) * 60 / (max - min) + 240;  
    }
    isNaN(hsbH) hsbH = 300;
    return {
        h:Math.round(hsbH),
        s:Math.round(hsbS*100),
        b:Math.round(hsbB*100)
    };
}
