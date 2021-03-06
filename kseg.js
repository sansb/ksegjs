var twoPi = Math.PI * 2;
var pointSize = 7;

function ksegPlane(id){
//global setup
var planeCanvas;
var drawingContext;
var planeSize = 1000;

var pointCounter = 0;
var pointArray = [];
var lineArray = [];
var selectedPoints = 0;
var selectedLines = 0;

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
	
	//draw lines
	var lineIter = 0;
	for(lineIter = 0; lineIter < lineArray.length; lineIter += 1){
		var x1 = lineArray[lineIter].x1;
		var x2 = lineArray[lineIter].x2;
		var y1 = lineArray[lineIter].y1;
		var y2 = lineArray[lineIter].y2;
		drawingContext.beginPath();
		drawingContext.moveTo(x1, y1);
		drawingContext.lineTo(x2, y2);
		drawingContext.closePath();
		drawingContext.stroke();

	}
		
	//draw icons
	drawingContext.drawImage(deleteXIcon, deletePosX, deletePosY);
	drawingContext.drawImage(drawLineXIcon, drawLinePosX, drawLinePosY);
	drawingContext.drawImage(midpointXIcon, midpointPosX, midpointPosY);
	drawingContext.drawImage(perpLineXIcon, perpLinePosX, perpLinePosY);	
	if(selectedPoints > 0){
		drawingContext.drawImage(deleteIcon, deletePosX, deletePosY);
	}
	if(selectedPoints >= 2){
		drawingContext.drawImage(drawLineIcon, drawLinePosX, drawLinePosY);
	}
	if(selectedPoints == 2){
		drawingContext.drawImage(midpointIcon, midpointPosX, midpointPosY);
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
	//get the selected points
	var pointIter = 0;
	var foundFirst = 0;
	var firstX;
	var firstY;
	var lastX;
	var lastY;
	for(pointIter = 0; pointIter < pointArray.length; pointIter += 1){
		if(pointArray[pointIter].selected === 1){
			if(foundFirst === 0){
				foundFirst = 1;
				firstX = pointArray[pointIter].x;
				lastX = pointArray[pointIter].x;
				firstY = pointArray[pointIter].y;
				lastY = pointArray[pointIter].y;
				flipPointState(pointIter);
			}
			else{
				var newLine = [];
				newLine.x1 = lastX;
				newLine.y1 = lastY;
				newLine.x2 = pointArray[pointIter].x;
				newLine.y2 = pointArray[pointIter].y;
				flipPointState(pointIter);
				newLine.selected = 0;
				lineArray.push(newLine);
				lastX = pointArray[pointIter].x;
				lastY = pointArray[pointIter].y;
			}
		}
	}
	var newLine = [];
	newLine.x1 = lastX;
	newLine.x2 = firstX;
	newLine.y1 = lastY;
	newLine.y2 = firstY;
	newLine.selected = 1;
	lineArray.push(newLine);
}

function deleteSelected(){
	var pointIter = 0;
	var pointArrayLen = pointArray.length;
	var x;
	var y;
	while(pointArray[pointIter].selected != 1){
		pointIter += 1;
	}
	
	x = pointArray[pointIter].x;
	y = pointArray[pointIter].y;
	drawingContext.fillStyle = "rgb(255, 255, 255)";
	drawingContext.strokeStyle = "rgb(255, 255, 255)";
	drawingContext.beginPath();
	drawingContext.arc(x, y, pointSize, 0, twoPi, true);
	drawingContext.fill();
	drawingContext.stroke();
	drawingContext.fillStyle = "rgb(0, 0, 0)";
	drawingContext.strokeStyle = "rgb(0, 0, 0)";
	drawingContext.closePath();
	//have to do this twice for some reason YIKES
	drawingContext.fillStyle = "rgb(255, 255, 255)";
	drawingContext.strokeStyle = "rgb(255, 255, 255)";
	drawingContext.beginPath();
	drawingContext.arc(x, y, pointSize, 0, twoPi, true);
	drawingContext.fill();
	drawingContext.stroke();
	drawingContext.fillStyle = "rgb(0, 0, 0)";
	drawingContext.strokeStyle = "rgb(0, 0, 0)";
	drawingContext.closePath();
	pointArray.splice(pointIter, 1);
	selectedPoints -= 1;

}

function drawMidpoint(){
	//first get the coordinates of the two points
	var firstPosX;
	var firstPosY;
	var secondPosX;
	var secondPosY;
	var pointIter = 0;
	var found = 0;
	while(found < 2){
		if(pointArray[pointIter].selected === 1){
			if(found === 0){
				firstPosX = pointArray[pointIter].x;
				firstPosY = pointArray[pointIter].y;
				pointArray[pointIter].selected = 0;
				selectedPoints -= 1;
			}
			if(found === 1){
				secondPosX = pointArray[pointIter].x;
				secondPosY = pointArray[pointIter].y;
				pointArray[pointIter].selected = 0;
				selectedPoints -= 1;
			}
			found += 1;
		}
		pointIter += 1;
	}
	
	var newPoint = [];
	newPoint.x = (firstPosX + secondPosX) / 2;
	newPoint.y = (firstPosY + secondPosY) / 2;
	newPoint.selected = 0;
	pointArray.push(newPoint);
	
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
		else if(iconNum >= 2 && iconNum < 3 && selectedPoints == 2){
			drawMidpoint();
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


this.initPlane = function(){
	planeCanvas = document.createElement("canvas");
	planeCanvas.id = "plane_canvas";
	document.getElementById(id).appendChild(planeCanvas);
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

}
