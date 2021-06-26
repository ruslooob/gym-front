const baseBackURL = 'http://localhost:8081/clients/';
const baseFrontURL = 'http://localhost:5500';
const tbody = document.querySelector('tbody');
const wrapper = document.querySelector('.wrapper');
const createBtn = document.querySelector('.create-btn');
let deleteBtns;
let numberInput = document.querySelector('.number-input');



document.addEventListener('DOMContentLoaded', showAllUsers);
createBtn.addEventListener('click', showCreateCLientForm);



async function showAllUsers() {
	let users = await getAllUsers();
	let i = 1;
	for (user of users) {
		let tr = createTR();
		tr.classList.toggle('row-' + i++);
		tbody.appendChild(tr);
		tr.addEventListener('click', showInfo);
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
	return (await fetchData(baseBackURL));
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
		'<h1>Создание клиента</h1>' +
		'<form action="http://localhost:8081/clients/" method="POST">' +
		'<input type="text" name="fullName" autocomplete="off" class="full-name-input" placeholder="Полное имя">' +
		'<input type="number" name="telNumber" autocomplete="off" class="tel-number-input" placeholder="Тел. номер">' +
		'<button type="submit" class="btn sec-create-btn">Создать</button>' +
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

async function deleteUser(e) {
	// не даст сработать событию click на tr
	e.stopPropagation();
	let clientID = getIdByActionButton(e);
	// удаление
	await fetchData(baseBackURL + clientID, 'DELETE');
}

async function visit(e) {
	// не даст сработать событию click на tr
	e.stopPropagation();
	let clientID = getIdByActionButton(e);
	await fetchData(baseBackURL + clientID + '/prolong=30', 'PUT');
}

async function showInfo(e) {
	let clientID = getIdByTD(e);
	console.log(await fetchData(baseBackURL + clientID));
}


/* 
	Возвращет id пользователя, 
	с которым что-то хотят сделать 
*/
function getIdByActionButton(e) {
	let actionBtn = e.target;
	let actionButtons = actionBtn.parentElement;
	let td = actionButtons.parentElement;
	let tr = td.parentElement;
	let clientID = tr.querySelector('td').textContent;
	return clientID;
}

/* 
	Возвращает id пользователя 
	вызывается при клике по ячейке таблицы
*/
function getIdByTD(e) {
	let td = e.target;
	let tr = td.parentElement;
	let clientID = tr.querySelector('td').textContent;
	return clientID;
}