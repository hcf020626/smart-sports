import {login, reg, forget, sendCode, saveUserInfo, updatePassword, changeBonding, getTheLatestInfo} from './account.js'
import {getStudentsByIdcard, getWeightById, getHeightById} from './student.js'

export default {
	account: {
		login,
		reg,
		forget,
		sendCode,
		saveUserInfo,
		updatePassword,
		changeBonding,
		getTheLatestInfo
	},
	student: {
		getStudentsByIdcard,
		getWeightById,
		getHeightById
	},
	
}