import { combineRgb, InputValue, SomeCompanionFeedbackInputField } from '@companion-module/base'
import type { ModuleInstance } from './main.js'
import { ChannelXVariables, Variables } from './variables.js'
import {
	diabledInputIcon,
	disabledOutputIcon,
	mutedInputIcon,
	mutedOutputIcon,
	unmutedInputIcon,
	unmutedOutputIcon,
} from './icons.js'

export enum Feedbacks {
	GET_GLOBAL_INPUT_MUTE_BUTTON_STATUS = 'GetGlobalInputMuteButtonStatus',
	IS_BUTTON_DISABLED = 'IsButtonDisabled',
	GET_BUTTON_CHANNEL_NAME = 'GetButtonChannelName',
	GET_INPUT_MUTE_BUTTON_STATUS = 'GetInputMuteButtonStatus',
	GET_OUTPUT_MUTE_BUTTON_STATUS = 'GetOutputMuteButtonStatus',
	GET_IS_SOMEONE_SPEAKING_INDICATOR = 'GetIsSomeoneSpeakingIndicator',
}

const channelIndexFeedbackOptions: SomeCompanionFeedbackInputField = {
	id: 'channelIndex',
	type: 'number',
	label: 'Call Index',
	default: 0,
	min: 0,
	max: 8,
}

const isButtonDisabled = (channelIndex: InputValue, self: ModuleInstance) => {
	const isConnected = self.getVariableValue(Variables.IS_CONNECTED)
	if (!isConnected) return true
	const numberOfCalls = self.getVariableValue(Variables.NUMBER_OF_CALLS) || 0
	return !(channelIndex <= numberOfCalls)
}

const defaultCallback = (
	channelIndex: InputValue | undefined,
	variableName: ChannelXVariables,
	trueIcon: string,
	falseIcon: string,
	disabledIcon: string,
	self: ModuleInstance,
) => {
	if (!channelIndex) {
		channelIndex = self.getVariableValue(Variables.SELECTED_CHANNEL) || 0
	}
	const name = self.getVariableValue(Variables.CHANNEL_X_NAME.replace('X', channelIndex.toString()))?.toString()
	if (isButtonDisabled(channelIndex, self)) {
		return {
			text: name,
			png64: disabledIcon,
			color: combineRgb(133, 133, 133),
		}
	}
	if (!Number(channelIndex)) {
		return {}
	}
	const inputMuted = self.getVariableValue(variableName.replace('X', channelIndex.toString()))
	if (inputMuted) {
		return {
			text: name,
			png64: falseIcon,
		}
	}
	return {
		text: name,
		png64: trueIcon,
	}
}

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		[Feedbacks.GET_GLOBAL_INPUT_MUTE_BUTTON_STATUS]: {
			name: Feedbacks.GET_GLOBAL_INPUT_MUTE_BUTTON_STATUS,
			type: 'boolean',
			defaultStyle: {},
			options: [],
			callback: async () => {
				return !self.getVariableValue(Variables.GLOBAL_MUTE)
			},
		},
		[Feedbacks.GET_INPUT_MUTE_BUTTON_STATUS]: {
			name: Feedbacks.GET_INPUT_MUTE_BUTTON_STATUS,
			type: 'advanced',
			options: [channelIndexFeedbackOptions],
			callback: async (feedback) => {
				return defaultCallback(
					feedback.options.channelIndex,
					Variables.CHANNEL_X_INPUT_MUTE,
					unmutedInputIcon,
					mutedInputIcon,
					diabledInputIcon,
					self,
				)
			},
		},
		[Feedbacks.GET_OUTPUT_MUTE_BUTTON_STATUS]: {
			name: Feedbacks.GET_OUTPUT_MUTE_BUTTON_STATUS,
			type: 'advanced',
			options: [channelIndexFeedbackOptions],
			callback: async (feedback) => {
				return defaultCallback(
					feedback.options.channelIndex,
					Variables.CHANNEL_X_OUTPUT_MUTE,
					unmutedOutputIcon,
					mutedOutputIcon,
					disabledOutputIcon,
					self,
				)
			},
		},
		[Feedbacks.IS_BUTTON_DISABLED]: {
			name: Feedbacks.IS_BUTTON_DISABLED,
			type: 'boolean',
			defaultStyle: {},
			options: [channelIndexFeedbackOptions],
			callback: async (feedback) => {
				const isConnected = self.getVariableValue(Variables.IS_CONNECTED)
				if (!isConnected) return true
				let channelIndex = feedback.options.channelIndex
				if (!channelIndex) {
					channelIndex = self.getVariableValue(Variables.SELECTED_CHANNEL) || 0
				}
				const numberOfCalls = self.getVariableValue(Variables.NUMBER_OF_CALLS) || 0
				return !(channelIndex <= numberOfCalls)
			},
		},
		[Feedbacks.GET_BUTTON_CHANNEL_NAME]: {
			name: Feedbacks.GET_BUTTON_CHANNEL_NAME,
			type: 'advanced',
			options: [channelIndexFeedbackOptions],
			callback: async (feedback) => {
				let channelIndex = feedback.options.channelIndex
				if (!channelIndex) {
					channelIndex = self.getVariableValue(Variables.SELECTED_CHANNEL) || 0
				}
				const channelName = self
					.getVariableValue(Variables.CHANNEL_X_NAME.replace('X', channelIndex.toString()))
					?.toString()
				return {
					text: channelName,
				}
			},
		},
		[Feedbacks.GET_IS_SOMEONE_SPEAKING_INDICATOR]: {
			name: Feedbacks.GET_IS_SOMEONE_SPEAKING_INDICATOR,
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(177, 44, 41),
			},
			options: [channelIndexFeedbackOptions],
			callback: async (feedback) => {
				let channelIndex = feedback.options.channelIndex || self.getVariableValue(Variables.SELECTED_CHANNEL) || 0
				if (!channelIndex || isButtonDisabled(channelIndex, self)) return false
				const variableName = Variables.CHANNEL_X_SPEAKING_PULSE.replace('X', channelIndex.toString())
				return Boolean(self.getVariableValue(variableName))
			},
		},
	})
}
