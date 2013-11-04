/* globals define */
define(["collision"], function(Collision) {
	"use strict";

	var gameWidth,
		gameHeight,
		gameGridSize,
		grid = [];

	function gridCell(x, y, width, height, column, row) {
		function top() { return y; }
		function bottom() { return y + height; }
		function left() { return x; }
		function right() { return x + width; }
		function getColumn() { return column; }
		function getRow() {return row; }
		return {top: top, bottom: bottom, left: left, right: right, row: getRow, column: getColumn};
	}

	function doesOneCellCollide(cells, shape, shapeCollideFunction) {
		for(var c = 0; c < cells.length; c++) {
			var cell = cells[c];

			if(cellShouldCollide(cell.column(), cell.row()) && shapeCollideFunction(shape, cell)) {
				return true;
			}
		}

		return false;
	}

	function cellShouldCollide(cellX, cellY) {
		return grid && grid[cellY] && grid[cellY][cellX] === 1;
	}

	function collidesWithGridOnRight(shape) {
		var rightIndex = Math.ceil(shape.right() / gameGridSize);
		var topIndex = Math.floor(shape.top() / gameGridSize);

		var cells = [
			gridCell((rightIndex - 1) * gameGridSize, topIndex * gameGridSize, gameGridSize, gameGridSize, rightIndex - 1, topIndex),
			gridCell((rightIndex - 1) * gameGridSize, (topIndex + 1) * gameGridSize, gameGridSize, gameGridSize, rightIndex - 1, topIndex + 1),
			gridCell(rightIndex * gameGridSize, topIndex * gameGridSize, gameGridSize, gameGridSize, rightIndex, topIndex),
			gridCell(rightIndex * gameGridSize, (topIndex + 1) * gameGridSize, gameGridSize, gameGridSize, rightIndex, topIndex + 1)
		];

		return doesOneCellCollide(cells, shape, Collision.collidesOnRight);
	}

	function collidesWithGridOnLeft(shape) {
		var leftIndex = Math.floor(shape.left() / gameGridSize);
		var topIndex = Math.floor(shape.top() / gameGridSize);

		var cells = [
			gridCell((leftIndex + 1) * gameGridSize, topIndex * gameGridSize, gameGridSize, gameGridSize, leftIndex + 1, topIndex),
			gridCell((leftIndex + 1) * gameGridSize, (topIndex + 1) * gameGridSize, gameGridSize, gameGridSize, leftIndex + 1, topIndex + 1),
			gridCell(leftIndex * gameGridSize, topIndex * gameGridSize, gameGridSize, gameGridSize, leftIndex, topIndex),
			gridCell(leftIndex * gameGridSize, (topIndex + 1) * gameGridSize, gameGridSize, gameGridSize, leftIndex, topIndex + 1)
		];

		return doesOneCellCollide(cells, shape, Collision.collidesOnLeft);
	}

	function collidesWithGridOnBottom(shape) {
		var leftCellIndex = Math.floor(shape.left() / gameGridSize);
		var rightCellIndex = Math.ceil(shape.left() / gameGridSize);

		var leftGridPoint = leftCellIndex * gameGridSize;
		var rightGridPoint = rightCellIndex * gameGridSize;

		var bottomCellIndex = Math.ceil(shape.bottom() / gameGridSize);
		var topCellIndex = Math.floor(shape.bottom() / gameGridSize);

		var bottomGridPoint = bottomCellIndex * gameGridSize;
		var topGridPoint = topCellIndex * gameGridSize;

		var cells = [
			gridCell(leftGridPoint, topGridPoint, gameGridSize, gameGridSize, leftCellIndex, topCellIndex),
			gridCell(rightGridPoint, topGridPoint, gameGridSize, gameGridSize, rightCellIndex, topCellIndex),
			gridCell(rightGridPoint, bottomGridPoint, gameGridSize, gameGridSize, rightCellIndex, bottomCellIndex),
			gridCell(leftGridPoint, bottomGridPoint, gameGridSize, gameGridSize, leftCellIndex, bottomCellIndex)
		];

		return doesOneCellCollide(cells, shape, Collision.collidesOnBottom);
	}

	function render(canvas, canvasTopLeftX, canvasTopLeftY) {
		if(window.showGrid) {
			renderGrid(canvas, canvasTopLeftX, canvasTopLeftY);
		}
	}

	function renderGridHorizontalLines(canvas, firstGridPointY, canvasTopLeftX, canvasTopLeftY) {
		canvas.fillStyle = "rgba(255,255,255,.3)";
		for(var gy = firstGridPointY; gy <= canvasTopLeftY + gameHeight; gy += gameGridSize) {
			canvas.fillRect(0, gy - canvasTopLeftY, gameWidth, 1);
		}
	}

	function renderGridVerticalLines(canvas, firstGridPointX, canvasTopLeftX) {
		canvas.fillStyle = "rgba(255,255,255,.3)";
		for(var gx = firstGridPointX; gx <= canvasTopLeftX + gameWidth; gx += gameGridSize) {
			canvas.fillRect(gx - canvasTopLeftX, 0, 1, gameHeight);
		}
	}

	function renderCollisionGrid(canvas, firstGridPointX, firstGridPointY, canvasTopLeftX, canvasTopLeftY) {
		var gridCellIndexX = 0;
		var gridCellIndexY = 0;

		canvas.fillStyle = "rgba(255,0,0,.5)";
		for(var gx = firstGridPointX; gx <= firstGridPointX + gameWidth; gx += gameGridSize) {
			gridCellIndexX = Math.floor(gx / gameGridSize);
			gridCellIndexY = Math.floor(firstGridPointY / gameGridSize);

			for(var gy = firstGridPointY; gy <= firstGridPointY + gameHeight; gy += gameGridSize) {
				gridCellIndexY = Math.floor(gy / gameGridSize);

				if(grid[gridCellIndexY] && grid[gridCellIndexY][gridCellIndexX] && grid[gridCellIndexY][gridCellIndexX] === 1) {
					canvas.fillRect(gx - canvasTopLeftX, gy - canvasTopLeftY, gameGridSize, gameGridSize);
				}
			}
		}
	}

	function renderGrid(canvas, canvasTopLeftX, canvasTopLeftY) {
		var firstGridPointY = Math.floor(canvasTopLeftY / gameGridSize) * gameGridSize;
		var firstGridPointX = Math.floor(canvasTopLeftX / gameGridSize) * gameGridSize;

		renderGridHorizontalLines(canvas, firstGridPointY, canvasTopLeftX, canvasTopLeftY);
		renderGridVerticalLines(canvas, firstGridPointX, canvasTopLeftX, canvasTopLeftY);
		renderCollisionGrid(canvas, firstGridPointX, firstGridPointY, canvasTopLeftX, canvasTopLeftY);
	}

	function init(gridCells, sceneWidth, width, height, gridSize) {
		gameWidth = width;
		gameHeight = height;
		gameGridSize = gridSize;

		var gridCellPerRow = Math.floor(sceneWidth / gridSize);

		if(gridCells.length % gridCellPerRow !== 0)
			throw "Invalid Grid Given, Length of grid array was " + gridCells.length + " and expected array with multipler of " + gridCellPerRow;

		for (var g = 0; g < gridCells.length; g += gridCellPerRow)
		    grid.push( gridCells.slice(g, g + gridCellPerRow) );
	}

	return {
		init: init,
		render: render,
		collidesWithGridOnRight: collidesWithGridOnRight,
		collidesWithGridOnLeft: collidesWithGridOnLeft,
		collidesWithGridOnBottom: collidesWithGridOnBottom
	};
});