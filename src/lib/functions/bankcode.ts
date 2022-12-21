import axios from 'axios';

const limit = 50;
const apiKey = `${ import.meta.env.bankcode_apikey }`;
const banksApi = 'https://apis.bankcode-jp.com/v1/banks';
const fields = 'code,name';

function toFilterValue(name: string) {
	return `(name==${name}*,hiragana==${name}*)`;
}

export function requestBankDetail(bankCode: string) {
	const api = `${banksApi}/${bankCode}`;
	return axios.get(api, { params: { apiKey, fields }});
}

export function requestBranchDetail(bankCode: string, branchCode: string) {
	const api = `${banksApi}/${bankCode}/branches/${branchCode}`;
	return axios.get(api, { params: { apiKey, fields }})
}

export function requestBanksByName(keyword: string) {
	const filter = toFilterValue(keyword);
	return axios.get(banksApi, { params: { apiKey, limit, filter, fields }})
}

export function requestBranchesByName(bankCode: string, keyword: string) {
	const api = `${banksApi}/${bankCode}/branches`;
	const filter = toFilterValue(keyword);
	return axios.get(api, { params: { apiKey, limit, filter, fields }});
}