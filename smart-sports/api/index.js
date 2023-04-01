import {login, reg, sendCode, saveUserInfo, updatePassword, changeBonding} from './account.js'
import {getStudentsByIdcard} from './student.js'

export default {
	account: {
		login,
		reg,
		sendCode,
		saveUserInfo,
		updatePassword,
		changeBonding
	},
	student: {
		getStudentsByIdcard
	},
	
}