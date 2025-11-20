import { combineRgb, CompanionButtonStyleProps, type CompanionPresetDefinitions } from '@companion-module/base'
import { ModuleInstance } from './main.js'
import { ActionTypes, defaultOpenUrl } from './actions.js'
import {
	connectedIcon,
	decreaseVolumeIcon,
	diabledInputIcon,
	disabledDecreaseVolumeIcon,
	disabledIncreaseVolumeIcon,
	disabledPTTIcon,
	disabledVolumeIcon,
	disconnectedIcon,
	increaseVolumeIcon,
	mutedInputIcon,
	PTTEnabledIcon,
	unmutedInputIcon,
	unmutedOutputIcon,
	volumeIcon,
} from './icons.js'
import { Feedbacks } from './feedbacks.js'

export enum GlobalPresetCategories {
	GlobalButtons = 'Global Buttons',
}

export enum ChannelPresetCategories {
	ChannelOneButtons = 'Call 1 Buttons',
	ChannelTwoButtons = 'Call 2 Buttons',
	ChannelThreeButtons = 'Call 3 Buttons',
	ChannelFourButtons = 'Call 4 Buttons',
	ChannelFiveButtons = 'Call 5 Buttons',
	ChannelSixButtons = 'Call 6 Buttons',
	ChannelSevenButtons = 'Call 7 Buttons',
	ChannelEightButtons = 'Call 8 Buttons',
}

export enum ChannelXPresetCategory {
	ChannelXButtons = 'Call X Buttons',
}

export const PresetCategories = { ...GlobalPresetCategories, ...ChannelPresetCategories, ...ChannelXPresetCategory }

export enum PresetTypes {
	ToggleInputMute = 'toggle_input_mute',
	ToggleOutputMute = 'toggle_output_mute',
	IncreaseVolume = 'increase_volume',
	DecreaseVolume = 'decrease_volume',
	RotateVolume = 'rotate_volume',
	ChannelSelect = 'channel_select',
	PushToTalk = 'push_to_talk',
	ToggleGlobalMute = 'toggle_global_mute',
	OpenIntercom = 'open_intercom',
	ConnectionStatus = 'connection_status',
}

const defaultStyles: Omit<CompanionButtonStyleProps, 'text'> = {
	size: '14',
	alignment: 'right:bottom',
	pngalignment: 'center:center',
	color: combineRgb(255, 255, 255),
	bgcolor: combineRgb(0, 0, 0),
	show_topbar: false,
}

export const defaultDisabledStyles: Partial<CompanionButtonStyleProps> = {
	color: combineRgb(133, 133, 133),
}

export function UpdatePresets(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions = {
		[PresetTypes.ConnectionStatus]: {
			category: PresetCategories.GlobalButtons,
			name: 'Connection Status',
			type: 'button',
			style: {
				...defaultStyles,
				text: 'Status',
				png64: connectedIcon,
			},
			feedbacks: [
				{
					feedbackId: Feedbacks.IS_BUTTON_DISABLED,
					options: {},
					style: {
						...defaultDisabledStyles,
						png64: disconnectedIcon,
					},
				},
			],
			steps: [
				{
					down: [],
					up: [],
				},
			],
		},
		[PresetTypes.OpenIntercom]: {
			category: PresetCategories.GlobalButtons,
			name: 'Open Intercom',
			type: 'button',
			style: {
				...defaultStyles,
				alignment: 'center:center',
				text: 'Open Intercom',
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: ActionTypes.OpenIntercom,
							options: {
								url: defaultOpenUrl,
							},
						},
					],
					up: [],
				},
			],
		},
		[PresetTypes.ToggleGlobalMute]: {
			category: PresetCategories.GlobalButtons,
			name: 'Toggle Input Mute',
			type: 'button',
			style: {
				...defaultStyles,
				text: 'Global',
				png64: mutedInputIcon,
			},
			feedbacks: [
				{
					feedbackId: Feedbacks.GET_GLOBAL_INPUT_MUTE_BUTTON_STATUS,
					options: {},
					style: {
						png64: unmutedInputIcon,
					},
				},
				{
					feedbackId: Feedbacks.IS_BUTTON_DISABLED,
					options: {},
					style: {
						...defaultDisabledStyles,
						png64: diabledInputIcon,
					},
				},
			],
			steps: [
				{
					down: [
						{
							actionId: ActionTypes.ToggleGlobalMute,
							options: {},
						},
					],
					up: [],
				},
			],
		},
	}
	presets[PresetTypes.ToggleInputMute + 'X'] = {
		category: PresetCategories.ChannelXButtons,
		name: 'Toggle Input Mute X',
		type: 'button',
		style: {
			...defaultStyles,
			text: 'X',
			png64: mutedInputIcon,
		},
		feedbacks: [
			{
				feedbackId: Feedbacks.GET_INPUT_MUTE_BUTTON_STATUS,
				options: {},
			},
		],
		steps: [
			{
				down: [
					{
						actionId: ActionTypes.ToggleInputMute,
						options: {},
					},
				],
				up: [],
			},
		],
	}
	presets[PresetTypes.ToggleOutputMute + 'X'] = {
		category: PresetCategories.ChannelXButtons,
		name: 'Toggle Output Mute X',
		type: 'button',
		style: {
			...defaultStyles,
			text: 'X',
			png64: unmutedOutputIcon,
		},
		feedbacks: [
			{
				feedbackId: Feedbacks.GET_OUTPUT_MUTE_BUTTON_STATUS,
				options: {},
			},
			{
				feedbackId: Feedbacks.GET_IS_SOMEONE_SPEAKING_INDICATOR,
				options: {},
				style: {
					bgcolor: combineRgb(177, 44, 41),
				},
			},
		],
		steps: [
			{
				down: [
					{
						actionId: ActionTypes.ToggleOutputMute,
						options: {},
					},
				],
				up: [],
			},
		],
	}
	presets[PresetTypes.IncreaseVolume + 'X'] = {
		category: PresetCategories.ChannelXButtons,
		name: 'Increase Volume X',
		type: 'button',
		style: {
			...defaultStyles,
			text: 'X',
			png64: increaseVolumeIcon,
		},
		feedbacks: [
			{
				feedbackId: Feedbacks.IS_BUTTON_DISABLED,
				options: {},
				style: {
					...defaultDisabledStyles,
					png64: disabledIncreaseVolumeIcon,
				},
			},
			{
				feedbackId: Feedbacks.GET_BUTTON_CHANNEL_NAME,
				options: {},
			},
		],
		steps: [
			{
				down: [
					{
						actionId: ActionTypes.IncreaseVolume,
						options: {},
					},
				],
				up: [],
			},
		],
	}
	presets[PresetTypes.DecreaseVolume + 'X'] = {
		category: PresetCategories.ChannelXButtons,
		name: 'Decrease Volume X',
		type: 'button',
		style: {
			...defaultStyles,
			text: 'X',
			png64: decreaseVolumeIcon,
		},
		feedbacks: [
			{
				feedbackId: Feedbacks.IS_BUTTON_DISABLED,
				options: {},
				style: {
					...defaultDisabledStyles,
					png64: disabledDecreaseVolumeIcon,
				},
			},
			{
				feedbackId: Feedbacks.GET_BUTTON_CHANNEL_NAME,
				options: {},
			},
		],
		steps: [
			{
				down: [
					{
						actionId: ActionTypes.DecreaseVolume,
						options: {},
					},
				],
				up: [],
			},
		],
	}
	presets[PresetTypes.RotateVolume + 'X'] = {
		category: PresetCategories.ChannelXButtons,
		name: 'Rotate Volume X',
		type: 'button',
		options: {
			rotaryActions: true,
		},
		style: {
			...defaultStyles,
			text: 'X',
			png64: volumeIcon,
		},
		feedbacks: [
			{
				feedbackId: Feedbacks.IS_BUTTON_DISABLED,
				options: {},
				style: {
					...defaultDisabledStyles,
					png64: disabledVolumeIcon,
				},
			},
			{
				feedbackId: Feedbacks.GET_BUTTON_CHANNEL_NAME,
				options: {},
			},
		],
		steps: [
			{
				down: [
					{
						actionId: ActionTypes.ToggleOutputMute,
						options: {},
					},
				],
				up: [],
				rotate_left: [
					{
						actionId: ActionTypes.DecreaseVolume,
						options: {
							velocity: 1,
						},
					},
				],
				rotate_right: [
					{
						actionId: ActionTypes.IncreaseVolume,
						options: {
							velocity: 1,
						},
					},
				],
			},
		],
	}
	presets[PresetTypes.PushToTalk + 'X'] = {
		category: PresetCategories.ChannelXButtons,
		name: 'Push To Talk X',
		type: 'button',
		style: {
			...defaultStyles,
			text: 'X',
			png64: PTTEnabledIcon,
		},
		feedbacks: [
			{
				feedbackId: Feedbacks.IS_BUTTON_DISABLED,
				options: {},
				style: {
					...defaultDisabledStyles,
					png64: disabledPTTIcon,
				},
			},
			{
				feedbackId: Feedbacks.GET_BUTTON_CHANNEL_NAME,
				options: {},
			},
		],
		steps: [
			{
				down: [
					{
						actionId: ActionTypes.PushToTalkStart,
						options: {},
					},
				],
				up: [
					{
						actionId: ActionTypes.PushToTalkStop,
						options: {},
					},
				],
			},
		],
	}
	let index = 0
	const categories = Object.values(ChannelPresetCategories)
	categories.forEach((category) => {
		index++
		presets[PresetTypes.ToggleInputMute + index] = {
			category,
			name: 'Toggle Input Mute' + index,
			type: 'button',
			style: {
				...defaultStyles,
				text: index.toString(),
				png64: mutedInputIcon,
			},
			feedbacks: [
				{
					feedbackId: Feedbacks.GET_INPUT_MUTE_BUTTON_STATUS,
					options: { channelIndex: index },
				},
			],
			steps: [
				{
					down: [
						{
							actionId: ActionTypes.ToggleInputMute,
							options: { channelIndex: index },
						},
					],
					up: [],
				},
			],
		}
		presets[PresetTypes.ToggleOutputMute + index] = {
			category,
			name: 'Toggle Output Mute' + index,
			type: 'button',
			style: {
				...defaultStyles,
				text: index.toString(),
				png64: unmutedOutputIcon,
			},
			feedbacks: [
				{
					feedbackId: Feedbacks.GET_OUTPUT_MUTE_BUTTON_STATUS,
					options: { channelIndex: index },
				},
				{
					feedbackId: Feedbacks.GET_IS_SOMEONE_SPEAKING_INDICATOR,
					options: { channelIndex: index },
					style: {
						bgcolor: combineRgb(177, 44, 41),
					},
				},
			],
			steps: [
				{
					down: [
						{
							actionId: ActionTypes.ToggleOutputMute,
							options: { channelIndex: index },
						},
					],
					up: [],
				},
			],
		}
		presets[PresetTypes.PushToTalk + index] = {
			category,
			name: 'Push To Talk' + index,
			type: 'button',
			style: {
				...defaultStyles,
				text: index.toString(),
				png64: PTTEnabledIcon,
			},
			feedbacks: [
				{
					feedbackId: Feedbacks.GET_BUTTON_CHANNEL_NAME,
					options: { channelIndex: index },
				},
				{
					feedbackId: Feedbacks.IS_BUTTON_DISABLED,
					options: { channelIndex: index },
					style: {
						...defaultDisabledStyles,
						png64: disabledPTTIcon,
					},
				},
			],
			steps: [
				{
					down: [
						{
							actionId: ActionTypes.PushToTalkStart,
							options: { channelIndex: index },
						},
					],
					up: [
						{
							actionId: ActionTypes.PushToTalkStop,
							options: { channelIndex: index },
						},
					],
				},
			],
		}
		presets[PresetTypes.IncreaseVolume + index] = {
			category,
			name: 'Increase Volume' + index,
			type: 'button',
			style: {
				...defaultStyles,
				text: index.toString(),
				png64: increaseVolumeIcon,
			},
			feedbacks: [
				{
					feedbackId: Feedbacks.GET_BUTTON_CHANNEL_NAME,
					options: { channelIndex: index },
				},
				{
					feedbackId: Feedbacks.IS_BUTTON_DISABLED,
					options: { channelIndex: index },
					style: {
						...defaultDisabledStyles,
						png64: disabledIncreaseVolumeIcon,
					},
				},
			],
			steps: [
				{
					down: [
						{
							actionId: ActionTypes.IncreaseVolume,
							options: { channelIndex: index },
						},
					],
					up: [],
				},
			],
		}
		presets[PresetTypes.DecreaseVolume + index] = {
			category,
			name: 'Decrease Volume' + index,
			type: 'button',
			style: {
				...defaultStyles,
				text: index.toString(),
				png64: decreaseVolumeIcon,
			},
			feedbacks: [
				{
					feedbackId: Feedbacks.GET_BUTTON_CHANNEL_NAME,
					options: { channelIndex: index },
				},
				{
					feedbackId: Feedbacks.IS_BUTTON_DISABLED,
					options: { channelIndex: index },
					style: {
						...defaultDisabledStyles,
						png64: disabledDecreaseVolumeIcon,
					},
				},
			],
			steps: [
				{
					down: [
						{
							actionId: ActionTypes.DecreaseVolume,
							options: { channelIndex: index },
						},
					],
					up: [],
				},
			],
		}
		presets[PresetTypes.RotateVolume + index] = {
			category,
			name: 'Rotate Volume ' + index,
			type: 'button',
			options: {
				rotaryActions: true,
			},
			style: {
				...defaultStyles,
				text: index.toString(),
				png64: volumeIcon,
			},
			feedbacks: [
				{
					feedbackId: Feedbacks.IS_BUTTON_DISABLED,
					options: { channelIndex: index },
					style: {
						...defaultDisabledStyles,
						png64: disabledVolumeIcon,
					},
				},
				{
					feedbackId: Feedbacks.GET_BUTTON_CHANNEL_NAME,
					options: { channelIndex: index },
				},
			],
			steps: [
				{
					down: [
						{
							actionId: ActionTypes.ToggleOutputMute,
							options: {
								channelIndex: index,
							},
						},
					],
					up: [],
					rotate_left: [
						{
							actionId: ActionTypes.DecreaseVolume,
							options: {
								channelIndex: index,
								velocity: 1,
							},
						},
					],
					rotate_right: [
						{
							actionId: ActionTypes.IncreaseVolume,
							options: {
								channelIndex: index,
								velocity: 1,
							},
						},
					],
				},
			],
		}
		presets[PresetTypes.ChannelSelect + index] = {
			category: PresetCategories.ChannelXButtons,
			name: 'Call ' + index,
			type: 'button',
			style: {
				...defaultStyles,
				text: 'Call ' + index.toString(),
				alignment: 'center:center',
			},
			feedbacks: [
				{
					feedbackId: Feedbacks.GET_BUTTON_CHANNEL_NAME,
					options: { channelIndex: index },
				},
				{
					feedbackId: Feedbacks.IS_BUTTON_DISABLED,
					options: { channelIndex: index },
					style: {
						...defaultDisabledStyles,
					},
				},
			],
			steps: [
				{
					down: [
						{
							actionId: ActionTypes.SetSelectedChannel,
							options: { channelIndex: index },
						},
					],
					up: [
						{
							actionId: ActionTypes.SetSelectedChannel,
							options: { channelIndex: 0 },
						},
					],
				},
			],
		}
	})
	self.setPresetDefinitions(presets)
}
