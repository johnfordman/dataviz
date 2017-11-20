this.data = ''
this.currentPays = ''
this.json = []
console.log(this.json)

return fetch(data, {
	method: 'get'
}).then(function(response) {
	if (response.status === 200) {
		return response.text()
	}
}).then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
.then(data =>  this.data = data) 
.then(()=> {

	console.log(this.data)

	let datas = this.data.querySelector('data')
	let countryArr = datas.querySelectorAll('record')
	let nbChild = datas.childNodes.length 

	for(let i = 0;i < 50; i++){
		var countryName = countryArr[i].childNodes[1].innerHTML

		if(this.currentPays != countryName){
			var employees = {
				countryName: []
			};
			employees.countryName.push({ 
				"name"  : [countryName],
			});
		}
		this.currentPays = countryName;


		var item = countryArr[i];   
		var value = item.childNodes[7].innerHTML

		var cYear = item.childNodes[5].innerHTML
		if(value === ""){
			value = 0
		}

		var dataArr = {
			'value' : value,
			'year': cYear
		}

		console.log()
		
		employees.countryName[0].name.push({ 
			'datas' : dataArr,
		});
	}

	console.log(employees)
	var jsonF = JSON.stringify(employees)

	console.log(jsonF)
			//var txtFile = test;

			 //Write it as the href for the link


			});