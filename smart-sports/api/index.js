import {
	login,
	reg,
	forget,
	sendCode,
	saveParentInfo,
	updatePassword,
	changeBonding,
	getTheLatestInfo
} from './parent.js'
import {
	getStudentsByIdcard,
	getWeightById,
	getHeightById,
	getVisionById,
	getBloodPressureById,
	getLungCapacityById,
	getPushUpsById,
	getSitUpsById,
	getPullUpsById,
	getLongJumpById
} from './student.js'

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
		getVisionById,
		getBloodPressureById,
		getLungCapacityById,
		getPushUpsById,
		getSitUpsById,
		getPullUpsById,
		getLongJumpById
	},

}
