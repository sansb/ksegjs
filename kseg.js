//global setup
var planeCanvas;
var drawingContext;
var planeSize = 1000;

var twoPi = Math.PI * 2;
var pointSize = 15;

var pointArray = [];
var selectedPoints = 0;

//icon setup
var iconSize = 50;
	//delete
	var deletePosX = 0;
	var deletePosY = 0;
	var deleteIcon = new Image();
	deleteIcon.src = 'delete.gif';
	var deleteXIcon = new Image();
	deleteXIcon.src = 'deleteX.gif';
	
	//drawLine
	var drawLinePosX = 50;
	var drawLinePosY = 0;
	var drawLineIcon = new Image();
	drawLineIcon.src = 'drawLine.gif';
	var drawLineXIcon = new Image();
	drawLineXIcon.src = 'drawLineX.gif';
	
	//midpoint
	var midpointPosX = 100;
	var midpointPosY = 0;
	var midpointIcon = new Image();
	midpointIcon.src = 'midpoint.gif';
	var midpointXIcon = new Image();
	midpointXIcon.src = 'midpointX.gif';

	//perpLine
	var perpLinePosX = 150;
	var perpLinePosY = 0;
	var perpLineIcon = new Image();
	perpLineIcon.src = 'perpLine.gif';
	var perpLineXIcon = new Image();
	perpLineXIcon.src = 'perpLineX.gif';
	
function updateDisplay(){
	//draw points
	var pointIter = 0;
	for(pointIter = 0; pointIter < pointArray.length; pointIter += 1){
		var x = pointArray[pointIter].x;
		var y = pointArray[pointIter].y;
		if(pointArray[pointIter].selected == 1 && pointArray[pointIter].deleted != 1){
			drawingContext.fillStyle = "rgb(200, 0, 0)";
			drawingContext.beginPath();
			drawingContext.arc(x, y, pointSize, 0, twoPi, true);
			drawingContext.fill();
			drawingContext.fillStyle = "rgb(0, 0, 0)";
			drawingContext.closePath();
		}
		else if(pointArray[pointIter].deleted == 1){
			drawingContext.fillStyle = "rgb(255, 255, 255)";
			drawingContext.strokeStyle = "rgb(255, 255, 255)";
			drawingContext.beginPath();
			drawingContext.arc(x, y, pointSize, 0, twoPi, true);
			drawingContext.fill();
			drawingContext.stroke();
			drawingContext.fillStyle = "rgb(0, 0, 0)";
			drawingContext.strokeStyle = "rgb(0, 0, 0)";
			drawingContext.closePath();
		}
		else{
			drawingContext.beginPath();
			drawingContext.arc(x, y, pointSize, 0, twoPi, true);
			drawingContext.fill();
			drawingContext.closePath();
		}
	}
		
	//draw icons
	if(selectedPoints > 0){
		drawingContext.drawImage(deleteIcon, deletePosX, deletePosY);
		if(selectedPoints >= 2){
			drawingContext.drawImage(drawLineIcon, drawLinePosX, drawLinePosY);
		}
		else{
			drawingContext.drawImage(drawLineXIcon, drawLinePosX, drawLinePosY);
		}
	}
	else{
		drawingContext.drawImage(deleteXIcon, deletePosX, deletePosY);
		drawingContext.drawImage(drawLineXIcon, drawLinePosX, drawLinePosY);
	}
	
}
	
function getCursorPosition(e){
	var posArray = [];
	posArray.x = 0;
	posArray.y = 0;
	if(e.pageX !== undefined && e.pageY !== undefined){
		posArray.x = e.pageX;
		posArray.y = e.pageY;
	}
	else{
		alert("Bad dog");
	}
	posArray.x -= planeCanvas.offsetLeft;
	posArray.y -= planeCanvas.offsetTop;
	return posArray;
}

function flipPointState(index){
	var x = pointArray[index].x;
	var y = pointArray[index].y;
	if(pointArray[index].selected === 0){
		pointArray[index].selected = 1;
		selectedPoints += 1;
	}
	else if(pointArray[index].selected == 1){
		pointArray[index].selected = 0;
		selectedPoints -= 1;
	}
}

function pointExists(posArray){
	var newX = posArray.x;
	var newY = posArray.y;
	var oldPoint = [];
	oldPoint.x = 0;
	oldPoint.y = 0;
	var pointIter = 0;
	for(pointIter=0;pointIter<pointArray.length;pointIter+=1){
		if(Math.abs(pointArray[pointIter].x - newX) < pointSize 
		&& Math.abs(pointArray[pointIter].y - newY) < pointSize){
			flipPointState(pointIter);					
			return true;
		}
	}
	return false;
}

function drawLine(){
	drawingContext.beginPath();
	//get the selected points
	var pointIter = 0;
	var foundFirst = 0;
	var firstX;
	var firstY;
	for(pointIter = 0; pointIter < pointArray.length; pointIter += 1){
		if(pointArray[pointIter].selected === 1){
			if(foundFirst === 0){
				drawingContext.moveTo(pointArray[pointIter].x, pointArray[pointIter].y);
				foundFirst = 1;
				firstX = pointArray[pointIter].x;
				firstY = pointArray[pointIter].y;
				flipPointState(pointIter);
			}
			else{
				drawingContext.lineTo(pointArray[pointIter].x, pointArray[pointIter].y);
				drawingContext.closePath();
				flipPointState(pointIter);
				drawingContext.stroke();
				drawingContext.moveTo(pointArray[pointIter].x, pointArray[pointIter].y);
			}
		}
	}
	drawingContext.lineTo(firstX, firstY);
	drawingContext.stroke();
	drawingContext.closePath();
}

function deleteSelected(){
	var pointIter = 0;
	var pointArrayLen = pointArray.length;
	while(pointIter < pointArrayLen){
		if(pointArray[pointIter].selected === 1){
			pointArray[pointIter].deleted = 1;
			pointArray[pointIter].selected = 0;
			selectedPoints -= 1;
		}
		pointIter += 1;
	}

}

function planeClick(e){
	var posArray = getCursorPosition(e);
	if(posArray.y <= iconSize){
		var iconNum = posArray.x / 50;
		if(iconNum < 1){
			deleteSelected();
		}
		else if(iconNum >= 1 && iconNum < 2 && selectedPoints >= 2){
			drawLine();
		}
	}
	else if(pointExists(posArray) === false){
			var x = posArray.x;
			var y = posArray.y;
			posArray.selected = 0;
			pointArray.push(posArray);
	}

	updateDisplay();
}


function initPlane(){
	planeCanvas = document.createElement("canvas");
	planeCanvas.id = "plane_canvas";
	document.body.appendChild(planeCanvas);
	planeCanvas.width = planeSize;
	planeCanvas.height = planeSize;
	planeCanvas.setAttribute("class", "planeClass");
	planeCanvas.addEventListener("click", planeClick, false);
	drawingContext = planeCanvas.getContext("2d");
	drawingContext.drawImage(drawLineXIcon, drawLinePosX, drawLinePosY);
	drawingContext.drawImage(deleteXIcon, deletePosX, deletePosY);
	drawingContext.drawImage(midpointXIcon, midpointPosX, midpointPosY);
	drawingContext.drawImage(perpLineXIcon, perpLinePosX, perpLinePosY);
}
