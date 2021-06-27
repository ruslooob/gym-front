const PRICE_PER_DAY = 100;
const DAYS_IN_YEAR = 365;

const baseBackURL = 'http://localhost:8081/clients/';
const baseFrontURL = 'http://localhost:5500';
const tbody = document.querySelector('tbody');
const wrapper = document.querySelector('.wrapper');
const createBtn = document.querySelector('.create-btn');

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
	prolongBtns = document.querySelectorAll('.prolong-btn');
	prolongBtns.forEach(btn => {
		btn.addEventListener('click', showProlongForm);
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
	// email
	let td4 = document.createElement('td');
	// actions
	let td5 = document.createElement('td');
	td1.textContent = user.id;
	td2.textContent = user.fullName;
	td3.textContent = user.telNumber;
	td4.textContent = user.email;
	td5.innerHTML =
		'<div class="action-buttons">' +
		'<button class="btn prolong-btn">Продлить</button>' +
		'<button class="btn visit-btn">+</button>' +
		'<button class="btn delete-btn">Удалить</button>' +
		'</div>';
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	tr.appendChild(td4);
	tr.appendChild(td5);
	return tr;
}

function showCreateCLientForm() {
	wrapper.innerHTML =
		'<h1>Создание клиента</h1>' +
		'<form action="http://localhost:8081/clients/" method="POST">' +
		'<input type="text" name="fullName" autocomplete="off" class="full-name-input" placeholder="Полное имя">' +
		'<input type="number" name="telNumber" autocomplete="off" class="tel-number-input" placeholder="Тел. номер">' +
		'<input type="email" name="email" autocomplete="off" placeholder="some@some.com" class="email-input">' +
		'<button type="submit" class="btn sec-create-btn">Создать</button><br>' +
		'</form>';
}

function backToMain() {
	window.location.href = baseFrontURL;
}

async function deleteUser(e) {
	// не даст сработать событию click на tr
	e.stopPropagation();
	let clientID = getIdByActionButton(e);
	// удаление
	await fetch(baseBackURL + clientID, { method: 'DELETE' });
	window.location.reload();
}

async function visit(e) {
	// не даст сработать событию click на tr
	e.stopPropagation();
	let clientID = getIdByActionButton(e);
	await fetch(baseBackURL + clientID + '/visit', { method: 'PUT' });
}

let clientID;

async function showProlongForm(e) {
	e.stopPropagation();
	clientID = getIdByActionButton(e);
	wrapper.innerHTML =
		'<h2>Цена за 1 день - 100 руб</h2>' +
		'<h2>Акция! Чем больше ходишь, тем больше скидка!</h2>' +
		'<h3>Введите количество дней, и получите персональную скидку</h3>' +
		'<input type="number" min="0"  step="100" name="daysCount" placeholder="Количество дней" class="prolong-input">' +
		'<h3 class="total-price">Ваша Цена: </h3>' +
		'<h3 class="discount">Ваша Скидка: </h3>' +
		'<button class="btn prolong-btn">Заплатить</button>'
	let prolongBtn = document.querySelector('.prolong-btn');
	prolongBtn.addEventListener('click', prolong);
	let prolongInput = document.querySelector('.prolong-input');
	prolongInput.addEventListener('input', changeTotalPriceAndDiscount);
}

async function prolong() {
	let prolongInput = document.querySelector('.prolong-input');

	let daysCount = +prolongInput.value;
	console.log(baseBackURL + clientID + '/prolong/' + daysCount);
	await fetch(baseBackURL + clientID + '/prolong/' + daysCount, { method: 'PUT' });
}


async function getTotalPrice(daysCount) {
	let clientInfoJSON = await fetchData(baseBackURL + clientID);
	let sessionsCount = clientInfoJSON.sessionsCount;
	let discount = ((sessionsCount) / (DAYS_IN_YEAR / 2)) * PRICE_PER_DAY;
	let price = daysCount * PRICE_PER_DAY;
	let totalPrice = price - (price * discount / 100);
	return totalPrice;
}

async function getDiscount(daysCount) {
	let clientInfoJSON = await fetchData(baseBackURL + clientID);
	let sessionsCount = clientInfoJSON.sessionsCount;
	let discount = ((sessionsCount) / (DAYS_IN_YEAR / 2)) * PRICE_PER_DAY;
	return discount;
}


async function changeTotalPriceAndDiscount() {
	let prolongInput = document.querySelector('.prolong-input');
	let daysCount = +prolongInput.value;
	let totalPrice = document.querySelector('.total-price');
	let discount = document.querySelector('.discount');
	totalPrice.textContent = 'Ваша Цена: ' + Math.round(await getTotalPrice(daysCount));
	discount.textContent = 'Ваша Скидка: ' + Math.round(await getDiscount(daysCount)) + '%';
}

async function showInfo(e) {
	let h1 = document.querySelector('h1');
	h1.textContent = "Detailed Information"
	let buttonsDiv = document.querySelector('.buttons');
	buttonsDiv.remove();

	let clientID = getIdByTD(e);
	let json = await fetchData(baseBackURL + clientID);
	tbody.innerHTML =
		"<h2>Client Info</h2>" +
		'<tr>' +
		'<td>' + json.id + '</td>' +
		'<td>' + json.fullName + '</td>' +
		'<td>' + json.telNumber + '</td>' +
		'<td>' + json.email + '</td>' +
		'</tr>';
	let ths = document.querySelectorAll('th');
	let actionTH = ths[ths.length - 1];
	actionTH.remove();

	wrapper.innerHTML +=
		'<h2>SeasonTicket Info</h2>' +
		'<table class="info-table">' +
		'<thead>' +
		'<th>Sessions Count</th>' +
		'<th>Registrated</th>' +
		'<th>End Date</th>' +
		'</thead>' +
		'<tbody>' +
		'<tr>' +
		'<td>' + json.sessionsCount + '</td>' +
		'<td>' + json.seasonTicket.registeredDate + '</td>' +
		'<td>' + json.seasonTicket.endDate + '</td>' +
		'</tr>' +
		'</tbody>' +
		'</table>' +
		'<div class="buttons">' +
		'<button class="btn back-to-main-btn">На Главную</button>' +
		'</div>';
	initBackToMainBtn();

}

function initBackToMainBtn() {
	let backToMainBtn = document.querySelector('.back-to-main-btn');
	backToMainBtn.addEventListener('click', backToMain);
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