// fetch("http://localhost:8081/clients/	")
// 	.then(res => res.json())
// 	.then(data => console.log(data));


fetch("http://localhost:8081/clients/")
	.then(res => res.json())
	.then(clients => {
		for (client of clients) {
			document.body.innerHTML += (JSON.stringify(client)) + '<br>';
		}
	});

