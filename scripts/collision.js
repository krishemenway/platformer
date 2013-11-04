define(function() {

	function collidesOnTop(shapeA, shapeB) {
		return shapeA.bottom() >= shapeB.top() || shapeA.top() >= shapeB.bottom();
	}

	function collidesOnBottom(shapeA, shapeB) {
		return shapeA.bottom() >= shapeB.top() || shapeA.top() >= shapeB.bottom();
	}

	function collidesOnRight(shapeA, shapeB) {
		return shapeA.right() + 3 >= shapeB.left() && shapeA.left() <= shapeB.left();
	}

	function collidesOnLeft(shapeA, shapeB) {
		return shapeA.left() <= shapeB.right() && shapeA.left() >= shapeB.left();
	}

	return {
		collidesOnTop: collidesOnTop,
		collidesOnBottom: collidesOnBottom,
		collidesOnRight: collidesOnRight,
		collidesOnLeft: collidesOnLeft
	};
});