function replaceCss(_hiddenColumns, uniqueTableSelector, _styleElement){
	var hiddenColumnsSelectors = "";

	for (var key in _hiddenColumns) {
		var childNo = _hiddenColumns[key];
		hiddenColumnsSelectors += uniqueTableSelector + " td:nth-child(" + childNo + ")," + uniqueTableSelector + " th:nth-child(" + childNo + "),";
	}

	_styleElement.innerHTML = hiddenColumnsSelectors.slice(0, -1) + "{display:none}";
}

function getStyleElement(){
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	document.head.appendChild(styleElement);
	return styleElement;
}

function TableColumnHider(uniqueTableSelector){

	var _hiddenColumns = {};
	var _styleElement = getStyleElement();

	this.hideColumns = function(arrayOfIndexes){
		for(var i = 0; i < arrayOfIndexes.length; i++){
			var index = arrayOfIndexes[i];
			_hiddenColumns[index] = index;
		}
		replaceCss(_hiddenColumns, uniqueTableSelector, _styleElement);
	};

	this.unhideColumns = function(arrayOfIndexes){
		for(var i = 0; i < arrayOfIndexes.length; i++){
			var index = arrayOfIndexes[i];
			delete _hiddenColumns[index];
		}
		replaceCss(_hiddenColumns, uniqueTableSelector, _styleElement);
	};

	this.unhideAllColumns = function(){
		_hiddenColumns = {};
		replaceCss(_hiddenColumns, uniqueTableSelector, _styleElement);
	};

	this.getHiddenColumns = function(){
		var columnIndexes = [];
		for (var key in _hiddenColumns) {
			columnIndexes.push(_hiddenColumns[key]);
		}
		return columnIndexes;
	};

	this.destroy = function(){
		document.head.removeChild(_styleElement);
	}
}

module.exports = TableColumnHider;