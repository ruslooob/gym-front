const deleteForm = document.querySelector('.delete-form');
let numberInput = document.querySelector('.number-input');
const deleteBtn = document.querySelector('.delete-btn');



document.addEventListener('DOMContentLoaded', modifyNumberInput);
// numberInput.addEventListener('input', changeActionInForm);

async function fetchData(url) {
	return (await fetch(url)).json();
}

async function getAllUsers() {
	const AllUsersURL = 'http://localhost:8081/clients/';
	// массив объектов
	// let users = await fetchData(AllUsersURL);
	return (await fetchData(AllUsersURL));
}


async function modifyNumberInput() {

	console.log(numberInput);

	let usersCount = (await getAllUsers()).length;
	numberInput.setAttribute('min', 1);
	numberInput.setAttribute('max', usersCount);
	console.log(numberInput);
}

function changeActionInForm(e) {
	let baseURL = 'http://localhost:8081/clients/';
	deleteForm.setAttribute('action', baseURL + e.target.value);
}