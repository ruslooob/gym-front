const deleteBtn = document.querySelector('.delete-btn');
document.addEventListener('DOMContentLoaded', modifyNumberInput);


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
	let numberInput = document.querySelector('.number-input');
	console.log(numberInput);

	let usersCount = (await getAllUsers()).length;
	numberInput.setAttribute('min', 1);
	numberInput.setAttribute('max', usersCount);
	console.log(numberInput);
}