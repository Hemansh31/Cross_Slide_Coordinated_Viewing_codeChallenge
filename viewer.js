const fileDetails = [
    {
        path : "test_dzi/original_files/",
        format : "jpeg",
        overlap : "1",
        tileSize : "254",
        height : "2815",
        width : "2047"
    },
    {
        path : "test_dzi/rotate_files/",
        format : "jpeg",
        overlap : "1",
        tileSize : "254",
        height : "2047",
        width : "2815"
    }, 
    {
        path : "test_dzi/cropped_files/",
        format : "jpeg",
        overlap : "1",
        tileSize : "254",
        height : "1694",
        width : "1865"
    }, 
    {
        path : "test_dzi/croppedAndRotated_files/",
        format : "jpeg",
        overlap : "1",
        tileSize : "254",
        height : "1690",
        width : "1738"
    }
]

const $CROSSVIEW = {};

function initialize(){
    var url = window.location.href || document.URL;
    address = url.split('?');
    address = address[address.length - 1];
    address = address == url ?  '0,1' : address;
    address = address.split(',');
    address = address.length != 2 ? ["0", "1"] : address;
    address[0] = isNaN(parseInt(address[0])) || parseInt(address[0]) > 3 ? 0 : parseInt(address[0]);
    address[1] = isNaN(parseInt(address[1])) || parseInt(address[1]) > 3 ? 1 : parseInt(address[1]);
    console.log(address);
    return address;
}

function loadSlides(){
    const indexes = initialize();

    $CROSSVIEW.viewerOne = OpenSeadragon({
        id: "openseadragonOne",
        prefixUrl: "openseadragon/images/",
        tileSources: {
            Image: {
                xmlns:    "http://schemas.microsoft.com/deepzoom/2009",
                Url:      fileDetails[indexes[0]].path,
                Format:   fileDetails[indexes[0]].format, 
                Overlap:  fileDetails[indexes[0]].overlap, 
                TileSize: fileDetails[indexes[0]].tileSize,
                Size: {
                    Height: fileDetails[indexes[0]].height,
                    Width: fileDetails[indexes[0]].width
                }
            }
        },
        autoHideControls:false
    });

    $CROSSVIEW.viewerTwo = OpenSeadragon({
        id: "openseadragonTwo",
        prefixUrl: "openseadragon/images/",
        tileSources: {
            Image: {
                xmlns:    "http://schemas.microsoft.com/deepzoom/2009",
                Url:      fileDetails[indexes[1]].path,
                Format:   fileDetails[indexes[1]].format, 
                Overlap:  fileDetails[indexes[1]].overlap, 
                TileSize: fileDetails[indexes[1]].tileSize,
                Size: {
                    Height: fileDetails[indexes[1]].height,
                    Width: fileDetails[indexes[1]].width
                }
            }
        },
        autoHideControls:false
    });
    
    $CROSSVIEW.dependence = false;
    $CROSSVIEW.referencePoints = {
        pointOne : null,
        pointTwo : null
    };
    $CROSSVIEW.scaleOne = {
        x : null,
        y : null
    };
    $CROSSVIEW.scaleTwo = {
        x : null,
        y : null
    };
    $CROSSVIEW.lead = {
        vOne : true,
        vTwo : true
    };
    $CROSSVIEW.referenceZoom = {
        vOne : null,
        vTwo : null
    }
    $CROSSVIEW.theta = null;
}

loadSlides();

var sliderOne = document.getElementById("myRange1");
var sliderTwo = document.getElementById("myRange2");
sliderOne.oninput = function(){
    $CROSSVIEW.viewerOne.viewport.setRotation(sliderOne.value);
    if($CROSSVIEW.dependence){
        var angle = (parseInt(sliderOne.value) + $CROSSVIEW.theta + 360) % 360
        sliderTwo.value = angle.toString();
        $CROSSVIEW.viewerTwo.viewport.setRotation(sliderTwo.value);
    }
}
sliderTwo.oninput = function(){
    $CROSSVIEW.viewerTwo.viewport.setRotation(sliderTwo.value);
    if($CROSSVIEW.dependence){
        var angle = (parseInt(sliderTwo.value) - $CROSSVIEW.theta + 360) % 360
        sliderOne.value = angle.toString();
        $CROSSVIEW.viewerOne.viewport.setRotation(sliderOne.value);
    }
}

console.log($CROSSVIEW);

function dependence(toggle){
    if(toggle == '0'){
        $CROSSVIEW.dependence = false;
        $CROSSVIEW.referencePoints = {
            pointOne : null,
            pointTwo : null
        };
        $CROSSVIEW.scaleOne = {
            x : null,
            y : null
        };
        $CROSSVIEW.scaleTwo = {
            x : null,
            y : null
        }
        $CROSSVIEW.referenceZoom = {
            vOne : null,
            vTwo : null
        }
        $CROSSVIEW.theta = null;
    } else{
        $CROSSVIEW.dependence = true;
        var pOne = $CROSSVIEW.viewerOne.viewport.getCenter();
        var pTwo = $CROSSVIEW.viewerTwo.viewport.getCenter();
        var boundOne = $CROSSVIEW.viewerOne.viewport.viewportToImageRectangle($CROSSVIEW.viewerOne.viewport.getBounds());
        var boundTwo = $CROSSVIEW.viewerTwo.viewport.viewportToImageRectangle($CROSSVIEW.viewerTwo.viewport.getBounds());
        $CROSSVIEW.referencePoints.pointOne = $CROSSVIEW.viewerOne.viewport.viewportToImageCoordinates(pOne);
        $CROSSVIEW.referencePoints.pointTwo = $CROSSVIEW.viewerTwo.viewport.viewportToImageCoordinates(pTwo);
        $CROSSVIEW.scaleOne = {
            x : boundOne.width,
            y : boundOne.height
        };
        $CROSSVIEW.scaleTwo = {
            x : boundTwo.width,
            y : boundTwo.height
        }
        $CROSSVIEW.referenceZoom = {
            vOne : $CROSSVIEW.viewerOne.viewport.getZoom(),
            vTwo : $CROSSVIEW.viewerTwo.viewport.getZoom()
        }
        var angleOne = parseInt(document.getElementById("myRange1").value);
        var angleTwo = parseInt(document.getElementById("myRange2").value);
        $CROSSVIEW.theta = angleTwo - angleOne;
    }
}

$CROSSVIEW.viewerOne.addHandler('pan', function (event){
    if($CROSSVIEW.dependence && $CROSSVIEW.lead.vOne){
        var currCenter = $CROSSVIEW.viewerOne.viewport.viewportToImageCoordinates($CROSSVIEW.viewerOne.viewport.getCenter());
        var unscaledDelta = {
            dx : currCenter.x - $CROSSVIEW.referencePoints.pointOne.x,
            dy : currCenter.y - $CROSSVIEW.referencePoints.pointOne.y
        };
        var scaledDelta = {
            dx : (unscaledDelta.dx / $CROSSVIEW.scaleOne.x ),
            dy : (unscaledDelta.dy / $CROSSVIEW.scaleOne.y )
        };
        var transformDelta = {};

        transformDelta.dx = (scaledDelta.dx * Math.cos( (Math.PI / 180) * $CROSSVIEW.theta ) ) + (scaledDelta.dy * Math.sin( (Math.PI / 180) * $CROSSVIEW.theta ) );
        transformDelta.dy = (scaledDelta.dy * Math.cos( (Math.PI / 180) * $CROSSVIEW.theta ) ) - (scaledDelta.dx * Math.sin( (Math.PI / 180) * $CROSSVIEW.theta ) );;

        var scaledTransformDelta = {
            dx : transformDelta.dx * $CROSSVIEW.scaleTwo.x,
            dy : transformDelta.dy * $CROSSVIEW.scaleTwo.y
        }
        var newImageCenter = {
            x : $CROSSVIEW.referencePoints.pointTwo.x + scaledTransformDelta.dx,
            y : $CROSSVIEW.referencePoints.pointTwo.y + scaledTransformDelta.dy
        };
        newImageCenter = $CROSSVIEW.viewerTwo.viewport.imageToViewportCoordinates(newImageCenter.x, newImageCenter.y);
        $CROSSVIEW.lead.vTwo = false;
        $CROSSVIEW.viewerTwo.viewport.panTo(newImageCenter);
        $CROSSVIEW.lead.vTwo = true;
    }
});

$CROSSVIEW.viewerTwo.addHandler('pan', function (event){
    if($CROSSVIEW.dependence && $CROSSVIEW.lead.vTwo){
        var currCenter = $CROSSVIEW.viewerTwo.viewport.viewportToImageCoordinates($CROSSVIEW.viewerTwo.viewport.getCenter());
        var unscaledDelta = {
            dx : currCenter.x - $CROSSVIEW.referencePoints.pointTwo.x,
            dy : currCenter.y - $CROSSVIEW.referencePoints.pointTwo.y
        };
        var scaledDelta = {
            dx : (unscaledDelta.dx / $CROSSVIEW.scaleTwo.x ),
            dy : (unscaledDelta.dy / $CROSSVIEW.scaleTwo.y )
        };

        var transformDelta = {};

        transformDelta.dx = (scaledDelta.dx * Math.cos( (Math.PI / 180) * $CROSSVIEW.theta ) ) - (scaledDelta.dy * Math.sin( (Math.PI / 180) * $CROSSVIEW.theta ) );
        transformDelta.dy = (scaledDelta.dy * Math.cos( (Math.PI / 180) * $CROSSVIEW.theta ) ) + (scaledDelta.dx * Math.sin( (Math.PI / 180) * $CROSSVIEW.theta ) );;

        var scaledTransformDelta = {
            dx : transformDelta.dx * $CROSSVIEW.scaleOne.x,
            dy : transformDelta.dy * $CROSSVIEW.scaleOne.y
        }

        var newImageCenter = {
            x : $CROSSVIEW.referencePoints.pointOne.x + scaledTransformDelta.dx,
            y : $CROSSVIEW.referencePoints.pointOne.y + scaledTransformDelta.dy
        }
        newImageCenter = $CROSSVIEW.viewerOne.viewport.imageToViewportCoordinates(newImageCenter.x, newImageCenter.y);
        $CROSSVIEW.lead.vOne = false;
        $CROSSVIEW.viewerOne.viewport.panTo(newImageCenter);
        $CROSSVIEW.lead.vOne = true;
    }
});

$CROSSVIEW.viewerOne.addHandler('zoom', function (event){
    if($CROSSVIEW.dependence && $CROSSVIEW.lead.vOne){
        var zoomLevel = ($CROSSVIEW.viewerOne.viewport.getZoom()) * ($CROSSVIEW.referenceZoom.vTwo / $CROSSVIEW.referenceZoom.vOne);
        zoomLevel = zoomLevel > $CROSSVIEW.viewerTwo.viewport.getMaxZoom() ? $CROSSVIEW.viewerTwo.viewport.getMaxZoom() : zoomLevel;
        zoomLevel = zoomLevel < $CROSSVIEW.viewerTwo.viewport.getMinZoom() ? $CROSSVIEW.viewerTwo.viewport.getMinZoom() : zoomLevel;
        $CROSSVIEW.lead.vTwo = false;
        $CROSSVIEW.viewerTwo.viewport.zoomTo(zoomLevel);
        $CROSSVIEW.lead.vTwo = true;
        var boundOne = $CROSSVIEW.viewerOne.viewport.viewportToImageRectangle($CROSSVIEW.viewerOne.viewport.getBounds());
        var boundTwo = $CROSSVIEW.viewerTwo.viewport.viewportToImageRectangle($CROSSVIEW.viewerTwo.viewport.getBounds());
        $CROSSVIEW.scaleOne = {
            x : boundOne.width,
            y : boundOne.height
        };
        $CROSSVIEW.scaleTwo = {
            x : boundTwo.width,
            y : boundTwo.height
        }
        $CROSSVIEW.viewerOne.viewport.panTo($CROSSVIEW.viewerOne.viewport.getCenter());
    }
});

$CROSSVIEW.viewerTwo.addHandler('zoom', function (event){
    if($CROSSVIEW.dependence && $CROSSVIEW.lead.vTwo){
        var zoomLevel = ($CROSSVIEW.viewerTwo.viewport.getZoom()) * ($CROSSVIEW.referenceZoom.vOne / $CROSSVIEW.referenceZoom.vTwo);
        zoomLevel = zoomLevel > $CROSSVIEW.viewerOne.viewport.getMaxZoom() ? $CROSSVIEW.viewerOne.viewport.getMaxZoom() : zoomLevel;
        zoomLevel = zoomLevel < $CROSSVIEW.viewerOne.viewport.getMinZoom() ? $CROSSVIEW.viewerOne.viewport.getMinZoom() : zoomLevel;
        $CROSSVIEW.lead.vOne = false;
        $CROSSVIEW.viewerOne.viewport.zoomTo(zoomLevel);
        $CROSSVIEW.lead.vOne = true;
        var boundOne = $CROSSVIEW.viewerOne.viewport.viewportToImageRectangle($CROSSVIEW.viewerOne.viewport.getBounds());
        var boundTwo = $CROSSVIEW.viewerTwo.viewport.viewportToImageRectangle($CROSSVIEW.viewerTwo.viewport.getBounds());
        $CROSSVIEW.scaleOne = {
            x : boundOne.width,
            y : boundOne.height
        };
        $CROSSVIEW.scaleTwo = {
            x : boundTwo.width,
            y : boundTwo.height
        }
        $CROSSVIEW.viewerTwo.viewport.panTo($CROSSVIEW.viewerTwo.viewport.getCenter());
    }
});

function goToHome(){
    window.open('home.html', '_self');
}