import {login, reg, sendCode, updatePassword, changeBonding} from './account.js'
import {getStudentsByIdcard} from './student.js'

export default {
	account: {
		login,
		reg,
		sendCode,
		updatePassword,
		changeBonding
	},
	student: {
		getStudentsByIdcard
	}
}