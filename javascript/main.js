let table_body = document.getElementsByClassName('data-table__body')[0];

let table_rows = 20;
let table_columns = 20;


for (let i = 0; i < table_rows; i++) {
	let tr = document.createElement('tr');
	for (let j = 0; j < table_columns; j++) {
		let td = document.createElement('td');
		td.innerHTML = "<input type=\"text\" class=\"input\">";
		tr.appendChild(td);
	}
	table_body.appendChild(tr);
}