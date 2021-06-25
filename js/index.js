let tbody = document.querySelector('tbody');
const createFormBtn = document.querySelector('.create-form-btn');

const createBtn = document.querySelector('.create-btn');



document.addEventListener('DOMContentLoaded', showAllUsers);





async function showAllUsers() {
	let users = await getAllUsers();
	for (user of users) {
		let tr = createTR();
		tbody.appendChild(tr);
	}
}

async function fetchData(url) {
	return (await fetch(url)).json();
}

async function getAllUsers() {
	const AllUsersURL = 'http://localhost:8081/clients/';
	// массив объектов
	// let users = await fetchData(AllUsersURL);
	return (await fetchData(AllUsersURL));
}

function createTR() {
	let tr = document.createElement('tr');
	let td1 = document.createElement('td');
	let td2 = document.createElement('td');
	let td3 = document.createElement('td');
	td1.textContent = user.id;
	td2.textContent = user.fullName;
	td3.textContent = user.telNumber;
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	return tr;
}

