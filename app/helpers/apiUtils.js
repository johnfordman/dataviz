import datas from '../datas/datafinal.json'

var apiUtils = {
	getCountryData(country){
		return fetch(datas, {
			method: 'get'
		}).then(function(response) {
			if (response.status === 200) {
				return response.json()
			}
		})
	},
}
export default apiUtils;
