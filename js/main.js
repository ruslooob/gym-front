let tbody = document.querySelector('tbody');

async function fetchData(url) {
	return (await fetch(url)).json();
}

async function main() {
	let getAllUsersURL = "http://localhost:8081/clients/";
	// массив объектов
	let users = await fetchData(getAllUsersURL);
	for (user of users) {
		let tr = createTr();
		tbody.appendChild(tr);
	}
}

main();


function createTr() {
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
