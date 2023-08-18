/*
 * DCL Escape Room by NFTWorld.io
 * Multiplayer Game Controller
 * This file works in concert with game.ts to manage the scene and game state
*/

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* we use @ts-ignore a lot because for some reason we're not able to override SDK6 tsconfig es version */
/* this may be fixed when upgrading to SDK7 */

import { Interval } from '@dcl/ecs-scene-utils'
import { getUserData, UserData } from '@decentraland/Identity'
import { getPlayerData } from '@decentraland/Players'
import { CornerLabel, displayAnnouncement, OkPrompt } from '@dcl/ui-scene-utils'

import config from './config'
import { FeeProvider } from './fees'
import { getGame, getCurrentGameId, recordUser, setTask, cancelEntry, setCombination } from './backend'
import { padZero } from 'src/globalfunctions'
import { cancelButton } from './user-interface'
import { updateKeyValues } from './keyui'

const entryButtonScaleAdj = 2
const entryButtonScale = new Vector3(2.5 * entryButtonScaleAdj, 0.75 * entryButtonScaleAdj, 0.01)

export class MultiplayerSystem implements ISystem {
  id?: number
  me?: UserData | null
  bus: MessageBus
  game?: any
  state?: string
  players: string[] = []
  errorCount: number = 0
  syncEntity: Entity
  syncInterval: Interval
  entryButton?: Entity
  lastTask: number = 0
  taskLabel: CornerLabel
  timeLabel: CornerLabel
  timerDisabled: boolean = false
  screenUI: UICanvas
  pyramidExterior: Entity
  feeProvider: FeeProvider = new FeeProvider()
  playerIsInScene: boolean = false
  waitingForPlayersLabel: UIText
  combinations: { [key: string]: number[] } = { tiles: [], figurines: [] }

  constructor(screenUI: UICanvas, pyramidExterior: Entity) {
    getUserData()
      .then((user) => (this.me = user))
      .catch((err) => log(err.message))

    this.screenUI = screenUI
    this.bus = new MessageBus()
    this.syncEntity = new Entity()
    this.syncInterval = new Interval(config.backend.syncInterval, this.syncState.bind(this))
    this.syncEntity.addComponent(this.syncInterval)
    engine.addEntity(this.syncEntity)

    this.pyramidExterior = pyramidExterior
    this.setupEntryButton()
    void this.feeProvider.init()

    this.timeLabel = new CornerLabel('', -20, 0, Color4.White())
    this.timeLabel.hide()

    this.taskLabel = new CornerLabel('', -25, 25, Color4.White())
    this.taskLabel.hide()

    this.waitingForPlayersLabel = new UIText(screenUI)
    this.waitingForPlayersLabel.hTextAlign = 'center'
    this.waitingForPlayersLabel.value = 'Waiting for players...'
    this.waitingForPlayersLabel.fontSize = 40
    this.waitingForPlayersLabel.color = Color4.Yellow()
    this.waitingForPlayersLabel.visible = false

    this.bus.on('escape:player:registered', async (user: any) => {
      const userData = await getPlayerData({ userId: user?.address })
      if (!userData) return
      new (displayAnnouncement as any)(`${userData.displayName} has joined!`, 3, Color4.Yellow())
    })
  }

  update() {
    const { x, y, z } = Camera.instance.position
    this.playerIsInScene = x > (config.scene.xMinBoundary ?? 48.12)
      && x < (config.scene.xMaxBoundary ?? 80)
      && y > (config.scene.yMinBoundary ?? 20)
      && y < (config.scene.yMaxBoundary ?? 40)
      && z > (config.scene.zMinBoundary ?? 48)
      && z < (config.scene.zMaxBoundary ?? 80)

    if (!this.playerIsInScene && !config.backend.continuousSync) {
      this.timeLabel.hide()
      this.taskLabel.hide()
      this.timerDisabled = true
    } else {
      this.timeLabel.show()
      this.taskLabel.show()
      this.timerDisabled = false
    }
  }

  async getUserGender() {
    const user = await getUserData()
    if (!user) return false
    // @ts-ignore
    return user.avatar?.bodyShape?.includes('Female') ? 'female' : 'male'
  }

  setupEntryButton() {
    this.entryButton = new Entity()
    this.entryButton.addComponentOrReplace(new PlaneShape())
    this.entryButton.addComponentOrReplace(
      new Transform({
        // position: new Vector3(0,22,100), // no parent
        position: new Vector3(0, 2, -12), // pyramidExterior parent
        rotation: Quaternion.Euler(180, 180, 0),
        scale: entryButtonScale
      })
    )

    const entryButtonTexture = new Texture('images/escape-room/PlayNow-Red.png')
    const entryButtonMaterial = new Material()
    this.entryButton.addComponentOrReplace(entryButtonMaterial)
    this.entryButton.getComponent(Material).albedoTexture = entryButtonTexture
    entryButtonMaterial.metallic = 0
    entryButtonMaterial.roughness = 1
    this.entryButton.addComponentOrReplace(entryButtonMaterial)

    this.entryButton.addComponentOrReplace(
      new OnPointerDown(
        async () => {
          if (this.players.length === config.game.playerLimit)
            return new OkPrompt('This game has the maximum number of players')

          if (this.state !== 'Registration')
            return new OkPrompt('The game is still loading, please try again in a moment')

          new OkPrompt(
            `The next signature request is to pay the ${config.fees.entryFee} Polygon MANA entry fee`,
            () => {
              void (async () => {
                try {
                  const user = await getUserData()
                  if (!user?.publicKey) return

                  const txText = new UIText(this.screenUI)
                  txText.value = 'Transaction pending...'
                  txText.fontAutoSize = true

                  const tx: any = await this.feeProvider.registerUser(user.publicKey)
                  txText.visible = false

                  log('game:tx', tx)
                  if (tx?.error || !tx?.txId) throw new Error(tx?.error || 'No transaction ID')
                  const registrationResponse = await recordUser({
                    gameId: this.id,
                    tx: tx.txId,
                    metadata: { gender: await this.getUserGender() }
                  })

                  if (!registrationResponse || registrationResponse.error)
                    throw new Error(registrationResponse?.error || 'Registration Error')

                  this.players.push(user.publicKey)
                  this.bus.emit('escape:player:registered', { address: user.publicKey })
                  // Here, the TX is complete and ready to show pyramid interior
                } catch (err: any) {
                  log('registerUser:error', err.message)
                  return new OkPrompt(err.message)
                }
              })()
            }
          )
        },
        { hoverText: 'Play' }
      )
    )

    this.entryButton.setParent(this.pyramidExterior)
    return this.entryButton
  }

  hideEntryButton() {
    this.entryButton!.getComponent(Transform).scale = Vector3.Zero()
  }

  showEntryButton() {
    this.entryButton!.getComponent(Transform).scale = entryButtonScale
  }

  updateCombination(type: string, combination: number[]) {
    this.combinations[type] = combination
  }

  completeTask(task: number) {
    if (!this.id || this.state !== 'Started') return
    void setTask(this.id, task)
  }

  async syncState() {
    if (!this.me || (!this.playerIsInScene && !config.backend.continuousSync)) return
    if (this.errorCount < 0) return
    if (this.errorCount >= config.backend.giveUp) {
      new OkPrompt('Error connecting to server. Please refresh or try again later.')
      this.errorCount = -1
    }

    try {
      this.id = this.id || (await getCurrentGameId())
      if (!this.id) return

      const game = await getGame(this.id)
      const newState = game?.state

      this.players = game?.entries ? Object.keys(game.entries) : []

      if (newState !== this.state) {
        switch (newState) {
          case 'Starting':
            // log('game starting')
            new (displayAnnouncement as any)('Game starting!', 5)
            this.hideEntryButton()
            break
          case 'Started':
            // log('game started')
            new (displayAnnouncement as any)('Game started!', 3)
            this.hideEntryButton()
            break
          case 'Finished':
            // log('game finished')
            new (displayAnnouncement as any)('Game finished!', 5)
            this.showEntryButton()
            this.id = undefined
            break
        }
      }

      this.state = newState
      this.game = game
      this.errorCount = 0

      if (this.state !== 'Registration') this.hideEntryButton()
      else this.showEntryButton()

      if (this.state === 'Registration') {
        const minutesLeft = padZero(Math.floor(game.waitTime / 1000 / 60))
        const secondsLeft = padZero(Math.floor((game.waitTime / 1000) % 60))
        this.timerDisabled = false
        if (this.players.length > 0) this.timeLabel.show()
        if (game.waitTime > 0) this.timeLabel.set(`${minutesLeft}:${secondsLeft}`)
        else this.timeLabel.hide()

        if (this.players.length > 0) {
          this.waitingForPlayersLabel.visible = true
          this.timeLabel.show()
        } else {
          this.waitingForPlayersLabel.visible = false
          this.timeLabel.set('') // .hide alone doesn't seem to doesn't work?
        }

        // @ts-ignore
        if (this.players.includes(this.me.publicKey)) {
          cancelButton.visible = true
          cancelButton.onClick = new OnPointerDown(() => {
            new OkPrompt('Are you sure you want to cancel your entry?', async () => {
              const result = await cancelEntry(this.id!)
              log('REFUND', { result })
              if (result?.error) {
                log('cancelEntry:error', result.error)
                new OkPrompt('There was an error refunding your entry. Please contact support.')
              } else {
                this.bus.emit('escape:player:unregistered', { address: this.me })
                this.timeLabel.hide()
              }
            })
          })
        } else {
          cancelButton.visible = false
        }
      } else {
        this.waitingForPlayersLabel.visible = false
        cancelButton.visible = false
      }

      if (this.state === 'Starting') {
        // log('Game starting in:', game.game_start - Date.now())
        const countdown = game.game_start - Date.now()
        const minutesLeft = padZero(Math.floor(countdown / 1000 / 60))
        const secondsLeft = padZero(Math.floor((countdown / 1000) % 60))
        this.timerDisabled = false
        this.timeLabel.show()
        if (countdown > 0) this.timeLabel.set(`${minutesLeft}:${secondsLeft}`)
        else this.timeLabel.hide()
      }

      if (this.state === 'Started') {
        const timeLeft = new Date(this.game.timeLeft)
        const minutesLeft = padZero(timeLeft.getMinutes())
        const secondsLeft = padZero(timeLeft.getSeconds())

        this.timeLabel.show()
        this.timeLabel.set(`${minutesLeft}:${secondsLeft}`)

        if (this.game.timeLeft <= 0) {
          this.timeLabel.set('')
          this.timeLabel.hide()
        }

        if (!this.game.combinations?.tiles) void setCombination(this.id!, 'tiles', this.combinations.tiles)
        if (!this.game.combinations?.figurines) void setCombination(this.id!, 'figurines', this.combinations.figurines)
        if (!this.game.combinations?.key) {
          updateKeyValues(this.combinations.key)
          void setCombination(this.id!, 'key', this.combinations.key)
        }
      }

      // @ts-ignore
      if (!['Registration', 'Starting', 'Started'].includes(this.state) || this.timerDisabled) {
        this.timeLabel.set('')
        this.timeLabel.hide()
        this.taskLabel.set('')
        this.taskLabel.hide()
      } else {
        if (this.state === 'Registration') {
          this.taskLabel.set(`Players: ${this.players.length}/${config.game.playerLimit}`)
          this.taskLabel.show()
          // @ts-ignore
          if (this.players.includes(this.me)) cancelButton.visible = true
        } else if (isNaN(this.game.task) || this.state === 'Starting') {
          this.taskLabel.set('')
          this.taskLabel.hide()
        } else {
          this.taskLabel.set(`Task ${this.game.task + 1}`)
        }

        this.taskLabel.show()
      }

      if (this.state === 'Started') {
        if (this.game.task !== this.lastTask) {
          new (displayAnnouncement as any)(`Task ${this.lastTask + 1} Completed!`, 5)
        }

        this.lastTask = this.game.task
      }
    } catch (err) {
      log(err)
      this.id = undefined
      if (this.errorCount > -1) this.errorCount++
    }

    // @ts-ignore
    if (this.players.includes(this.me?.userId)) this.hideEntryButton()
  }
}
