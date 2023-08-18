/* eslint-disable @typescript-eslint/ban-ts-comment */

import { movePlayerTo } from '@decentraland/RestrictedActions'
import { displayAnnouncement } from '@dcl/ui-scene-utils'
import * as Functions from '../globalfunctions'
import { Journal } from './journal'
import { KeyPieces } from './keyPieces'
import { staffThumbnail } from './inventoryui'
import { keyThumbnail } from './inventoryui'
import { uraseusThumbnail } from './inventoryui'
import { scarabThumbnail } from './inventoryui'
import { Figurine } from './figurine'
import { events, KeySolvedEvent } from './events'
import { correctKeyValues, updateKeyValues } from './keyui'
import { MultiplayerSystem } from './multiplayer'
import { createCancelButton, splashScreen } from './user-interface'
import { NPC, Dialog } from '@dcl/npc-scene-utils'
import config from './config'
// import { openUI } from './keyui'

//for WORLDs deployment: dcl deploy--target - content https://worlds-content-server.decentraland.org

//gallery 5
const scenePosX = config.scene.xBase ?? 4
const scenePosY = config.scene.yBase ?? 20
const scenePosZ = config.scene.zBase ?? 4
const sceneRotX = config.scene.xRotation ?? 0
const sceneRotY = config.scene.yRotation ?? 90
const sceneRotZ = config.scene.zRotation ?? 0

const showInterior = false

export const scene = new Entity()
scene.addComponent(
  new Transform({
    position: new Vector3(scenePosX * 16, scenePosY, (scenePosZ * 16) + 1),
    rotation: Quaternion.Euler(sceneRotX, sceneRotY, sceneRotZ),
    scale: new Vector3(1, 1, 0.965)
  })
)

// log("scene pos x: " + scene.getComponent(Transform).position.x)
// log("scene pos y: " + scene.getComponent(Transform).position.y)
// log("scene pos z: " + scene.getComponent(Transform).position.z)
engine.addEntity(scene)

let gameStartingCounter = 0
let gameStartedCounter = 0
let gameEndedCounter = 0
let task1Counter = 0
let task2Counter = 0
let task3Counter = 0
let task4Counter = 0
let task5Counter = 0
let task6Counter = 0

const pyramidExteriorScale = 1
export const pyramidExterior = new Entity()
const pyramidExteriorShape = new GLTFShape('models/escape-room/pyramidExterior-2.glb')
pyramidExterior.addComponent(pyramidExteriorShape)
pyramidExterior.addComponent(new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(pyramidExteriorScale, pyramidExteriorScale, pyramidExteriorScale)
}))
pyramidExterior.setParent(scene)

Functions.showEscapeRoomImg("", "", "images/escape-room/floor.jpg", 1, 1, 32, "", 0, -0.01, 0, 90, 0, 0, false, "floor1", scene)

if (showInterior) pyramidExterior.getComponent(Transform).scale = Vector3.Zero()

const pyramidInteriorScale = 1
export const pyramidInterior = new Entity()
const pyramidInteriorShape = new GLTFShape('models/escape-room/pyramidInterior-without-stands.glb')
pyramidInterior.addComponent(pyramidInteriorShape)
pyramidInterior.addComponent(new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(pyramidInteriorScale, pyramidInteriorScale, pyramidInteriorScale)
}))
pyramidInterior.setParent(scene)

export const screenUI = new UICanvas()

const entryButtonScaleAdj = 2
const entryButtonScale = new Vector3(2.5 * entryButtonScaleAdj, 0.75 * entryButtonScaleAdj, 0.01)

//in case user ends up outside of the interior after the game has started
const entryButton = new Entity()
entryButton.addComponentOrReplace(new PlaneShape())
entryButton.addComponentOrReplace(
  new Transform({
    position: new Vector3(0, 2, -16),
    rotation: Quaternion.Euler(180, 180, 0),
    scale: entryButtonScale
  })
)

const entryButtonTexture = new Texture('images/escape-room/playnow.png')
const entryButtonMaterial = new Material()
entryButton.addComponentOrReplace(entryButtonMaterial)
entryButton.getComponent(Material).albedoTexture = entryButtonTexture
entryButtonMaterial.metallic = 0
entryButtonMaterial.roughness = 1
entryButton.addComponentOrReplace(entryButtonMaterial)

entryButton.addComponent(
  new OnPointerDown(
    () => {
      void movePlayerTo({ x: scene.getComponent(Transform).position.x, y: 0.12 + scene.getComponent(Transform).position.y, z: scene.getComponent(Transform).position.z },
        { x: table.getComponent(Transform).position.x, y: table.getComponent(Transform).position.y, z: table.getComponent(Transform).position.z })
      // log("moved player to: " + Camera.instance.position)
      // log("looking at table: " + table.getComponent(Transform).position)
    },
    {
      button: ActionButton.ANY,
      distance: 1,
      hoverText: "Re-enter"
    }
  )
)

entryButton.setParent(pyramidInterior)

if (!showInterior) pyramidInterior.getComponent(Transform).scale = Vector3.Zero()

const placeMaterial = new Material()
placeMaterial.albedoColor = Color3.Black()
placeMaterial.metallic = 0.9
placeMaterial.roughness = 0.1

const clearMaterial = new BasicMaterial()
clearMaterial.alphaTest = 2

const fireScale = 3
const brazier1 = Functions.addFire(new Vector3(13.8, 0.8, 7.7), new Quaternion(0, 0, 0), new Vector3(fireScale, fireScale, fireScale), "brazier")
brazier1.setParent(pyramidInterior)

const brazier2 = Functions.addFire(new Vector3(14, 1.1, -7.9), new Quaternion(0, 0, 0), new Vector3(fireScale, fireScale, fireScale), "brazier")
brazier2.setParent(pyramidInterior)

const brazier3 = Functions.addFire(new Vector3(5.5, 1.6, -14.5), new Quaternion(0, 0, 0), new Vector3(fireScale, fireScale, fireScale), "brazier")
brazier3.setParent(pyramidInterior)

const brazier4 = Functions.addFire(new Vector3(-5.5, 1.6, -14.5), new Quaternion(0, 0, 0), new Vector3(fireScale, fireScale, fireScale), "brazier")
brazier4.setParent(pyramidInterior)

const brazier5 = Functions.addFire(new Vector3(-6.7, 0.85, 14.1), new Quaternion(0, 0, 0), new Vector3(fireScale, fireScale, fireScale), "brazier")
brazier5.setParent(pyramidInterior)

const brazier6 = Functions.addFire(new Vector3(6.7, 0.85, 14.1), new Quaternion(0, 0, 0), new Vector3(fireScale, fireScale, fireScale), "brazier")
brazier6.setParent(pyramidInterior)

const torch1 = Functions.addFire(new Vector3(13.6, 5, 13), new Quaternion(0, -1, 0), new Vector3(fireScale, fireScale, fireScale), "torch")
torch1.setParent(pyramidInterior)

const torch2 = Functions.addFire(new Vector3(13.6, 5, -13.5), new Quaternion(0, -1, 0), new Vector3(fireScale, fireScale, fireScale), "torch")
torch2.setParent(pyramidInterior)

const torch3 = Functions.addFire(new Vector3(-13.5, 5, 13.7), new Quaternion(0, 8, 0), new Vector3(fireScale, fireScale, fireScale), "torch")
torch3.setParent(pyramidInterior)

const torch4 = Functions.addFire(new Vector3(-13.35, 5, -14.8), new Quaternion(0, 0, 0), new Vector3(fireScale, fireScale, fireScale), "torch")
torch4.setParent(pyramidInterior)

const sarcophagusParentScale = 2
const sarcophagusParentScaleAdj = 4
const sarcophagusParent = new Entity()
sarcophagusParent.addComponent(new Transform({
  // position: new Vector3(0, 0.8, -4),
  // rotation: new Quaternion(0, 90, 90),
  position: new Vector3(0, 2.3, -14.4),
  rotation: Quaternion.Euler(0, 180, 0),
  scale: new Vector3(sarcophagusParentScale, sarcophagusParentScale, sarcophagusParentScale / sarcophagusParentScaleAdj)
}))
sarcophagusParent.setParent(pyramidInterior)

let sarcophagusTopClicks = 0
let moveSarcophagusTop = false
let sarcophagusTopFall = false

const sarcophagusTop = new Entity()
const sarcophagusTopShape = new GLTFShape('models/escape-room/sarcophagus-top.glb')
sarcophagusTop.addComponent(sarcophagusTopShape)
sarcophagusTop.addComponent(new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(1, 1, 1)
}))
sarcophagusTop.setParent(sarcophagusParent)

const sarcophagusBottom = new Entity()
const sarcophagusBottomShape = new GLTFShape('models/escape-room/sarcophagus-bottom_collider.glb')
sarcophagusBottom.addComponent(sarcophagusBottomShape)
sarcophagusBottom.addComponent(new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(1, 1, 1)
}))
sarcophagusBottom.setParent(sarcophagusParent)

const mummy = new Entity()
const mummyShape = new GLTFShape('models/escape-room/mummy_collider.glb')
mummy.addComponent(mummyShape)
mummy.addComponent(new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(1, 1, 1)
}))
mummy.setParent(sarcophagusParent)

const uraeusScale = 0.2
const uraeus = new Entity()
let uraeusShape = new GLTFShape('models/escape-room/small_sand_pile.glb')
uraeus.addComponent(uraeusShape)
uraeus.addComponent(new Transform({
  position: new Vector3(6, 0.38, 6.5),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(uraeusScale, uraeusScale, uraeusScale)
}))
uraeus.setParent(pyramidInterior)

const uraeusPlaceScale = 0.05
const uraeusPlace = new Entity()
const uraeusPlaceShape = new BoxShape()
uraeusPlace.addComponent(uraeusPlaceShape)
uraeusPlace.addComponent(new Transform({
  position: new Vector3(0, 4.22, 0.632), //z is y 
  rotation: Quaternion.Euler(-29.5, 0, 0),
  scale: new Vector3(uraeusPlaceScale, uraeusPlaceScale, uraeusPlaceScale / 5)
}))
uraeusPlace.addComponent(placeMaterial)
uraeusPlace.setParent(sarcophagusTop)

const scarabScale = 0.5
const scarab = new Entity()
const scarabShape = new GLTFShape('models/escape-room/scarab.glb')
scarab.addComponent(scarabShape)
scarab.addComponent(new Transform({
  position: new Vector3(-0.344, 3, -0.15),
  rotation: Quaternion.Euler(183.8, 90, 115),
  scale: new Vector3(0, 0, 0)
}))
scarab.setParent(mummy)

const scarabPlaceScale = 1
const scarabPlace = new Entity()
const scarabPlaceShape = new BoxShape()
scarabPlace.addComponent(scarabPlaceShape)
scarabPlace.addComponent(new Transform({
  position: new Vector3(13, 7.75, 0),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(scarabPlaceScale, scarabPlaceScale, scarabPlaceScale)
}))
scarabPlace.addComponent(clearMaterial)
scarabPlace.setParent(pyramidInterior)

const tableScale = 1
const table = new Entity()
const tableShape = new GLTFShape('models/escape-room/table.glb')
table.addComponent(tableShape)
table.addComponent(new Transform({
  position: new Vector3(5, 0, -10),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(tableScale, tableScale, tableScale)
}))
table.setParent(pyramidInterior)

const journal = new Journal(
  {
    position: new Vector3(5, 1.02, -10),
    rotation: Quaternion.Euler(0, 0, 0),
    scale: new Vector3(1, 1, 1),
  },
  'Journal'
)
journal.setParent(pyramidInterior)

let figurinesPlacedCorrectly = false
const figurinesPosY = 0.35
const figurinesPosY2 = 0.4
const Z_OFFSET = 3
const Y_OFFSET = 0.25

const anubisScale = 1.5
const anubis = new Figurine(
  new GLTFShape('models/escape-room/figurines_without_symbol/anubis.glb'),
  new Transform({
    position: new Vector3(1.0, figurinesPosY, -9.8),
    rotation: Quaternion.Euler(0, 0, 90),
    scale: new Vector3(anubisScale, anubisScale, anubisScale)
  })
)
anubis.name = "anubis"
anubis.setParent(pyramidInterior)

const raScale = 1.75
const ra = new Figurine(
  new GLTFShape('models/escape-room/figurines_without_symbol/ra.glb'),
  new Transform({
    position: new Vector3(1.8, figurinesPosY, -9.4),
    rotation: Quaternion.Euler(-90, 0, -45),
    scale: new Vector3(raScale, raScale, raScale)
  })
)
ra.name = "ra"
ra.setParent(pyramidInterior)

const horusScale = 1.75
const horus = new Figurine(
  new GLTFShape('models/escape-room/figurines_without_symbol/horus.glb'),
  new Transform({
    position: new Vector3(1.4, figurinesPosY, -9.4),
    rotation: Quaternion.Euler(0, 30, 90),
    scale: new Vector3(horusScale, horusScale, horusScale)
  })
)
horus.name = "horus"
horus.setParent(pyramidInterior)

const osirisScale = 1.75
const osiris = new Figurine(
  new GLTFShape('models/escape-room/figurines_without_symbol/osiris.glb'),
  new Transform({
    position: new Vector3(1.8, figurinesPosY, -9.4),
    rotation: Quaternion.Euler(0, 0, -90),
    scale: new Vector3(osirisScale, osirisScale, osirisScale)
  })
)
osiris.name = "osiris"
osiris.setParent(pyramidInterior)

const egyptianStatueScale = 1
const egyptianStatue = new Entity()
const egyptianStatueShape = new GLTFShape('models/escape-room/Egyptian_statue (2).glb')
egyptianStatue.addComponent(egyptianStatueShape)
egyptianStatue.addComponent(new Transform({
  position: new Vector3(1.3, 2.8, 15.25),
  rotation: new Quaternion(0, 180, 0),
  scale: new Vector3(egyptianStatueScale, egyptianStatueScale, egyptianStatueScale)
}))
egyptianStatue.setParent(pyramidInterior)

const egyptianStatue2 = new Entity()
egyptianStatue2.addComponent(egyptianStatueShape)
egyptianStatue2.addComponent(new Transform({
  position: new Vector3(-3.7, 1.9, 15.25),
  rotation: new Quaternion(0, 180, 0),
  scale: new Vector3(egyptianStatueScale, egyptianStatueScale, egyptianStatueScale)
}))
egyptianStatue2.setParent(pyramidInterior)

const falconStatueScale = 1
const falconStatue = new Entity()
const falconStatueShape = new GLTFShape('models/escape-room/Falcon_statue (1).glb')
falconStatue.addComponent(falconStatueShape)
falconStatue.addComponent(new Transform({
  position: new Vector3(-1.2, 2.35, 15.4),
  rotation: new Quaternion(0, 180, 0),
  scale: new Vector3(falconStatueScale, falconStatueScale, falconStatueScale)
}))
falconStatue.setParent(pyramidInterior)

const falconStatue2 = new Entity()
falconStatue2.addComponent(falconStatueShape)
falconStatue2.addComponent(new Transform({
  position: new Vector3(3.75, 1.875, 15.4),
  rotation: new Quaternion(0, 180, 0),
  scale: new Vector3(falconStatueScale, falconStatueScale, falconStatueScale)
}))
falconStatue2.setParent(pyramidInterior)

let correctTilesCombination = [0, 1, 0, 1, 0] //production version will be randomized
// Functions.shuffleArray(correctTilesCombination) 
// const countTilesToBePushed = correctTilesCombination.filter(x => x === 1).length
// log('Tiles combination is: ' + correctTilesCombination)

let task1Dialog: Dialog[]
let task2Dialog: Dialog[]
let task3Dialog: Dialog[]
let task4Dialog: Dialog[]
let task5Dialog: Dialog[]
let task6Dialog: Dialog[]
let task7Dialog: Dialog[]
let task7Dialogactivated = false
function createDialogs (tiles: number[], figurines: number[], key: number[]) {
  const countTilesToBePushed = tiles.filter(x => x === 1).length

  task1Dialog = [
    {
      text: "After a bit of static noise, you're able to make out something about pushing tiles."
    },
    {
      text: `Is it ${countTilesToBePushed} in, ${tiles.length - countTilesToBePushed} out? Or the other way around?`,
      isEndOfDialog: true
    }
  ]
  
  task2Dialog = [
    {
      text: "Skipping forward through a bunch of incoherent mumbo jumbo, you're able to discern that the figurines belong on top of the stands."
    },
    {
      text: "There are 4 figurines, and 4 stands. So 1 figurine per stand. But in what order?"
    },
    {
      text: "If the team agreed on a certain stand to start with, perhaps each team member could select a different figurine to put on it to test out the different combinations."
    },
    {
      text: "Why are you still standing here? Time is running out!",
      isEndOfDialog: true
    }
  ]
  
  task3Dialog = [
    {
      text: "A long silence and then finally another clue. Something about a snakes, scarabs, and a ....? The audio cuts out.",
      isEndOfDialog: true
    }
  ]
  
  // firstKeyValue = correctKeyValues[0]
  
  task4Dialog = [
    {
      text: "Wow! Did you see that laser beam? But now that it's revealed the key hole, supposedly there must be some kind of key somewhere? Did the ancient Egyptians have keys back then?"
    },
    {
      text: "Well, apparently they had laser beams, so keys arent out of the question, right? In fact they did. They were made out of wood and are called pin tumblers."
    }, {
      text: "But, is this a history lesson, or just an attempt to waste precious time on unnecessary details?"
    }, {
      text: `Your patience pays off as you learn that key tooth ${key[0]} goes in the first tooth slot. The order of the other key teeth remains a mystery.`,
      isEndOfDialog: true
    }
  ]
  
  task5Dialog = [
    {
      text: "A sarcophagus?! Who knows what might be inside. Well, I'm sure you have some guess. But how do you open it? Looks like something belongs on the head.",
    }, {
      text: "Whatever it is must be around here somewhere. Wait! What's that over there in the sand?",
      isEndOfDialog: true
    }
  ]
  
  task6Dialog = [
    {
      text: "The pharaohs of Ancient Egypt wore the uraeus as a head ornament that symbolized royalty. Adding it to the sarcophagus seems to have changed something.",
      isEndOfDialog: true
    }
  ]
  
  // task7Dialogactivated = false
  
  task7Dialog = [
    {
      text: "Hmm a scarab. Where does that belong? Wasn't there something about snakes and scarabs?",
      isEndOfDialog: true
    }
  ]

  return {
    task1Dialog,
    task2Dialog,
    task3Dialog,
    task4Dialog,
    task5Dialog,
    task6Dialog,
    task7Dialog,
  }
}

const myNPC = new NPC({ position: new Vector3(0.6, 1, 0) }, 'models/escape-room/audioRecorder2.glb', () => {
  createDialogs(
    multiplayer.game?.combinations?.tiles || correctTilesCombination,
    multiplayer.game?.combinations?.figurines || correctFigurinesCombination,
    multiplayer.game?.combinations?.key || correctKeyValues
  )

  if (multiplayer.game.task === 0) myNPC.talk(task1Dialog, 0)
  if (multiplayer.game.task === 1) myNPC.talk(task2Dialog, 0)
  if (multiplayer.game.task === 2) myNPC.talk(task3Dialog, 0)
  if (multiplayer.game.task === 3) myNPC.talk(task4Dialog, 0)
  if (multiplayer.game.task === 4) myNPC.talk(task5Dialog, 0)
  if (multiplayer.game.task === 5) myNPC.talk(task6Dialog, 0)
  if (task7Dialogactivated) myNPC.talk(task7Dialog, 0)
}, {
  onlyClickTrigger: true,
  hoverText: "Audio recorder",
  darkUI: true
})

myNPC.setParent(table)

// const recorderScale = 1
// const recorder = new Entity()
// const recorderShape = new GLTFShape('models/escape-room/audioRecorder2.glb')
// recorder.addComponent(recorderShape)
// recorder.addComponent(new Transform({
//   position: new Vector3(0.6, 1, 0),
//   rotation: new Quaternion(0, 0, 0),
//   scale: new Vector3(recorderScale, recorderScale, recorderScale)
// }))
// recorder.setParent(table)

const chaliceScale = 1
const chalice = new Entity()
const chaliceShape = new GLTFShape('models/escape-room/chalice.glb')
chalice.addComponent(chaliceShape)
chalice.addComponent(new Transform({
  position: new Vector3(1, 1, -0.2),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(chaliceScale, chaliceScale, chaliceScale)
}))
chalice.setParent(table)

const staffScale = 1.5
const staff = new Entity()
const staffShape = new GLTFShape('models/escape-room/staff-3.glb')
staff.addComponent(staffShape)

staff.addComponent(new Transform({
  position: new Vector3(-13.75, 0, 0),
  rotation: Quaternion.Euler(0, 90, 0),
  scale: new Vector3(staffScale, staffScale, staffScale)
}))

let shootRayFromStaff = false
let staffRayOfLightCounter = 0

staff.addComponent(
  new OnPointerDown(
    () => {
      if (!shootRayFromStaff && multiplayer.game.task === 2) {
        staffPlace.setParent(pyramidInterior)
        staff.getComponent(Transform).scale = Vector3.Zero()
        staffThumbnail.visible = true
        shootRayFromStaff = true
      } else {
        staffRayOfLight.getComponent(Transform).position = new Vector3(0, 1.32, 0.3)
        staffRayOfLightCounter = 0
      }
    },
    { button: ActionButton.ANY }
  )
)
staff.setParent(pyramidInterior)

const staffRayOfLightScale = 0.2
const staffRayOfLightScaleAdj = 10
const staffRayOfLight = new Entity()
const staffRayOfLightShape = new ConeShape()
staffRayOfLight.addComponent(staffRayOfLightShape)
staffRayOfLight.addComponent(new Transform({
  position: new Vector3(0, 1.32, 0.3),
  rotation: Quaternion.Euler(-90, 0, 0),
  scale: new Vector3(staffRayOfLightScale / staffRayOfLightScaleAdj, staffRayOfLightScale, staffRayOfLightScale / staffRayOfLightScaleAdj)
}))
const staffRayOfLightMaterial = new Material()
staffRayOfLightMaterial.albedoColor = new Color4(15, 0, 0)
staffRayOfLightMaterial.metallic = 0.9
staffRayOfLightMaterial.roughness = 0.1
staffRayOfLight.addComponent(staffRayOfLightMaterial)

let staffPlaced = false

const staffPlace = new Entity()
const staffPlaceScale = 2.20
const staffPlaceShape = new BoxShape()
staffPlace.addComponent(staffPlaceShape)
staffPlace.addComponent(new Transform({
  position: new Vector3(15, 3.5, 0),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(staffPlaceScale / 10, staffPlaceScale, staffPlaceScale)
}))

staffPlace.addComponent(
  new OnPointerDown(
    () => {
      staffThumbnail.visible = false
      staff.getComponent(Transform).scale = new Vector3(staffScale, staffScale, staffScale)
      staff.getComponent(Transform).position = new Vector3(15, 2.4, 0)
      staff.getComponent(Transform).rotation = new Quaternion(0, -1, 0)
      staff.getComponent(Transform).lookAt(new Vector3(-14.69, 2, 11.45))
      staffRayOfLight.setParent(staff)
      staffPlaced = true
      multiplayer.completeTask(3)
      staffPlace.getComponent(Transform).scale = Vector3.Zero()
      task3Counter++
    },
    { button: ActionButton.ANY }
  )
)

staffPlace.addComponent(placeMaterial)

const largePotScale = 1
const largePot = new Entity()
const largePotShape = new GLTFShape('models/escape-room/pot-large.glb')
largePot.addComponent(largePotShape)
largePot.addComponent(new Transform({
  position: new Vector3(12, 0, -13),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(largePotScale, largePotScale, largePotScale)
}))
largePot.setParent(pyramidInterior)
// largePot.setParent(scene)
// engine.addEntity(largePot)

const smallPotScale = 1
const smallPot = new Entity()
const smallPotShape = new GLTFShape('models/escape-room/pot-small.glb')
smallPot.addComponent(smallPotShape)
smallPot.addComponent(new Transform({
  position: new Vector3(8, 0, 14.25),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(smallPotScale, smallPotScale, smallPotScale)
}))
smallPot.setParent(pyramidInterior)
// engine.addEntity(smallPot)

const smallPot2 = new Entity()
smallPot2.addComponent(smallPotShape)
smallPot2.addComponent(new Transform({
  position: new Vector3(-13, 1.4, 6.75),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(smallPotScale, smallPotScale, smallPotScale)
}))
smallPot2.setParent(pyramidInterior)
// engine.addEntity(smallPot2)

const smallPot3 = new Entity()
smallPot3.addComponent(smallPotShape)
smallPot3.addComponent(new Transform({
  position: new Vector3(-13, 0.8, -6.75),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(smallPotScale, smallPotScale, smallPotScale)
}))
smallPot3.setParent(pyramidInterior)
// engine.addEntity(smallPot3)

//releaseSarcophagus()

export function releaseSarcophagus() {
  class SarcophagusSystem implements ISystem {
    moveAmount = 15
    moveCounter = 0
    rotateAmount = 10
    rotateCounter = 0
    tilesHidden = false
    timerCounter = 0
    onPointerComponentAdded = false

    update() {
      //log(this.timerCounter)
      if (this.timerCounter >= 40) {
        sarcophagusParent.getComponent(Transform).scale.z = sarcophagusParentScale

        if (this.moveCounter < this.moveAmount) {
          if (!this.tilesHidden) {
            //@ts-ignore
            const entity = Object.values(engine.entities)
              .find((e: Entity) => e.name === 'sarcophagus_bg_tile')
            entity.getComponent(Transform).scale = Vector3.Zero()
            //@ts-ignore
            const entity2 = Object.values(engine.entities)
              .find((e: Entity) => e.name === 'sarcophagus_top_tile')
            entity2.getComponent(Transform).scale = Vector3.Zero()

            this.tilesHidden = true
          }

          sarcophagusParent.getComponent(Transform).position.z += 0.40
          sarcophagusParent.getComponent(Transform).position.y -= 0.09
          sarcophagusParent.getComponent(Transform).rotation.z += 0.067
          this.moveCounter++
        } else {
          if (this.onPointerComponentAdded === false) {
            uraeus.addComponent(
              new OnPointerDown(
                () => {
                  uraseusThumbnail.visible = true
                  uraeus.getComponent(Transform).scale = Vector3.Zero()
                  uraeusPlace.addComponent(
                    new OnPointerDown(
                      () => {
                        multiplayer.completeTask(5)
                        uraeusPlace.getComponent(Transform).scale = Vector3.Zero()
                        uraseusThumbnail.visible = false
                        uraeusShape = new GLTFShape('models/escape-room/SnakeUraeus_sarcophagus.glb')
                        uraeus.addComponentOrReplace(uraeusShape)
                        uraeus.getComponent(Transform).position = new Vector3(0, 4.1, 0.75)
                        uraeus.getComponent(Transform).rotation = new Quaternion(0, 0, 0)
                        uraeus.getComponent(Transform).scale = new Vector3(1, 1, 1)
                        uraeus.removeComponent(OnPointerDown)
                        uraeus.setParent(sarcophagusTop)
                        sarcophagusTop.addComponent(new OnPointerDown(
                          () => {
                            sarcophagusTopClicks++
                            moveSarcophagusTop = true
                            // log("X position: " + sarcophagusTop.getComponent(Transform).position.x + '\n' + 'Y rotation: ' + sarcophagusTop.getComponent(Transform).rotation.y)
                          },
                          { button: ActionButton.ANY, distance: 8 }
                        )
                        )
                      },
                      { button: ActionButton.ANY, distance: 3 }
                    )
                  )
                },
                { button: ActionButton.ANY, distance: 2.5, hoverText: "Uraeus" }
              )
            )
          }
          this.onPointerComponentAdded = true

          engine.removeSystem(this)
        }
      }

      this.timerCounter++
    }
  }
  engine.addSystem(new SarcophagusSystem())
}

class SarcophagusTopSystem implements ISystem {
  moveAmount = 15
  moveCounter = 0
  rotateAmount = 10
  rotateCounter = 0
  timerCounter = 0

  update() {
    if (sarcophagusTopClicks === 1 && moveSarcophagusTop) {
      sarcophagusTop.getComponent(Transform).position.x -= 0.1
      scarab.getComponent(Transform).scale = new Vector3(scarabScale, scarabScale, scarabScale)
      moveSarcophagusTop = false
    }

    if (sarcophagusTopClicks === 2 && moveSarcophagusTop) {
      sarcophagusTop.getComponent(Transform).position.x -= 0.1
      moveSarcophagusTop = false
    }

    if (sarcophagusTopClicks === 3 && moveSarcophagusTop) {
      sarcophagusTop.getComponent(Transform).position.x -= 0.1
      moveSarcophagusTop = false
    }

    if (sarcophagusTopClicks === 4 && moveSarcophagusTop) {
      sarcophagusTop.getComponent(Transform).position.x -= 0.1
      moveSarcophagusTop = false
    }

    if (sarcophagusTopClicks === 5 && moveSarcophagusTop) {
      sarcophagusTop.getComponent(Transform).position.x -= 0.1
      moveSarcophagusTop = false
    }

    if (sarcophagusTopClicks === 6 && moveSarcophagusTop) {
      sarcophagusTop.getComponent(Transform).position.x -= 0.1
      moveSarcophagusTop = false
    }

    if (sarcophagusTopClicks === 7 && moveSarcophagusTop) {
      sarcophagusTop.getComponent(Transform).position.x -= 0.1
      moveSarcophagusTop = false
    }

    if (sarcophagusTopClicks === 8 && moveSarcophagusTop) {
      sarcophagusTop.getComponent(Transform).position.x -= 0.1
      moveSarcophagusTop = false
      sarcophagusTopFall = true

      task5Counter++
      sarcophagusTop.removeComponent(OnPointerDown)
      task7Dialogactivated=true
    }

    if (sarcophagusTopFall) {
      sarcophagusTop.getComponent(Transform).position.x -= 0.015
      sarcophagusTop.getComponent(Transform).rotation.y -= 0.085
      //log("X position: " + sarcophagusTop.getComponent(Transform).position.x + '\n' + 'Y rotation: ' + sarcophagusTop.getComponent(Transform).rotation.y)

      if (sarcophagusTop.getComponent(Transform).rotation.y < -3.8) {
        sarcophagusTopFall = false

        scarab.addComponent(
          new OnPointerDown(
            () => {
              scarabThumbnail.visible = true
              scarab.getComponent(Transform).scale = Vector3.Zero()
              task7Dialogactivated = true
              scarabPlace.addComponent(
                new OnPointerDown(
                  () => {
                    scarabThumbnail.visible = false
                    scarab.getComponent(Transform).position = new Vector3(13.15, 7.4, 0)
                    scarab.getComponent(Transform).rotation = new Quaternion(0, -1, 0)
                    scarab.setParent(pyramidInterior)
                    scarab.getComponent(Transform).scale = new Vector3(1.5, 1.5, scarabScale)
                    multiplayer.completeTask(6)
                    task6Counter++
                    new (displayAnnouncement as any)('You did it!', 5)
                    splashScreen(true, screenUI, scene, pyramidExterior, pyramidInterior, multiplayer)
                  },
                  { button: ActionButton.ANY }
                )
              )
            },
            { button: ActionButton.ANY }
          )
        )
        engine.removeSystem(this)
      }
    }
  }
}

let keyholeShown = false
let keypileShown = false // eslint-disable-line
engine.addSystem(new SarcophagusTopSystem())

function releaseStaff() {
  class StaffSystem implements ISystem {
    raisingStaff = true
    raiseStaffLimit = 20
    raiseStaffIncrement = 0.1
    raiseStaffCounter = 0
    staffTransformIncrement = 0.03
    staffRayOfLightStart = false
    staffRayOfLightLimit = 8
    staffRayOfLightIncrement = 0.1
    staffRayOfLightTransformIncrement = 0.3 //speed 
    // keyholeShown = false

    update() {
      if (staffPlaced) { this.staffRayOfLightStart = true }

      if (this.raisingStaff && this.raiseStaffCounter < this.raiseStaffLimit && staff.getComponent(Transform).position.y <= 2.75) {
        staff.getComponent(Transform).position.y += this.staffTransformIncrement
        this.raiseStaffCounter += this.raiseStaffIncrement
      } else {
        this.raisingStaff = false
      }

      if (this.staffRayOfLightStart) {
        if (staffRayOfLightCounter < this.staffRayOfLightLimit) {
          staffRayOfLight.getComponent(Transform).position.z += this.staffRayOfLightTransformIncrement
          staffRayOfLight.getComponent(Transform).position.y -= (this.staffRayOfLightTransformIncrement / 16)
          staffRayOfLightCounter += this.staffRayOfLightIncrement
        } else {

          if (!keyholeShown) {
            showKeyhole()
            task3Counter++
            keyholeShown = true
            keyPieces.setParent(pyramidInterior)
            keypileShown = true
          }

          //engine.removeSystem(this) 
        }

      }
    }
  }

  engine.addSystem(new StaffSystem())
}

const keyholeCoverScale = 0.5
const keyholeCover = new Entity()
const keyholeCoverShape = new PlaneShape()
keyholeCover.addComponent(keyholeCoverShape)
keyholeCover.addComponent(new Transform({
  position: new Vector3(-14.69, 2, 11.45),
  rotation: Quaternion.Euler(0, -90, 0),
  scale: new Vector3(keyholeCoverScale, keyholeCoverScale, keyholeCoverScale)
}))
const keyholeCoverMaterial = new Material()
keyholeCoverMaterial.metallic = 0
keyholeCoverMaterial.roughness = 1
keyholeCoverMaterial.albedoColor = Color3.FromHexString("#b88454")
keyholeCover.addComponent(keyholeCoverMaterial)

const keyholeScale = 0.5
export const keyhole = new Entity()
const keyholeShape = new PlaneShape()
keyhole.addComponent(keyholeShape)
keyhole.addComponent(new Transform({
  position: new Vector3(-14.69, 2, 11.45),
  rotation: Quaternion.Euler(0, -90, 0),
  scale: new Vector3(keyholeScale, keyholeScale, keyholeScale)
}))
const keyholeMaterial = new Material()
keyholeMaterial.metallic = 0
keyholeMaterial.roughness = 1
keyholeMaterial.albedoColor = Color3.FromHexString("#9e642f")
keyhole.addComponent(keyholeMaterial)

// -----------------------------------------------------------------

export const multiplayer = new MultiplayerSystem(screenUI, pyramidExterior)
engine.addSystem(multiplayer)
multiplayer.completeTask(0)
multiplayer.updateCombination('key', correctKeyValues)

// This is used to test splash screen on scene load
// splashScreen(true, screenUI, scene, pyramidExterior, pyramidInterior, multiplayer)

// @ts-ignore
if (!multiplayer.players.includes(multiplayer.me)) {
  //log("showing exterior")
  engine.addEntity(pyramidExterior)
}

const errorUIText = new UIText(screenUI)
errorUIText.value = ''
errorUIText.name = 'title'
errorUIText.width = '650px'
errorUIText.height = '800px'
errorUIText.hAlign = 'center'
errorUIText.vAlign = 'center'
errorUIText.positionY = 270
errorUIText.positionX = 0
errorUIText.fontSize = 36
errorUIText.font = new Font(Fonts.SansSerif_SemiBold)
errorUIText.vTextAlign = 'center'
errorUIText.hTextAlign = 'center'
errorUIText.color = Color4.Red()
errorUIText.visible = false

keyhole.addComponent(
  new OnPointerDown(
    () => {
      if (keyThumbnail.visible) { //the key puzzle was solved correctly
        keyThumbnail.visible = false
        void movePlayerTo({ x: 10 + scene.getComponent(Transform).position.x, y: 0.12 + scene.getComponent(Transform).position.y, z: scene.getComponent(Transform).position.z-10 },
          { x: 0, y: 1+scenePosY, z: 100 })
        // log("moved player to: " + Camera.instance.position)
        // log("looking at sarcophagus: " + sarcophagusParent.getComponent(Transform).position)
        releaseSarcophagus()
        multiplayer.completeTask(4)
        task4Counter++
        keyhole.removeComponent(OnPointerDown)
      }
    },
    {
      button: ActionButton.ANY,
      hoverText: "You don't have the key"
    }
  )
)

function showKeyhole() {
  keyhole.setParent(pyramidInterior)
  keyholeCover.setParent(pyramidInterior)

  class KeyholeCoverSystem implements ISystem {
    moveAmount = 14
    moveCounter = 0

    update() {
      if (this.moveCounter < this.moveAmount && keyholeCover.getComponent(Transform).position.z > 1) {
        keyholeCover.getComponent(Transform).position.z += 0.003
        keyholeCover.getComponent(Transform).position.x += 0.0003
        this.moveCounter += 0.1
      } else {
        engine.removeSystem(this)
        // staff.getComponent(Transform).position = new Vector3(15, 2.4, 0)
        // staff.getComponent(Transform).rotation = new Quaternion(0, -1, 0) 
      }

    }
  }

  engine.addSystem(new KeyholeCoverSystem())
}

//######################### Decorations #########################

let tileOnPointerDownsRemoved = false
const currentTileCombination = [0, 0, 0, 0, 0]

let tilesY = 2.4
const tilesYadj = 3.7
const tilesXadj = 0.25

const tile1 = Functions.showEscapeRoomImg("", "", "images/escape-room/tile1.png", 400, 400, 2.9, "", -15 + tilesXadj, tilesY, -11.6, 180, 90, 0, false, "tile1", pyramidInterior)

let tile1Pushed = false
tile1.myEntity.addComponent(
  new OnPointerDown(
    () => {
      if (!tile1Pushed) {
        tile1.myEntity.getComponent(Transform).position.x -= tilesXadj
        tile1Pushed = true
        currentTileCombination[0] = 1
        // log(currentTileCombination)
      } else {
        tile1.myEntity.getComponent(Transform).position.x += tilesXadj
        tile1Pushed = false
        currentTileCombination[0] = 0
        // log(currentTileCombination)
      }

      if (tile1.myEntity.getComponent(OnPointerDown).hoverText === "Push") {
        tile1.myEntity.getComponent(OnPointerDown).hoverText = "Unpush"
      } else {
        tile1.myEntity.getComponent(OnPointerDown).hoverText = "Push"
      }
    },
    { button: ActionButton.ANY, distance: 20, hoverText: "Push" }
  )
)

tilesY += tilesYadj

const tile2 = Functions.showEscapeRoomImg("", "", "images/escape-room/tile2.png", 400, 400, 2.9, "", -15 + tilesXadj, tilesY, -11.6, 180, 90, 0, false, "tile2", pyramidInterior)
let tile2Pushed = false
tile2.myEntity.addComponent(
  new OnPointerDown(
    () => {
      if (!tile2Pushed) {
        tile2.myEntity.getComponent(Transform).position.x -= tilesXadj
        tile2Pushed = true
        currentTileCombination[1] = 1
        // log(currentTileCombination)
      } else {
        tile2.myEntity.getComponent(Transform).position.x += tilesXadj
        tile2Pushed = false
        currentTileCombination[1] = 0
        // log(currentTileCombination)
      }

      if (tile2.myEntity.getComponent(OnPointerDown).hoverText === "Push") {
        tile2.myEntity.getComponent(OnPointerDown).hoverText = "Unpush"
      } else {
        tile2.myEntity.getComponent(OnPointerDown).hoverText = "Push"
      }
    },
    { button: ActionButton.ANY, distance: 20, hoverText: "Push" }
  )
)

tilesY += tilesYadj
const tile3 = Functions.showEscapeRoomImg("", "", "images/escape-room/tile3.png", 400, 400, 2.9, "", -15 + tilesXadj, tilesY, -11.6, 180, 90, 0, false, "tile3", pyramidInterior)
let tile3Pushed = false
tile3.myEntity.addComponent(
  new OnPointerDown(
    () => {
      if (!tile3Pushed) {
        tile3.myEntity.getComponent(Transform).position.x -= tilesXadj
        tile3Pushed = true
        currentTileCombination[2] = 1
        // log(currentTileCombination)
      } else {
        tile3.myEntity.getComponent(Transform).position.x += tilesXadj
        tile3Pushed = false
        currentTileCombination[2] = 0
        // log(currentTileCombination)
      }

      if (tile3.myEntity.getComponent(OnPointerDown).hoverText === "Push") {
        tile3.myEntity.getComponent(OnPointerDown).hoverText = "Unpush"
      } else {
        tile3.myEntity.getComponent(OnPointerDown).hoverText = "Push"
      }
    },
    { button: ActionButton.ANY, distance: 20, hoverText: "Push" }
  )
)

tilesY += tilesYadj
const tile4 = Functions.showEscapeRoomImg("", "", "images/escape-room/tile4.png", 400, 400, 2.9, "", -15 + tilesXadj, tilesY, -11.6, 180, 90, 0, false, "tile4", pyramidInterior)
let tile4Pushed = false
tile4.myEntity.addComponent(
  new OnPointerDown(
    () => {
      if (!tile4Pushed) {
        tile4.myEntity.getComponent(Transform).position.x -= tilesXadj
        tile4Pushed = true
        currentTileCombination[3] = 1
        // log(currentTileCombination)
      } else {
        tile4.myEntity.getComponent(Transform).position.x += tilesXadj
        tile4Pushed = false
        currentTileCombination[3] = 0
        // log(currentTileCombination)
      }

      if (tile4.myEntity.getComponent(OnPointerDown).hoverText === "Push") {
        tile4.myEntity.getComponent(OnPointerDown).hoverText = "Unpush"
      } else {
        tile4.myEntity.getComponent(OnPointerDown).hoverText = "Push"
      }
    },
    { button: ActionButton.ANY, distance: 20, hoverText: "Push" }
  )
)

tilesY += tilesYadj
const tile5 = Functions.showEscapeRoomImg("", "", "images/escape-room/tile5.png", 400, 400, 2.9, "", -15 + tilesXadj, tilesY, -11.6, 180, 90, 0, false, "tile5", pyramidInterior)
let tile5Pushed = false
tile5.myEntity.addComponent(
  new OnPointerDown(
    () => {
      if (!tile5Pushed) {
        tile5.myEntity.getComponent(Transform).position.x -= tilesXadj
        tile5Pushed = true
        currentTileCombination[4] = 1
        // log(currentTileCombination)
      } else {
        tile5.myEntity.getComponent(Transform).position.x += tilesXadj
        tile5Pushed = false
        currentTileCombination[4] = 0
        // log(currentTileCombination)
      }

      if (tile5.myEntity.getComponent(OnPointerDown).hoverText === "Push") {
        tile5.myEntity.getComponent(OnPointerDown).hoverText = "Unpush"
      } else {
        tile5.myEntity.getComponent(OnPointerDown).hoverText = "Push"
      }
    },
    { button: ActionButton.ANY, distance: 20,hoverText:"Push" }
  )
)

tilesY += tilesYadj

Functions.showEscapeRoomImg("", "", "images/escape-room/2snakes.jpg", 736, 887, 12, "", -15, 5.7, 0, 180, 90, 0, false, "2snakes_tile", pyramidInterior)
Functions.showEscapeRoomImg("", "", "images/escape-room/scarab.jpg", 517, 500, 4.5, "", 14, 12.5, 0, 180, 90, 0, false, "scarab_tile", pyramidInterior)
Functions.showEscapeRoomImg("", "", "images/escape-room/sarcophagus_bg.jpg", 400, 600, 9, "", 0, 6.5, -14, 180, 0, 0, false, "sarcophagus_bg_tile", pyramidInterior)
Functions.showEscapeRoomImg("", "", "images/escape-room/sarcophagus_top.png", 105, 387, 8.5, "", 0, 6.49, -13.9, 180, 0, 0, false, "sarcophagus_top_tile", pyramidInterior)

//######################### Game Sequence #########################

class GameSequenceSystem implements ISystem {
  step = 0
  timeCounter = 0

  // gameStarted = false

  update() {
    if (multiplayer.game?.combinations?.tiles) correctTilesCombination = multiplayer.game?.combinations?.tiles
    if (multiplayer.game?.combinations?.figurines) correctFigurinesCombination = multiplayer.game?.combinations?.figurines
    if (multiplayer.game?.combinations?.key) updateKeyValues(multiplayer.game?.combinations?.key)

    // @ts-ignore
    if (multiplayer.players.includes(multiplayer.me?.publicKey) && multiplayer.game?.state === 'Starting' && gameStartingCounter === 0) {
      gameStartingCounter++
      pyramidExterior.getComponent(Transform).scale = Vector3.Zero()
      pyramidInterior.getComponent(Transform).scale = Vector3.One()
      void movePlayerTo(
        { x: scene.getComponent(Transform).position.x, y: 0.12 + scene.getComponent(Transform).position.y, z: scene.getComponent(Transform).position.z },
        { x: table.getComponent(Transform).position.x, y: table.getComponent(Transform).position.y, z: table.getComponent(Transform).position.z }
      )
    }

    //user left the game and came back
    // @ts-ignore
    if (multiplayer.players.includes(multiplayer.me?.publicKey) && multiplayer.game?.state === 'Started' && gameStartedCounter === 0 && gameStartingCounter === 0) {

      gameStartedCounter++
      gameStartingCounter++
      pyramidExterior.getComponent(Transform).scale = Vector3.Zero()
      pyramidInterior.getComponent(Transform).scale = Vector3.One()
      void movePlayerTo(
        { x: scene.getComponent(Transform).position.x, y: 0.12 + scene.getComponent(Transform).position.y, z: scene.getComponent(Transform).position.z },
        { x: table.getComponent(Transform).position.x, y: table.getComponent(Transform).position.y, z: table.getComponent(Transform).position.z }
      )
    }

    // @ts-ignore
    if (multiplayer.players.includes(multiplayer.me?.publicKey) && multiplayer.game.task === 1 && task1Counter === 0) {
      task1Counter++
      showfigurineStands = true

      if (!playerMovedTiles) {
        playerMovedTiles = true
        void movePlayerTo({ x: scene.getComponent(Transform).position.x, y: 0.12 + scene.getComponent(Transform).position.y, z: scene.getComponent(Transform).position.z },
          { x: figurinePlace1.getComponent(Transform).position.x+16, y: figurinePlace1.getComponent(Transform).position.y, z: figurinePlace1.getComponent(Transform).position.z })
        // log("Tile task completed")
        
        if(!tileOnPointerDownsRemoved) {
          tile1.myEntity.removeComponent(OnPointerDown)
          tile2.myEntity.removeComponent(OnPointerDown)
          tile3.myEntity.removeComponent(OnPointerDown)
          tile4.myEntity.removeComponent(OnPointerDown)
          tile5.myEntity.removeComponent(OnPointerDown)
          tileOnPointerDownsRemoved = true
        }

          multiplayer.completeTask(1)
      }
    }

    // @ts-ignore
    if (multiplayer.players.includes(multiplayer.me?.publicKey) && multiplayer.game.task === 2 && task2Counter === 0) {
      void movePlayerTo({ x: scene.getComponent(Transform).position.x, y: 0.12 + scene.getComponent(Transform).position.y, z: scene.getComponent(Transform).position.z },
        { x: staff.getComponent(Transform).position.x, y: staff.getComponent(Transform).position.y, z: staff.getComponent(Transform).position.z })
      // log("Figurine task completed")
      releaseStaff()
      showfigurineStands = true
      figurinesPlacedCorrectly = true
      anubis.setParent(figurinePlace1)
      anubis.getComponent(Transform).position = new Vector3(0, figurinesPosY2, 0)
      anubis.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
      ra.setParent(figurinePlace2)
      ra.getComponent(Transform).position = new Vector3(0, figurinesPosY2, 0)
      ra.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
      horus.setParent(figurinePlace3)
      horus.getComponent(Transform).position = new Vector3(0, figurinesPosY2, 0)
      horus.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)
      osiris.setParent(figurinePlace4)
      osiris.getComponent(Transform).position = new Vector3(0, figurinesPosY2, 0)
      osiris.getComponent(Transform).rotation = Quaternion.Euler(0, 0, 0)

      anubis.removeComponent(OnPointerDown)
      ra.removeComponent(OnPointerDown)
      osiris.removeComponent(OnPointerDown)
      horus.removeComponent(OnPointerDown)
      figurinePlace1.removeComponent(OnPointerDown)
      figurinePlace2.removeComponent(OnPointerDown)
      figurinePlace3.removeComponent(OnPointerDown)
      figurinePlace4.removeComponent(OnPointerDown)
      task2Counter++
    }

    // @ts-ignore
    if (multiplayer.players.includes(multiplayer.me?.publicKey) && multiplayer.game.task === 3 && task3Counter === 0) {
      staffThumbnail.visible = false
      shootRayFromStaff = true
      staffRayOfLightCounter = 0

      staff.getComponent(Transform).scale = new Vector3(staffScale, staffScale, staffScale)
      staff.getComponent(Transform).position = new Vector3(15, 2.4, 0)
      staff.getComponent(Transform).rotation = new Quaternion(0, -1, 0)
      staff.getComponent(Transform).lookAt(new Vector3(-14.69, 2, 11.45))
      void movePlayerTo(
        { x: scene.getComponent(Transform).position.x, y: 0.12 + scene.getComponent(Transform).position.y, z: scene.getComponent(Transform).position.z },
        { x: 30 + scene.getComponent(Transform).position.x, y: 1 + scene.getComponent(Transform).position.y, z: 16 + scene.getComponent(Transform).position.z }
      )

      staffRayOfLight.setParent(staff) //it doesnt move
      staffPlaced = true
      staffPlace.getComponent(Transform).scale = Vector3.Zero()

      if (!keyholeShown) {
        showKeyhole()
        task3Counter++
        keyholeShown = true
        keyPieces.setParent(pyramidInterior)
        keypileShown = true
      }

      task3Counter++
    }

    // @ts-ignore
    if (multiplayer.players.includes(multiplayer.me?.publicKey) && multiplayer.game.task === 4 && task4Counter === 0) {
      task4Counter++
      keyThumbnail.visible = false
      void movePlayerTo(
        { x: 9 + scene.getComponent(Transform).position.x, y: 0.12 + scene.getComponent(Transform).position.y, z: 9 + scene.getComponent(Transform).position.z },
        { x: sarcophagusParent.getComponent(Transform).position.x + scene.getComponent(Transform).position.x, y: sarcophagusParent.getComponent(Transform).position.y + scene.getComponent(Transform).position.y, z: sarcophagusParent.getComponent(Transform).position.z + scene.getComponent(Transform).position.z }
      )

      releaseSarcophagus()
      keyPieces.removeComponent(OnPointerDown)
      keyPieces.getComponent(Transform).scale = Vector3.Zero()
      keyhole.removeComponent(OnPointerDown)
    }

    // @ts-ignore
    if (multiplayer.players.includes(multiplayer.me?.publicKey) && multiplayer.game.task === 5 && task5Counter === 0) {
      task5Counter++
      uraseusThumbnail.visible = false
      uraeusPlace.getComponent(Transform).scale = Vector3.Zero()
      uraseusThumbnail.visible = false
      uraeusShape = new GLTFShape('models/escape-room/SnakeUraeus_sarcophagus.glb')
      uraeus.addComponentOrReplace(uraeusShape)
      uraeus.getComponent(Transform).position = new Vector3(0, 4.1, 0.75)
      uraeus.getComponent(Transform).rotation = new Quaternion(0, 0, 0)
      uraeus.getComponent(Transform).scale = new Vector3(1, 1, 1)
      uraeus.setParent(sarcophagusTop)
      sarcophagusTop.addComponent(new OnPointerDown(
        () => {
          sarcophagusTopClicks++
          moveSarcophagusTop = true
          // log("X position: " + sarcophagusTop.getComponent(Transform).position.x + '\n' + 'Y rotation: ' + sarcophagusTop.getComponent(Transform).rotation.y)
        },
        { button: ActionButton.ANY, distance: 5 }
      ))
    }

    // @ts-ignore
    if (multiplayer.players.includes(multiplayer.me?.publicKey) && multiplayer.game.task === 6 && task6Counter === 0) {
      task6Counter++
      scarabThumbnail.visible = false
      scarab.getComponent(Transform).position = new Vector3(13.15, 7.4, 0)
      scarab.getComponent(Transform).rotation = new Quaternion(0, -1, 0)
      scarab.setParent(pyramidInterior)
      scarab.getComponent(Transform).scale = new Vector3(1.5, 1.5, scarabScale)
      multiplayer.timerDisabled = true
      // This splash screen shows for everyone other than the player who placed the scarab
      splashScreen(true, screenUI, scene, pyramidExterior, pyramidInterior, multiplayer)
    }

    // @ts-ignore
    if (multiplayer.players.includes(multiplayer.me?.publicKey) && multiplayer.game?.state !== 'Started' && multiplayer.game.task < 6 && task6Counter === 0 && gameEndedCounter === 0) {
      gameEndedCounter++
      splashScreen(false, screenUI, scene, pyramidExterior, pyramidInterior, multiplayer)
      multiplayer.timerDisabled = true
    }
  }
}

export const gameSequenceSystem = new GameSequenceSystem()
engine.addSystem(gameSequenceSystem)

//const keyParentScale = 0.5
export const keyPieces = new KeyPieces(
  // {
  //   position: new Vector3(14, 0, 10),
  //   rotation: new Quaternion(0, 0, 0),
  //   scale: new Vector3(keyParentScale, keyParentScale, keyParentScale)
  // },
  'play'
)

// keyPieces.setParent(pyramidInterior)

// check if any figurine is being carried or not
function isCarryingFigurine() {
  return anubis.isGrabbed || ra.isGrabbed || horus.isGrabbed || osiris.isGrabbed
}

// ########################################## Tile Game to Show Figurine Stands

// in the db it goes like this
// annubis ID = 0
// ra ID = 1
// horus ID = 2
// osiris ID = 3

// annubis ID = 1
// ra ID = 2
// horus ID = 3
// osiris ID = 4
// empty spot ID = 0

let correctFigurinesCombination = [1, 2, 3, 4]
// Functions.shuffleArray(correctFigurinesCombination)
// log("Figurines combination is: " + correctFigurinesCombination)

//figurinesCombination is [figurinePlace1,figurinePlace2,figurinePlace3,figurinePlace4]
//so current correct combination is:
// annubis on figurinePlace1
// ra on figurinePlace2
// horus on figurinePlace3
// osiris on figurinePlace4
// [0,0,0,0] means no figurines have been placed on the stands yet
// [1,2,3,0] means annubis on 1, ra on 2, osiris on 3, and nothing on 4 yet
const currentFigurinesCombination = [0, 0, 0, 0]
// log("Current figurines combo is: " + currentFigurinesCombination)

const figurineStandsScale = 1
const figurineStands = new Entity()
const figurineStandsShape = new GLTFShape('models/escape-room/stands.glb')
figurineStands.addComponent(figurineStandsShape)
figurineStands.addComponent(new Transform({
  position: new Vector3(0, -1.5, 0),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(figurineStandsScale, figurineStandsScale, figurineStandsScale)
}))
figurineStands.setParent(pyramidInterior)

const figurinePlacesScale = 1
const figurineStandsPosY = 1.1
const figurineStandsPosadj = 0.2

const figurinePlace1 = new Entity()
const figurinePlace1Shape = new BoxShape()
figurinePlace1.addComponent(figurinePlace1Shape)
figurinePlace1.addComponent(new Transform({
  position: new Vector3(-10, figurineStandsPosY, -11 + figurineStandsPosadj),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(figurinePlacesScale, figurinePlacesScale, figurinePlacesScale)
}))
figurinePlace1.addComponent(clearMaterial)
figurinePlace1.name = "figurinePlace1"
figurinePlace1.setParent(pyramidInterior)

const figurinePlace2 = new Entity()
const figurinePlace2Shape = new BoxShape()
figurinePlace2.addComponent(figurinePlace2Shape)
figurinePlace2.addComponent(new Transform({
  position: new Vector3(11.95, figurineStandsPosY, -11.2 + figurineStandsPosadj),
  rotation: new Quaternion(0, 0, 0),
  scale: new Vector3(figurinePlacesScale, figurinePlacesScale, figurinePlacesScale)
}))
figurinePlace2.addComponent(clearMaterial)
figurinePlace2.name = "figurinePlace2"
figurinePlace2.setParent(pyramidInterior)

const figurinePlace3 = new Entity()
const figurinePlace3Shape = new BoxShape()
figurinePlace3.addComponent(figurinePlace3Shape)
figurinePlace3.addComponent(new Transform({
  position: new Vector3(-11.5, figurineStandsPosY, 12.3 - figurineStandsPosadj),
  rotation: new Quaternion(0, 180, 0),
  scale: new Vector3(figurinePlacesScale, figurinePlacesScale, figurinePlacesScale)
}))
figurinePlace3.addComponent(clearMaterial)
figurinePlace3.name = "figurinePlace3"
figurinePlace3.setParent(pyramidInterior)

const figurinePlace4 = new Entity()
const figurinePlace4Shape = new BoxShape()
figurinePlace4.addComponent(figurinePlace4Shape)
figurinePlace4.addComponent(new Transform({
  position: new Vector3(10.3, figurineStandsPosY, 11.6 - figurineStandsPosadj), //z pushes toward the wall
  rotation: new Quaternion(0, 180, 0),
  scale: new Vector3(figurinePlacesScale, figurinePlacesScale, figurinePlacesScale)
}))
figurinePlace4.addComponent(clearMaterial)
figurinePlace4.name = "figurinePlace4"
figurinePlace4.setParent(pyramidInterior)

let showfigurineStands = false
let playerMovedTiles = false
let standChild: string = ""

// ----------------------------------------------------------------------------

class FigurinesSystem implements ISystem {
  // showfigurineStands = false
  onPointerComponentAdded = false
  figurineStandsPosYAdj = 0.01
  // figurinesPosY = 0.4
  // playerMovedTiles = false
  playerMovedFigurines = false


  update() {
    if (
      currentTileCombination[0] === correctTilesCombination[0] &&
      currentTileCombination[1] === correctTilesCombination[1] &&
      currentTileCombination[2] === correctTilesCombination[2] &&
      currentTileCombination[3] === correctTilesCombination[3] &&
      currentTileCombination[4] === correctTilesCombination[4]
    ) {
      showfigurineStands = true

      if (!playerMovedTiles) {

        playerMovedTiles = true
        void movePlayerTo(
          { x: scene.getComponent(Transform).position.x, y: 0.12 + scene.getComponent(Transform).position.y, z: scene.getComponent(Transform).position.z },
          { x: 16, y: 1 + scenePosY, z:  110}
        )
        multiplayer.completeTask(1)
      }

      if (!tileOnPointerDownsRemoved) {
        tile1.myEntity.removeComponent(OnPointerDown)
        tile2.myEntity.removeComponent(OnPointerDown)
        tile3.myEntity.removeComponent(OnPointerDown)
        tile4.myEntity.removeComponent(OnPointerDown)
        tile5.myEntity.removeComponent(OnPointerDown)
        tileOnPointerDownsRemoved = true
      }
      //log("Correct tile combination") 
    }

    if (showfigurineStands && figurineStands.getComponent(Transform).position.y < 0) {
      figurineStands.getComponent(Transform).position.y += this.figurineStandsPosYAdj
    }
    // log("anubis showfigurineStands:" + showfigurineStands)
    // log("anubis this.onPointerComponentAdded:" + this.onPointerComponentAdded)
    // log("anubis figurineStands.getComponent(Transform).position.y:" + figurineStands.getComponent(Transform).position.y)
    if (showfigurineStands && !this.onPointerComponentAdded && figurineStands.getComponent(Transform).position.y >= 0) {
      anubis.addComponent(
        new OnPointerDown(
          () => {
            // //@ts-ignore
            // figurineParent = Object.values(anubis.getParent())[0] 

            if (!anubis.isGrabbed) {
              if (!isCarryingFigurine()) {
                attachFigurineToAvatar(anubis)
                if (currentFigurinesCombination[0] === 1) currentFigurinesCombination[0] = 0
                if (currentFigurinesCombination[1] === 1) currentFigurinesCombination[1] = 0
                if (currentFigurinesCombination[2] === 1) currentFigurinesCombination[2] = 0
                if (currentFigurinesCombination[3] === 1) currentFigurinesCombination[3] = 0
                // log(currentFigurinesCombination)
              }
            }

            anubis.removeComponent(OnPointerDown)
          },
          {
            // hoverText: 'Anubis (figurine ID=1)',
            hoverText: 'Anubis figurine',
            distance: 5
          }
        )
      )

      ra.addComponent(
        new OnPointerDown(
          () => {
            // //@ts-ignore
            // figurineParent = Object.values(anubis.getParent)

            if (!ra.isGrabbed) {
              if (!isCarryingFigurine()) {
                attachFigurineToAvatar(ra)
                if (currentFigurinesCombination[0] === 2) currentFigurinesCombination[0] = 0
                if (currentFigurinesCombination[1] === 2) currentFigurinesCombination[1] = 0
                if (currentFigurinesCombination[2] === 2) currentFigurinesCombination[2] = 0
                if (currentFigurinesCombination[3] === 2) currentFigurinesCombination[3] = 0
                // log(currentFigurinesCombination)
              }
            }

            ra.removeComponent(OnPointerDown)
          },
          {
            // hoverText: 'Ra (figurine ID=2)',
            hoverText: 'Ra figurine',
            distance: 5
          }
        )
      )

      horus.addComponent(
        new OnPointerDown(
          () => {
            // //@ts-ignore
            // figurineParent = Object.values(anubis.getParent)

            if (!horus.isGrabbed) {
              if (!isCarryingFigurine()) {
                attachFigurineToAvatar(horus)
                if (currentFigurinesCombination[0] === 3) currentFigurinesCombination[0] = 0
                if (currentFigurinesCombination[1] === 3) currentFigurinesCombination[1] = 0
                if (currentFigurinesCombination[2] === 3) currentFigurinesCombination[2] = 0
                if (currentFigurinesCombination[3] === 3) currentFigurinesCombination[3] = 0
                // log(currentFigurinesCombination)
              }
            }

            horus.removeComponent(OnPointerDown)
          },
          {
            // hoverText: 'Horus (figurine ID=3)',
            hoverText: 'Horus figurine',
            distance: 5
          }
        )
      )

      osiris.addComponent(
        new OnPointerDown(
          () => {
            // //@ts-ignore
            // figurineParent = Object.values(anubis.getParent)

            if (!osiris.isGrabbed) {
              if (!isCarryingFigurine()) {
                attachFigurineToAvatar(osiris)
                if (currentFigurinesCombination[0] === 4) currentFigurinesCombination[0] = 0
                if (currentFigurinesCombination[1] === 4) currentFigurinesCombination[1] = 0
                if (currentFigurinesCombination[2] === 4) currentFigurinesCombination[2] = 0
                if (currentFigurinesCombination[3] === 4) currentFigurinesCombination[3] = 0
                // log(currentFigurinesCombination)
              }
            }

            osiris.removeComponent(OnPointerDown)
          },
          {
            // hoverText: 'Osiris (figurine ID=4)',
            hoverText: 'Osiris figurine',
            distance: 5
          }
        )
      )

      figurinePlace1.addComponent(
        new OnPointerDown(
          () => {
            //@ts-ignore
            standChild = Object.values(figurinePlace1.children).map(child => child.name)
            // log("standChild of figurine1 is: " + standChild)

            if (!figurinesPlacedCorrectly) {
              if (anubis.isGrabbed === true) {
                currentFigurinesCombination[0] = 1
                attachFigurineToStand(anubis, figurinePlace1)
              }
              if (ra.isGrabbed === true) {
                currentFigurinesCombination[0] = 2
                attachFigurineToStand(ra, figurinePlace1)
              }
              if (horus.isGrabbed === true) {
                currentFigurinesCombination[0] = 3
                attachFigurineToStand(horus, figurinePlace1)
              }
              if (osiris.isGrabbed === true) {
                currentFigurinesCombination[0] = 4
                attachFigurineToStand(osiris, figurinePlace1)
              }

              if (standChild === "ra") attachFigurineToAvatar(ra)
              if (standChild === "osiris") attachFigurineToAvatar(osiris)
              if (standChild === "horus") attachFigurineToAvatar(horus)
              if (standChild === "anubis") attachFigurineToAvatar(anubis)

              // log("Correct figurines combo is: " + correctFigurinesCombination)
              // log("Current figurines combo is: " + currentFigurinesCombination)
            }
          },
          {
            button: ActionButton.ANY,
            // hoverText: 'Place Figurine (stand ID=1)'
            hoverText: 'Place figurine'
          },
        )
      )
      figurinePlace1.setParent(pyramidInterior)

      figurinePlace2.addComponent(
        new OnPointerDown(
          () => {
            //@ts-ignore
            standChild = Object.values(figurinePlace2.children).map(child => child.name)
            // log("standChild of figurine2 is: " + standChild)
            if (!figurinesPlacedCorrectly) {
              if (anubis.isGrabbed === true) {
                currentFigurinesCombination[1] = 1
                attachFigurineToStand(anubis, figurinePlace2)
              }
              if (ra.isGrabbed === true) {
                currentFigurinesCombination[1] = 2
                attachFigurineToStand(ra, figurinePlace2)
              }
              if (horus.isGrabbed === true) {
                currentFigurinesCombination[1] = 3
                attachFigurineToStand(horus, figurinePlace2)
              }
              if (osiris.isGrabbed === true) {
                currentFigurinesCombination[1] = 4
                attachFigurineToStand(osiris, figurinePlace2)
              }

              if (standChild === "ra") attachFigurineToAvatar(ra)
              if (standChild === "osiris") attachFigurineToAvatar(osiris)
              if (standChild === "horus") attachFigurineToAvatar(horus)
              if (standChild === "anubis") attachFigurineToAvatar(anubis)
              // log("Correct figurines combo is: " + correctFigurinesCombination)
              // log("Current figurines combo is: " + currentFigurinesCombination)
            }
          },
          {
            button: ActionButton.ANY,
            // hoverText: 'Place Figurine (stand ID=2)'
            hoverText: 'Place figurine'
          }
        )
      )
      figurinePlace2.setParent(pyramidInterior)

      figurinePlace3.addComponent(
        new OnPointerDown(
          () => {
            //@ts-ignore
            standChild = Object.values(figurinePlace3.children).map(child => child.name)
            // log("standChild of figurine3 is: " + standChild)
            if (!figurinesPlacedCorrectly) {
              if (anubis.isGrabbed === true) {
                currentFigurinesCombination[2] = 1
                attachFigurineToStand(anubis, figurinePlace3)
              }
              if (ra.isGrabbed === true) {
                currentFigurinesCombination[2] = 2
                attachFigurineToStand(ra, figurinePlace3)
              }
              if (horus.isGrabbed === true) {
                currentFigurinesCombination[2] = 3
                attachFigurineToStand(horus, figurinePlace3)
              }
              if (osiris.isGrabbed === true) {
                currentFigurinesCombination[2] = 4
                attachFigurineToStand(osiris, figurinePlace3)
              }

              if (standChild === "ra") attachFigurineToAvatar(ra)
              if (standChild === "osiris") attachFigurineToAvatar(osiris)
              if (standChild === "horus") attachFigurineToAvatar(horus)
              if (standChild === "anubis") attachFigurineToAvatar(anubis)
              // log("Correct figurines combo is: " + correctFigurinesCombination)
              // log("Current figurines combo is: " + currentFigurinesCombination)
            }
          },
          {
            button: ActionButton.ANY,
            // hoverText: 'Place Figurine (stand ID=3)'
            hoverText: 'Place figurine'
          }
        )
      )
      figurinePlace3.setParent(pyramidInterior)

      figurinePlace4.addComponent(
        new OnPointerDown(
          () => {
            //@ts-ignore
            standChild = Object.values(figurinePlace4.children).map(child => child.name)
            // log("standChild of figurine4 is: " + standChild)
            if (!figurinesPlacedCorrectly) {
              if (anubis.isGrabbed === true) {
                currentFigurinesCombination[3] = 1
                attachFigurineToStand(anubis, figurinePlace4)
              }
              if (ra.isGrabbed === true) {
                currentFigurinesCombination[3] = 2
                attachFigurineToStand(ra, figurinePlace4)
              }
              if (horus.isGrabbed === true) {
                currentFigurinesCombination[3] = 3
                attachFigurineToStand(horus, figurinePlace4)
              }
              if (osiris.isGrabbed === true) {
                currentFigurinesCombination[3] = 4
                attachFigurineToStand(osiris, figurinePlace4)
              }

              if (standChild === "ra") attachFigurineToAvatar(ra)
              if (standChild === "osiris") attachFigurineToAvatar(osiris)
              if (standChild === "horus") attachFigurineToAvatar(horus)
              if (standChild === "anubis") attachFigurineToAvatar(anubis)
              // log("Correct figurines combo is: " + correctFigurinesCombination)
              // log("Current figurines combo is: " + currentFigurinesCombination)
              showfigurineStands = false //to prevent adding the onpointer components over and over
            }
          },
          {
            button: ActionButton.ANY,
            // hoverText: 'Place Figurine (stand ID=4)'
            hoverText: 'Place figurine'
          }
        )
      )
      figurinePlace4.setParent(pyramidInterior)

      this.onPointerComponentAdded = true
    }

    if (
      currentFigurinesCombination[0] === correctFigurinesCombination[0] &&
      currentFigurinesCombination[1] === correctFigurinesCombination[1] &&
      currentFigurinesCombination[2] === correctFigurinesCombination[2] &&
      currentFigurinesCombination[3] === correctFigurinesCombination[3]
    ) {
      // log("Congrats! All of the figurines have been placed in the correct order")

      anubis.removeComponent(OnPointerDown)
      ra.removeComponent(OnPointerDown)
      osiris.removeComponent(OnPointerDown)
      horus.removeComponent(OnPointerDown)
      figurinePlace1.removeComponent(OnPointerDown)
      figurinePlace2.removeComponent(OnPointerDown)
      figurinePlace3.removeComponent(OnPointerDown)
      figurinePlace4.removeComponent(OnPointerDown)

      if (!this.playerMovedFigurines) {
        this.playerMovedFigurines = true
        void movePlayerTo(
          { x: scene.getComponent(Transform).position.x, y: 0.12 + scene.getComponent(Transform).position.y, z: scene.getComponent(Transform).position.z },
          { x: 50, y: 1+scenePosY, z: 250 }
        )
      }

      figurinesPlacedCorrectly = true
      releaseStaff()
      multiplayer.completeTask(2)
      task2Counter++

      engine.removeSystem(this)
    }
  }
}
engine.addSystem(new FigurinesSystem())

events.addListener(KeySolvedEvent, null, () => {
  //log("solved events")
  keyThumbnail.visible = true
  keyhole.getComponent(OnPointerDown).hoverText = "Insert Key"
  keyPieces.removeComponent(OnPointerDown)
  keyPieces.getComponent(Transform).scale = Vector3.Zero()
})

function attachFigurineToAvatar(figurineEnt: Entity) {
  figurineEnt.setParent(Attachable.AVATAR)
  figurineEnt.getComponent(Transform).position = Vector3.Zero()
  figurineEnt.getComponent(Transform).rotation = Quaternion.Zero()
  figurineEnt.getComponent(Transform).position.z += Z_OFFSET
  figurineEnt.getComponent(Transform).position.y += Y_OFFSET
  isCarryingFigurine()

  //figurineEnt.isGrabbed = true //throws an error
  if (figurineEnt.name === "anubis") anubis.isGrabbed = true
  if (figurineEnt.name === "ra") ra.isGrabbed = true
  if (figurineEnt.name === "horus") horus.isGrabbed = true
  if (figurineEnt.name === "osiris") osiris.isGrabbed = true

}

function attachFigurineToStand(figurineEnt: Entity, stand: Entity) {
  if (figurineEnt.name === "anubis") anubis.isGrabbed = false
  if (figurineEnt.name === "ra") ra.isGrabbed = false
  if (figurineEnt.name === "horus") horus.isGrabbed = false
  if (figurineEnt.name === "osiris") osiris.isGrabbed = false
  figurineEnt.setParent(stand)
  figurineEnt.getComponent(Transform).position = new Vector3(0, figurinesPosY2, 0)

}

createCancelButton(screenUI)
multiplayer.updateCombination('tiles', correctTilesCombination)
multiplayer.updateCombination('figurines', correctFigurinesCombination)
