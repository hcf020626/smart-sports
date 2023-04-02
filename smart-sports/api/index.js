import {login, reg, sendCode, saveUserInfo, updatePassword, changeBonding, getTheLatestInfo} from './account.js'
import {getStudentsByIdcard} from './student.js'

export default {
	account: {
		login,
		reg,
		sendCode,
		saveUserInfo,
		updatePassword,
		changeBonding,
		getTheLatestInfo
	},
	student: {
		getStudentsByIdcard
	},
	
}