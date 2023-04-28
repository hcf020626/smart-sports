import {
	login,
	reg,
	forget,
	sendCode,
	saveParentInfo,
	updatePassword,
	changeBonding,
	getUserListByKeyword,
	createFriendship,
	deleteFriendship,
	getTheLatestInfo,
	getFriendListById,
	getParticularStepsRating,
	getParticularSteps,
	updateSteps,
	updateParticularLike
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
	getLongJumpById,
	getSitAndReachesById,
	getRopeSkippingById,
	getSolidBallById,
	getSwimmingById,
	getRunningById
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
		getUserListByKeyword,
		createFriendship,
		deleteFriendship,
		getTheLatestInfo,
		getFriendListById,
		getParticularStepsRating,
		getParticularSteps,
		updateSteps,
		updateParticularLike
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
		getLongJumpById,
		getSitAndReachesById,
		getRopeSkippingById,
		getSolidBallById,
		getSwimmingById,
		getRunningById
	},

}
