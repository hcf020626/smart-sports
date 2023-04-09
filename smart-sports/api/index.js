import {login, reg, forget, sendCode, saveParentInfo, updatePassword, changeBonding, getTheLatestInfo} from './parent.js'
import {getStudentsByIdcard, getWeightById, getHeightById, getVisionById} from './student.js'

export default {
	parent: {
		login,
		reg,
		forget,
		sendCode,
		saveParentInfo,
		updatePassword,
		changeBonding,
		getTheLatestInfo
	},
	student: {
		getStudentsByIdcard,
		getWeightById,
		getHeightById,
		getVisionById
	},
	
}