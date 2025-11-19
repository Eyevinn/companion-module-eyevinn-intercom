import type { ModuleInstance } from './main.js'
import { ChannelPresetCategories } from './presets.js'

export enum GlobalVariables {
	IS_CONNECTED = 'IsConnected',
	GLOBAL_MUTE = 'GlobalMute',
	SELECTED_CHANNEL = 'SelectedChannel',
	PREVIOUSLY_SELECTED_CHANNEL = 'PreviouslySelectedChannel',
	NUMBER_OF_CALLS = 'NumberOfCalls',
}

export enum ChannelXVariables {
	CHANNEL_X_INPUT_MUTE = 'ChannelXInputMute',
	CHANNEL_X_OUTPUT_MUTE = 'ChannelXOutputMute',
	CHANNEL_X_NAME = 'ChannelXName',
	CHANNEL_X_IS_SOMEONE_SPEAKING = 'ChannelXIsSomeoneSpeaking',
	CHANNEL_X_SPEAKING_PULSE = 'ChannelXSpeakingPulse',
}

export const Variables = { ...GlobalVariables, ...ChannelXVariables }

interface VariableDefinition {
	variableId: string
	name: string
}

interface VariableValues {
	[key: string]: boolean | number | string
}

const defaultVariables: VariableDefinition[] = [
	{ variableId: Variables.IS_CONNECTED, name: Variables.IS_CONNECTED },
	{ variableId: Variables.GLOBAL_MUTE, name: Variables.GLOBAL_MUTE },
	{ variableId: Variables.SELECTED_CHANNEL, name: Variables.SELECTED_CHANNEL },
	{ variableId: Variables.PREVIOUSLY_SELECTED_CHANNEL, name: Variables.PREVIOUSLY_SELECTED_CHANNEL },
	{ variableId: Variables.NUMBER_OF_CALLS, name: Variables.NUMBER_OF_CALLS },
]

export const getDefaultVariables = (): { definitions: VariableDefinition[]; values: VariableValues } => {
	const variableDefinitions: VariableDefinition[] = defaultVariables
	const variableValues: VariableValues = {
		[Variables.IS_CONNECTED]: false,
		[Variables.GLOBAL_MUTE]: false,
		[Variables.SELECTED_CHANNEL]: 0,
		[Variables.PREVIOUSLY_SELECTED_CHANNEL]: 0,
		[Variables.NUMBER_OF_CALLS]: 0,
	}
	Object.values(ChannelPresetCategories).forEach((_val, index) => {
		Object.values(ChannelXVariables).forEach((channelXVariable) => {
			const variableId = channelXVariable.replace('X', (index + 1).toString())
			let variableValue
			switch (channelXVariable) {
				case ChannelXVariables.CHANNEL_X_INPUT_MUTE:
					variableValue = true
					break
				case ChannelXVariables.CHANNEL_X_OUTPUT_MUTE:
					variableValue = false
					break
				case ChannelXVariables.CHANNEL_X_IS_SOMEONE_SPEAKING:
					variableValue = false
					break
				case ChannelXVariables.CHANNEL_X_SPEAKING_PULSE:
					variableValue = false
					break
				default:
				case ChannelXVariables.CHANNEL_X_NAME:
					variableValue = 'Call ' + (index + 1).toString()
					break
			}
			variableDefinitions.push({ variableId, name: variableId })
			variableValues[variableId] = variableValue
		})
	})
	return {
		definitions: variableDefinitions,
		values: variableValues,
	}
}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	const defaultVariables = getDefaultVariables()
	self.setVariableDefinitions(defaultVariables.definitions)
	self.setVariableValues(defaultVariables.values)
}
