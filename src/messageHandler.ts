import { Feedbacks } from './feedbacks.js'
import { ModuleInstance } from './main.js'
import { Variables } from './variables.js'

export enum MessageTypes {
	CALL_STATE_UPDATE = 'CALL_UPDATE',
	CALLS_STATE_UPDATE = 'CALLS_STATE_UPDATE',
}

export interface Call {
	callId: string
	index: number
	isInputMuted: boolean
	isOutputMuted: boolean
	volume: number
	productionId: string
	productionName: string
	lineId: string
	lineName: string
	isSomeoneSpeaking: boolean
}

export type CallStateUpdate = { type: MessageTypes.CALL_STATE_UPDATE } & Call

export type CallsStateUpdate = {
	type: MessageTypes.CALLS_STATE_UPDATE
	globalMute: boolean
	numberOfCalls: number
	calls: Call[]
}

export const handleMessage = (self: ModuleInstance, msg: CallStateUpdate | CallsStateUpdate): void => {
	console.log(msg)
	const getCallStateVariableUpdates = (call: Call) => {
		const updates: { [key: string]: boolean | string } = {}
		const inputMuteVariable = Variables.CHANNEL_X_INPUT_MUTE.replace('X', call.index.toString())
		const variableIsInputMuted = self.getVariableValue(inputMuteVariable)
		if (variableIsInputMuted !== call.isInputMuted) {
			updates[inputMuteVariable] = call.isInputMuted
		}
		const outputMuteVariable = Variables.CHANNEL_X_OUTPUT_MUTE.replace('X', call.index.toString())
		const variableIsOutputMuted = self.getVariableValue(outputMuteVariable)
		if (variableIsOutputMuted !== call.isOutputMuted) {
			updates[outputMuteVariable] = call.isOutputMuted
		}
		const channelNameVariable = Variables.CHANNEL_X_NAME.replace('X', call.index.toString())
		const variableChannelName = self.getVariableValue(channelNameVariable)
		const newName = call.lineName
		if (variableChannelName !== newName) {
			updates[channelNameVariable] = newName
		}
		const speakingVar = Variables.CHANNEL_X_IS_SOMEONE_SPEAKING.replace('X', call.index.toString())
		const variableIsSpeaking = self.getVariableValue(speakingVar)
		if (variableIsSpeaking !== call.isSomeoneSpeaking) {
			updates[speakingVar] = call.isSomeoneSpeaking
		}
		return updates
	}

	if (msg.type === MessageTypes.CALL_STATE_UPDATE) {
		const updates = getCallStateVariableUpdates(msg)

		if (msg.isSomeoneSpeaking) {
			self.startSpeakingPulse(msg.index)
		} else {
			self.stopSpeakingPulse(msg.index)
		}

		if (Object.keys(updates).length) {
			self.setVariableValues(updates)
			self.checkFeedbacks(
				Feedbacks.GET_INPUT_MUTE_BUTTON_STATUS,
				Feedbacks.GET_OUTPUT_MUTE_BUTTON_STATUS,
				Feedbacks.GET_IS_SOMEONE_SPEAKING_INDICATOR,
			)
		}
	} else if (msg.type === MessageTypes.CALLS_STATE_UPDATE) {
		const variableIsGlobalMute = self.getVariableValue(Variables.GLOBAL_MUTE)
		const variableNumberOfCalls = self.getVariableValue(Variables.NUMBER_OF_CALLS) || 0
		let updates: { [key: string]: string | boolean | number } = {}
		msg.calls.forEach((call) => {
			updates = {
				...updates,
				...getCallStateVariableUpdates(call),
			}

			if (call.isSomeoneSpeaking) {
				self.startSpeakingPulse(call.index)
			} else {
				self.stopSpeakingPulse(call.index)
			}
		})
		if (variableIsGlobalMute !== msg.globalMute) {
			updates[Variables.GLOBAL_MUTE] = msg.globalMute
		}
		if (variableNumberOfCalls !== msg.numberOfCalls) {
			updates[Variables.NUMBER_OF_CALLS] = msg.numberOfCalls
			const excessChannelIndex = Number(variableNumberOfCalls)
			if (excessChannelIndex > msg.numberOfCalls) {
				self.stopSpeakingPulse(excessChannelIndex)
				updates = {
					...updates,
					[Variables.CHANNEL_X_INPUT_MUTE.replace('X', excessChannelIndex.toString())]: true,
					[Variables.CHANNEL_X_OUTPUT_MUTE.replace('X', excessChannelIndex.toString())]: true,
					[Variables.CHANNEL_X_IS_SOMEONE_SPEAKING.replace('X', excessChannelIndex.toString())]: false,
					[Variables.CHANNEL_X_SPEAKING_PULSE.replace('X', excessChannelIndex.toString())]: false,
					[Variables.CHANNEL_X_NAME.replace('X', excessChannelIndex.toString())]: 'Call ' + excessChannelIndex,
				}
			}
		}
		if (Object.keys(updates).length) {
			self.setVariableValues(updates)
			self.checkFeedbacks(
				Feedbacks.GET_INPUT_MUTE_BUTTON_STATUS,
				Feedbacks.GET_OUTPUT_MUTE_BUTTON_STATUS,
				Feedbacks.GET_IS_SOMEONE_SPEAKING_INDICATOR,
				Feedbacks.GET_GLOBAL_INPUT_MUTE_BUTTON_STATUS,
				Feedbacks.GET_BUTTON_CHANNEL_NAME,
				Feedbacks.IS_BUTTON_DISABLED,
			)
		}
	}
}
