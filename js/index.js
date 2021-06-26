const baseURL = 'http://localhost:8081/clients/';
const tbody = document.querySelector('tbody');
const wrapper = document.querySelector('.wrapper');
const createBtn = document.querySelector('.create-btn');
let deleteBtns;
let numberInput = document.querySelector('.number-input');



document.addEventListener('DOMContentLoaded', showAllUsers);
createBtn.addEventListener('click', showCreateCLientForm);



async function showAllUsers() {
	let users = await getAllUsers();
	let i = 0;
	for (user of users) {
		let tr = createTR();
		tr.classList.toggle('row-' + i++);
		tbody.appendChild(tr);
	}
	initActionBtns();
}

function initActionBtns() {
	deleteBtns = document.querySelectorAll('.delete-btn')
	deleteBtns.forEach(btn => {
		btn.addEventListener('click', deleteUser);
	});
	visitBtns = document.querySelectorAll('.visit-btn');
	visitBtns.forEach(btn => {
		btn.addEventListener('click', visit);
	})
}

async function fetchData(url, methodName = 'GET') {
	return (await fetch(url, {
		method: methodName
	})).json();
}

async function getAllUsers() {
	// массив объектов
	return (await fetchData(baseURL));
}

function createTR() {
	let tr = document.createElement('tr');
	// id
	let td1 = document.createElement('td');
	// fullName
	let td2 = document.createElement('td');
	// telNumber
	let td3 = document.createElement('td');
	// actions
	let td4 = document.createElement('td');
	td1.textContent = user.id;
	td2.textContent = user.fullName;
	td3.textContent = user.telNumber;
	td4.innerHTML =
		'<div class="action-buttons">' +
		'<button class="btn delete-btn">Удалить</button>' +
		'<button class="btn visit-btn">+</button>' +
		'</div>';
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	tr.appendChild(td4);
	return tr;
}

function showCreateCLientForm() {
	wrapper.innerHTML =
		'<form action="http://localhost:8081/clients/" method="POST" enctype="application/x-www-form-urlencoded">' +
		'<input type="text" name="fullName" class="full-name-input">' +
		'<input type="number" name="telNumber" class="tel-number-input">' +
		'<button type="submit" class="sec-create-btn">Создать</button>' +
		'</form>';
}


function backToMain() {
	wrapper.innerHTML =
		'<table>' +
		'<thead>' +
		'<th>ID</th>' +
		'<th>Full Name</th>' +
		'<th>Tel Number</th>' +
		'<th>Action</th>' +
		'</thead>' +
		'<tbody>' +
		'</tbody>' +
		'</table>' +
		'<div class="buttons">' +
		'<button class="btn create-btn"><a>Создать</a></button>' +
		'</div>'
	showAllUsers();
}

// async function modifyNumberInput() {
// 	let usersCount = (await getAllUsers()).length;
// 	numberInput.setAttribute('min', 1);
// 	numberInput.setAttribute('max', usersCount);
// 	console.log(numberInput);
// }

// function changeActionInForm(e) {
// 	deleteForm.setAttribute('action', baseURL + e.target.value);
// }

async function deleteUser(e) {
	let rowIndex = getRowIndex(e);
	(await fetchData(baseURL + rowIndex, 'DELETE'));
}

async function visit(e) {
	let rowIndex = getRowIndex(e);
	await fetchData(baseURL + rowIndex + '/prolong=30', 'PUT');
}

function getRowIndex(e) {
	let actionBtn = e.target;
	let actionButtons = actionBtn.parentElement;
	let td = actionButtons.parentElement;
	let tr = td.parentElement;
	let trClassName = tr.className;
	let lastSymbolInTrClassName = trClassName.slice(-1);
	return lastSymbolInTrClassName;
}

