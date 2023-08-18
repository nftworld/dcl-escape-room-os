import * as utils from '@dcl/ecs-scene-utils'
import { events, KeySolvedEvent } from './events'
// import * as Functions from '../globalfunctions'

export const screenSpaceUI = new UICanvas()
screenSpaceUI.visible = true

const closeBtnTexture = new Texture('images/escape-room/key/close.png')
const blankKeyHoleTexture = new Texture('images/escape-room/key/blank_hole.png')
const key1Texture = new Texture('images/escape-room/key/key1.png')
const key2Texture = new Texture('images/escape-room/key/key2.png')
const key3Texture = new Texture('images/escape-room/key/key3.png')
const key4Texture = new Texture('images/escape-room/key/key4.png')
const key5Texture = new Texture('images/escape-room/key/key5.png')
const keyPiece1Texture = new Texture('images/escape-room/key/key_piece_1.png')
const keyPiece2Texture = new Texture('images/escape-room/key/key_piece_2.png')
const keyPiece3Texture = new Texture('images/escape-room/key/key_piece_3.png')
const keyPiece4Texture = new Texture('images/escape-room/key/key_piece_4.png')
const keyPiece5Texture = new Texture('images/escape-room/key/key_piece_5.png')
const scaleMultiplier = 0.8

let selectedCount = 0
let selectedKeys:any = []

export let correctKeyValues = [1, 2, 3, 4, 5] // these numbers will be randomized in production
// Functions.shuffleArray(correctKeyValues)
// log("Key combination is: " + correctKeyValues)
export function updateKeyValues(newCombo: number[]) { correctKeyValues = newCombo }

const keyPositions = [-272, -228, -184, -138, -92]

export async function openUI(event: string) { // eslint-disable-line
    background.visible = true
    background.isPointerBlocker = true
    blankKeyHole.visible = true
    keyPiece1.visible = false
    keyPiece2.visible = false
    keyPiece3.visible = false
    keyPiece4.visible = false
    keyPiece5.visible = false
    keyTooth1.visible = true
    keyTooth2.visible = true
    keyTooth3.visible = true
    keyTooth4.visible = true
    keyTooth5.visible = true
    resultText.visible = false
    selectedCount = 0
    selectedKeys = []

    keyTooth1.onClick = new OnPointerDown(() => {
        //log('key tooth1 clicked')
        keyPiece1.positionX = keyPositions[selectedCount]
        keyPiece1.visible = true
        selectedKeys.push(1)
        selectedCount++
        updateKeyHoles()
        keyTooth1.visible = false
    })

    keyTooth2.onClick = new OnPointerDown(() => {
        //log('key tooth2 clicked')
        keyPiece2.positionX = keyPositions[selectedCount]
        keyPiece2.visible = true
        selectedKeys.push(2)
        selectedCount++
        updateKeyHoles()
        keyTooth2.visible = false
    })

    keyTooth3.onClick = new OnPointerDown(() => {
        //log('key tooth3 clicked')
        keyPiece3.positionX = keyPositions[selectedCount]
        keyPiece3.visible = true
        selectedKeys.push(3)
        selectedCount++
        updateKeyHoles()
        keyTooth3.visible = false
    })

    keyTooth4.onClick = new OnPointerDown(() => {
        //log('key tooth4 clicked')
        keyPiece4.positionX = keyPositions[selectedCount]
        keyPiece4.visible = true
        selectedKeys.push(4)
        selectedCount++
        updateKeyHoles()
        keyTooth4.visible = false
    })

    keyTooth5.onClick = new OnPointerDown(() => {
        //log('key tooth5 clicked')
        keyPiece5.positionX = keyPositions[selectedCount]
        keyPiece5.visible = true
        selectedKeys.push(5)
        selectedCount++
        updateKeyHoles()
        keyTooth5.visible = false
    })

    CloseButton.onClick = new OnPointerDown(() => {
        closeUI()
    })
}

export function closeUI() {
    background.visible = false
    background.isPointerBlocker = false
}

export const background = new UIContainerRect(screenSpaceUI)
background.name = 'background'
background.width = 1380 * scaleMultiplier
background.height = 821 * scaleMultiplier
background.hAlign = 'center'
background.vAlign = 'center'
background.visible = false
background.isPointerBlocker = false
background.color = Color4.White()

export const headerText = new UIText(background) 
headerText.value = 'RECONSTRUCT KEY'
headerText.name = 'title'
headerText.width = '650px'
headerText.height = '800px'
headerText.hAlign = 'center'
headerText.vAlign = 'center'
headerText.positionY = 270
headerText.positionX = 0
headerText.fontSize = 36
headerText.font = new Font(Fonts.SansSerif_SemiBold)
headerText.vTextAlign = 'center'
headerText.hTextAlign = 'center'
headerText.color = Color4.Purple()

export const subText = new UIText(background) 
subText.value = 'Arrange the key teeth correctly in order to reconstruct the key'
subText.name = 'guide'
subText.width = '950px'
subText.height = '800px'
subText.hAlign = 'center'
subText.vAlign = 'center'
subText.positionY = 230
subText.positionX = 0
subText.fontSize = 24
subText.font = new Font(Fonts.SansSerif)
subText.vTextAlign = 'center'
subText.hTextAlign = 'center'
subText.color = Color4.Blue()

export const leftContainer = new UIContainerRect(background)
leftContainer.name = 'leftContainer'
leftContainer.width = 900 * scaleMultiplier
leftContainer.height = 600 * scaleMultiplier
leftContainer.hAlign = 'center'
leftContainer.vAlign = 'center'
leftContainer.positionX = -140
leftContainer.positionY = -60

export const blankKeyHole = new UIImage(leftContainer, blankKeyHoleTexture)
blankKeyHole.name = 'blankKeyHole-0'
blankKeyHole.width = 864 * scaleMultiplier
blankKeyHole.height = 760 * scaleMultiplier
blankKeyHole.hAlign = 'center'
blankKeyHole.vAlign = 'center'
blankKeyHole.positionX = 0
blankKeyHole.positionY = 80
blankKeyHole.sourceHeight = 1080
blankKeyHole.sourceWidth = 1296

export const keyPiece1 = new UIImage(blankKeyHole, keyPiece1Texture)
keyPiece1.name = 'keyPiece1'
keyPiece1.width = 40 * scaleMultiplier
keyPiece1.height = 88 * scaleMultiplier
keyPiece1.hAlign = 'center'
keyPiece1.vAlign = 'center'
keyPiece1.positionX = -272
keyPiece1.positionY = 0
keyPiece1.sourceHeight = 99
keyPiece1.sourceWidth = 45

export const keyPiece2 = new UIImage(blankKeyHole, keyPiece2Texture)
keyPiece2.name = 'keyPiece2'
keyPiece2.width = 40 * scaleMultiplier
keyPiece2.height = 99 * scaleMultiplier
keyPiece2.hAlign = 'center'
keyPiece2.vAlign = 'center'
keyPiece2.positionX = -228
keyPiece2.positionY = 0
keyPiece2.sourceHeight = 136
keyPiece2.sourceWidth = 55

export const keyPiece3 = new UIImage(blankKeyHole, keyPiece3Texture)
keyPiece3.name = 'keyPiece3'
keyPiece3.width = 40 * scaleMultiplier
keyPiece3.height = 130 * scaleMultiplier
keyPiece3.hAlign = 'center'
keyPiece3.vAlign = 'center'
keyPiece3.positionX = -184
keyPiece3.positionY = 0
keyPiece3.sourceHeight = 147
keyPiece3.sourceWidth = 71

export const keyPiece4 = new UIImage(blankKeyHole, keyPiece4Texture)
keyPiece4.name = 'keyPiece4'
keyPiece4.width = 40 * scaleMultiplier
keyPiece4.height = 120 * scaleMultiplier
keyPiece4.hAlign = 'center'
keyPiece4.vAlign = 'center'
keyPiece4.positionX = -138
keyPiece4.positionY = 0
keyPiece4.sourceHeight = 157
keyPiece4.sourceWidth = 57

export const keyPiece5 = new UIImage(blankKeyHole, keyPiece5Texture)
keyPiece5.name = 'keyPiece5'
keyPiece5.width = 40 * scaleMultiplier
keyPiece5.height = 90 * scaleMultiplier
keyPiece5.hAlign = 'center'
keyPiece5.vAlign = 'center'
keyPiece5.positionX = -92
keyPiece5.positionY = 0
keyPiece5.sourceHeight = 136
keyPiece5.sourceWidth = 57

export const rightContainer = new UIContainerRect(background)
rightContainer.name = 'rightContainer'
rightContainer.width = 300 * scaleMultiplier
rightContainer.height = 600 * scaleMultiplier
rightContainer.hAlign = 'center'
rightContainer.vAlign = 'center'
rightContainer.positionX = 380
rightContainer.positionY = -60

// Create Key Teeth and Names

export const keyTooth1 = new UIImage(rightContainer, key1Texture)
keyTooth1.name = 'KeyTooth1'
keyTooth1.width = 300 * scaleMultiplier
keyTooth1.height = 100 * scaleMultiplier
keyTooth1.vAlign = 'center'
keyTooth1.hAlign = 'center'
keyTooth1.positionX = 0
keyTooth1.positionY = 200
keyTooth1.sourceHeight = 200
keyTooth1.sourceWidth = 600
keyTooth1.isPointerBlocker = true

export const keyTooth2 = new UIImage(rightContainer, key2Texture)
keyTooth2.name = 'KeyTooth2'
keyTooth2.width = 300 * scaleMultiplier
keyTooth2.height = 100 * scaleMultiplier
keyTooth2.hAlign = 'center'
keyTooth2.vAlign = 'center'
keyTooth2.positionX = 0
keyTooth2.positionY = 100
keyTooth2.sourceHeight = 200
keyTooth2.sourceWidth = 600
keyTooth2.isPointerBlocker = true

export const keyTooth3 = new UIImage(rightContainer, key3Texture)
keyTooth3.name = 'KeyTooth3'
keyTooth3.width = 300 * scaleMultiplier
keyTooth3.height = 100 * scaleMultiplier
keyTooth3.hAlign = 'center'
keyTooth3.vAlign = 'center'
keyTooth3.positionX = 0
keyTooth3.positionY = 0
keyTooth3.sourceHeight = 200
keyTooth3.sourceWidth = 600
keyTooth3.isPointerBlocker = true

export const keyTooth4 = new UIImage(rightContainer, key4Texture)
keyTooth4.name = 'KeyTooth4'
keyTooth4.width = 300 * scaleMultiplier
keyTooth4.height = 100 * scaleMultiplier
keyTooth4.hAlign = 'center'
keyTooth4.vAlign = 'center'
keyTooth4.positionX = 0
keyTooth4.positionY = -100
keyTooth4.sourceHeight = 200
keyTooth4.sourceWidth = 600
keyTooth4.isPointerBlocker = true

export const keyTooth5 = new UIImage(rightContainer, key5Texture)
keyTooth5.name = 'KeyTooth5'
keyTooth5.width = 300 * scaleMultiplier
keyTooth5.height = 100 * scaleMultiplier
keyTooth5.hAlign = 'center'
keyTooth5.vAlign = 'center'
keyTooth5.positionX = 0
keyTooth5.positionY = -200
keyTooth5.sourceHeight = 200
keyTooth5.sourceWidth = 600
keyTooth5.isPointerBlocker = true

export const resultText = new UIText(leftContainer) 
resultText.value = 'Wrong! Please Try again.'
resultText.name = 'result'
resultText.width = '650px'
resultText.height = '80px'
resultText.hAlign = 'center'
resultText.vAlign = 'center'
resultText.positionY = -100
resultText.positionX = 0
resultText.fontSize = 36
resultText.font = new Font(Fonts.SansSerif_SemiBold)
resultText.adaptHeight
resultText.adaptWidth
resultText.vTextAlign = 'center'
resultText.hTextAlign = 'center'
resultText.color = Color4.Red()

export const CloseButton = new UIImage(background, closeBtnTexture)
CloseButton.name = 'CloseButton'
CloseButton.width = 80 * scaleMultiplier
CloseButton.height = 68 * scaleMultiplier
CloseButton.hAlign = 'center'
CloseButton.vAlign = 'center'
CloseButton.positionY = 310
CloseButton.positionX = 590
CloseButton.sourceWidth = 200
CloseButton.sourceHeight = 170


// Update key holes image when clicking the key tooth
function updateKeyHoles() {
    //log('Selected Key Count ', selectedCount)

    if (selectedCount === 5) {
        const result = checkResult()
        if (result) {
            
            resultText.value = 'Success! You may now use the key'
            resultText.color = Color4.Green()
            resultText.visible = true
            resultText.adaptHeight
            resultText.adaptWidth
            resultText.vTextAlign = 'center'
            resultText.hTextAlign = 'center' 

            events.fireEvent(new KeySolvedEvent())
        } else {
            resultText.value = 'Wrong combination. Please try again'   
            resultText.color = Color4.Red()
            resultText.visible = true

            utils.setTimeout(1000, () => {
                blankKeyHole.visible = true
                keyPiece1.visible = false
                keyPiece2.visible = false
                keyPiece3.visible = false
                keyPiece4.visible = false
                keyPiece5.visible = false

                keyTooth1.visible = true
                keyTooth2.visible = true
                keyTooth3.visible = true
                keyTooth4.visible = true
                keyTooth5.visible = true

                selectedCount = 0
                selectedKeys = []

                resultText.visible = false
            })
        }
    }
}

function checkResult() {
    for (let i = 0; i < 5; i++) {
        if (correctKeyValues[i] !== selectedKeys[i]) {
            return false
        }
    }
    return true
}
