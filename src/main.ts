import { InstanceBase, InstanceStatus, runEntrypoint, SomeCompanionConfigField } from '@companion-module/base'
import { ActionMessage, UpdateActions } from './actions.js'
import { GetConfigFields, ModuleConfig } from './config.js'
import { Feedbacks, UpdateFeedbacks } from './feedbacks.js'
import { UpgradeScripts } from './upgrades.js'
import { getDefaultVariables, UpdateVariableDefinitions, Variables } from './variables.js'

import WebSocket, { WebSocketServer } from 'ws'
import { UpdatePresets } from './presets.js'
import { handleMessage } from './messageHandler.js'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig

	private wss?: WebSocketServer
	private clients: Set<WebSocket> = new Set()

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.startWebSocketServer()
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()

		this.updateStatus(InstanceStatus.Ok)
	}

	// Start WebSocket server
	private startWebSocketServer(): void {
		if (!this.config) {
			return
		}

		const port = parseInt(this.config.port || '12345', 10)
		const host = this.config.host || '0.0.0.0'

		if (this.wss) {
			this.wss.close()
			this.log('info', 'Closing existing WebSocket server')
		}

		this.wss = new WebSocketServer({ host, port })

		this.wss.on('connection', (ws) => {
			if (this.clients.size > 0) {
				this.log('warn', 'Rejected WebSocket connection: only one browser client allowed')
				ws.send(
					JSON.stringify({
						type: 'error',
						message: 'Only one browser can be connected to the companion at a time. Please disconnect the other browser session before connecting.',
						statusCode: 409
					})
				)
				ws.close()
				return
			}
			this.clients.add(ws)
			this.setVariableValues({ [Variables.IS_CONNECTED]: true })
			this.checkFeedbacks(
				Feedbacks.GET_INPUT_MUTE_BUTTON_STATUS,
				Feedbacks.GET_OUTPUT_MUTE_BUTTON_STATUS,
				Feedbacks.GET_BUTTON_CHANNEL_NAME,
				Feedbacks.IS_BUTTON_DISABLED
			)
			this.log('info', 'WebSocket client connected')

			ws.on('close', () => {
				this.clients.delete(ws)
				this.setVariableValues(getDefaultVariables().values)
				this.checkFeedbacks(
					Feedbacks.GET_INPUT_MUTE_BUTTON_STATUS,
					Feedbacks.GET_OUTPUT_MUTE_BUTTON_STATUS,
					Feedbacks.GET_BUTTON_CHANNEL_NAME,
					Feedbacks.IS_BUTTON_DISABLED
				)
			})

			ws.on('message', (msg: WebSocket.RawData) => {
				handleMessage(this, JSON.parse(msg.toString()))
			})
		})

		this.wss.on('listening', () => {
			this.log('info', `WebSocket server is running on ${host}:${port}`)
		})

		this.wss.on('error', (err) => {
			this.log('error', `WebSocket server error: ${err.message}`)
		})
	}

	// Send data to all connected clients
	public emitMessage(data: ActionMessage): void {
		const message = JSON.stringify(data)

		for (const ws of this.clients) {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(message)
			}
		}
	}

	// Called when config is updated via GUI
	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.startWebSocketServer()
	}

	// Called when module is deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')

		if (this.wss) {
			this.wss.close()
			this.log('info', 'Closing WebSocket server')
			this.clients.clear()
		}
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
