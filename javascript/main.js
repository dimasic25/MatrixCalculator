let table_body = document.getElementsByClassName('data-table__body')[0];

let table_rows = 20;
let table_columns = 20;


let isSelect = false;

let lastSelectedCell;

let firstSelectedCell;
let secondSelectedCell;
let indexFirstSelectedCell;
let indexSecondSelectedCell;

function MatrixInfo() {
	this.indexFirstSelectedCell = undefined;
	this.indexSecondSelectedCell = undefined;
	this.rows = undefined;
	this.cols = undefined;
}

// хранит матрицы
let matricesInfo = [];

/* создание таблицы*/
for (let i = 0; i < table_rows; i++) {
	let tr = document.createElement('tr');
	for (let j = 0; j < table_columns; j++) {
		let td = document.createElement('td');
		td.innerHTML = '<input type="text" class="input">';
		tr.appendChild(td);
	}
	table_body.appendChild(tr);
}

let inputs = table_body.getElementsByClassName('input');

for (let i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('click', function (e) {
		if (lastSelectedCell) {
			lastSelectedCell.style.backgroundColor = 'white';
		}
		lastSelectedCell = e.target;
	});
	// валидация (можно вводить только цифры)
	inputs[i].addEventListener('keyup', function () {
		this.value = this.value.replace(/[^\d]/g, '');
	});

	inputs[i].addEventListener('mouseup', function (e) {
		if (isSelect) {
			secondSelectedCell = e.target;
		}

		indexFirstSelectedCell = findCellIndex(firstSelectedCell);
		indexSecondSelectedCell = findCellIndex(secondSelectedCell);

		if (indexFirstSelectedCell > indexSecondSelectedCell) {
			[indexFirstSelectedCell, indexSecondSelectedCell] = swap(indexFirstSelectedCell, indexSecondSelectedCell);
		}
		let colFirst, colSecond;
		colFirst = indexFirstSelectedCell % table_columns;
		colSecond = indexSecondSelectedCell % table_columns;

		let rowFirst, rowSecond;
		rowFirst = Math.floor(indexFirstSelectedCell / table_columns);
		rowSecond = Math.floor(indexSecondSelectedCell / table_columns);


		if (!(colFirst < colSecond) && (rowFirst < rowSecond) ||
			!(colFirst > colSecond) && (rowFirst > rowSecond)) {

			let selectedRows = rowSecond - rowFirst;
			indexFirstSelectedCell += selectedRows * table_columns;
			indexSecondSelectedCell -= selectedRows * table_columns;
			if (indexFirstSelectedCell > indexSecondSelectedCell) {
				[indexFirstSelectedCell, indexSecondSelectedCell] = swap(indexFirstSelectedCell, indexSecondSelectedCell);
			}
			if (colFirst > colSecond) {
				[colFirst, colSecond] = swap(colFirst, colSecond);
			}
		}
		let cellBackColor = "rgb(192, 182, 182)";

		for (let i = indexFirstSelectedCell; i < indexSecondSelectedCell + 1; i++) {
			let remainsI = i % table_columns;
			if (remainsI >= colFirst && remainsI <= colSecond) {
				inputs[i].style.backgroundColor = cellBackColor;

			}

		}
		if (matricesInfo.length == 2) {
			let start = matricesInfo[0].indexFirstSelectedCell;
			let end = matricesInfo[0].indexSecondSelectedCell;
			for (let i = start; i <= end; i += table_columns) {
				for (let j = 0; j < matricesInfo[0].cols; j++) {
					inputs[i + j].style.backgroundColor = 'white';
				}
			}
			matricesInfo.shift();
		}
		let matrix = new MatrixInfo();
		matrix.rows = rowSecond - rowFirst + 1;
		matrix.cols = colSecond - colFirst + 1;
		matrix.indexFirstSelectedCell = indexFirstSelectedCell;
		matrix.indexSecondSelectedCell = indexSecondSelectedCell;
		matricesInfo.push(matrix);

		isSelect = false;
	});
}

table_body.addEventListener('mousedown', function (e) {
	isSelect = true;
	firstSelectedCell = e.target;
});


function findCellIndex(cell) {
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i] == cell) return i;
	}
	return -1;
}

document.querySelector('.sum').addEventListener('click', function () {
	let A = createMatrix(0);
	let B = createMatrix(1);


	if (!correctSizes(A, B, '+')) {
		printError();
		return;
	}
	let C = [];

	let aInfo = matricesInfo[0];

	for (let i = 0; i < aInfo.rows; i++) {
		C[i] = [];
	}
	for (let i = 0; i < aInfo.rows; i++) {
		for (let j = 0; j < aInfo.cols; j++) {
			C[i][j] = Number(A[i][j]) + Number(B[i][j]);
		}
	}

	printAnswer(C);
});
function correctSizes(A = undefined, B = undefined, action = 'none') {
	switch (action) {
		case '+':
		case '-':
			if (A == undefined || B == undefined)
				return false;
			else if (A.length == A[0].length && B.length == B[0].length)
				return true;
			return false;
		case '*':
			if (A == undefined || B == undefined)
				return false;
			else if (A[0].length == B.length)
				return true;
			return false;
		case 'det':
			if (A == undefined)
				return false;
			else if (A.length == A[0].length)
				return true;
			return false;
	}
}

document.querySelector('.sub').addEventListener('click', function () {
	let A = createMatrix(0);
	let B = createMatrix(1);
	let C = [];

	if (!correctSizes(A, B, '-')) {
		printError();
		return;
	}

	let aInfo = matricesInfo[0];

	for (let i = 0; i < aInfo.rows; i++) {
		C[i] = [];
	}
	for (let i = 0; i < aInfo.rows; i++) {
		for (let j = 0; j < aInfo.cols; j++) {
			C[i][j] = A[i][j] - B[i][j];
		}
	}
	printAnswer(C);
});

document.querySelector('.multiply').addEventListener('click', function () {
	let A = createMatrix(0);
	let B = createMatrix(1);

	if (!correctSizes(A, B, '*')) {
		printError();
		return;
	}
	printAnswer(multiplyMatrix(A, B));
});

document.querySelector('.det').addEventListener('click', function () {
	let A = createMatrix(1);
	if (!correctSizes(A, undefined, 'det')) {
		printError();
		return;
	}
	printAnswer([[determinant(A)]]);
});

function determinant(A) {
	let N = A.length, B = [], denom = 1, exchanges = 0;
	for (let i = 0; i < N; ++i) {
		B[i] = [];
		for (let j = 0; j < N; ++j)
			B[i][j] = A[i][j];
	}
	for (let i = 0; i < N - 1; ++i) {
		let maxN = i, maxValue = Math.abs(B[i][i]);
		for (let j = i + 1; j < N; ++j) {
			let value = Math.abs(B[j][i]);
			if (value > maxValue) {
				maxN = j;
				maxValue = value;
			}
		}
		if (maxN > i) {
			let temp = B[i];
			B[i] = B[maxN];
			B[maxN] = temp;
			++exchanges;
		}
		else {
			if (maxValue == 0)
				return maxValue;
		}
		let value1 = B[i][i];
		for (let j = i + 1; j < N; ++j) {
			let value2 = B[j][i];
			B[j][i] = 0;
			for (let k = i + 1; k < N; ++k)
				B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
		}
		denom = value1;
	}
	if (exchanges % 2)
		return -B[N - 1][N - 1];
	else
		return B[N - 1][N - 1];
}

// Умножение матриц
function multiplyMatrix(A, B) {
	let rowsA = A.length, colsA = A[0].length,
		rowsB = B.length, colsB = B[0].length,
		C = [];
	if (colsA != rowsB) return false;
	for (let i = 0; i < rowsA; i++) C[i] = [];
	for (let k = 0; k < colsB; k++) {
		for (let i = 0; i < rowsA; i++) {
			let t = 0;
			for (let j = 0; j < rowsB; j++) t += A[i][j] * B[j][k];
			C[i][k] = t;
		}
	}
	return C;
}


function createMatrix(index) {
	let matrix = [];

	let start = matricesInfo[index].indexFirstSelectedCell;
	let end = matricesInfo[index].indexSecondSelectedCell;

	// k - номер строки в матрице
	for (let i = start, k = 0; i <= end; i += table_columns, k++) {
		matrix.push([]);
		for (let j = 0; j < matricesInfo[index].cols; j++) {
			matrix[k][j] = Number(inputs[i + j].value);
		}
	}
	return matrix;
}

document.querySelector('.clear').addEventListener('click', function () {
	let answerTableBody = document.querySelector('.answer-table__body');
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].value = "";
	}
	if (answerTableBody) {
		answerTableBody.remove();
	}
	let separator = document.querySelector('.sep');
	separator.style.display = 'none';
});


function printAnswer(C) {
	let answerTableBody = document.querySelector('.answer-table__body');
	if (answerTableBody) {
		answerTableBody.remove();
	}
	answerTableBody = document.createElement('table_body');
	answerTableBody.className = 'answer-table__body';

	for (let i = 0; i < C.length; i++) {
		let tr = document.createElement('tr');
		for (let j = 0; j < table_columns; j++) {
			let td = document.createElement('td');
			td.innerHTML = '<input type="text" class=\"input\">';
			tr.appendChild(td);
		}
		answerTableBody.appendChild(tr);
	}
	document.querySelector('.answer-table').appendChild(answerTableBody);

	let separator = document.querySelector('.sep');
	separator.style.display = 'block';

	let answerInputs = document.querySelectorAll('.answer-table__body input[class="input"]');
	for (let i = 0; i < C.length; i++) {
		for (let j = 0; j < C[i].length; j++) {
			answerInputs[i * table_columns + j].value = C[i][j];
		}
	}
}

function printError() {
	let answerTableBody = document.querySelector('.answer-table__body');
	if (answerTableBody) {
		answerTableBody.remove();
	}
	answerTableBody = document.createElement('table_body');
	answerTableBody.className = 'answer-table__body';
	answerTableBody.innerHTML = "<span class=\"error-text\">Проверьте правильность введенных данных!<span>";
	document.querySelector('.answer-table').appendChild(answerTableBody);
	let errorText = document.querySelector('.error-text');
	errorText.style.display = "block";
	errorText.style.margin = "10px";
	errorText.style.color = "#ff3f34";
}

function swap(a, b) {
	return [b, a];
}