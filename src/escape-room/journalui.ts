export const screenSpaceUI = new UICanvas()
screenSpaceUI.visible = true

let UIOpenTime:any

const leftBtnTexture = new Texture('images/escape-room/left_btn.png')
const rightBtnTexture = new Texture('images/escape-room/right_btn.png')
const leftPageTexture = new Texture('images/escape-room/left_page.png')
const rightPageTexture = new Texture('images/escape-room/right_page.png')
const closeBtnTexture = new Texture('images/escape-room/close.png')
const page1Texture = new Texture('images/escape-room/journal/page1.png')
const page2Texture = new Texture('images/escape-room/journal/page2.png')
const page3Texture = new Texture('images/escape-room/journal/page3.png')
const page4Texture = new Texture('images/escape-room/journal/page4.png')
const page5Texture = new Texture('images/escape-room/journal/page5.png')
const page6Texture = new Texture('images/escape-room/journal/page6.png')
const scaleMultiplier = 0.8

export async function openUI(event: string) { // eslint-disable-line
    UIOpenTime = +Date.now()
    background.visible = true
    background.isPointerBlocker = true
    let journalPage = 1

    const allSignatures = [{
        left: page1Texture,
        right: page2Texture
    },
        {
            left: page3Texture,
            right: page4Texture
        },
        {
            left: page5Texture,
            right: page6Texture
        }]
    const totalPages = displaySignatures(allSignatures, journalPage)

    //log('On page ', journalPage, ' of ', totalPages)

    if (totalPages < 2) {
        LastButton.visible = false
        NextButton.visible = false
    } else {
        LastButton.visible = false
        NextButton.visible = true
    }

    NextButton.onClick = new OnPointerDown(async () => {
        journalPage += 1

        displaySignatures(allSignatures, journalPage)
        LastButton.visible = true
        if (journalPage >= totalPages) {
            NextButton.visible = false
        }
    })

    LastButton.onClick = new OnPointerDown(async () => {
        journalPage -= 1
        if (journalPage < 1) {
            journalPage = 1
        }
        displaySignatures(allSignatures, journalPage)
        NextButton.visible = true
        if (journalPage === 1) {
            LastButton.visible = false
        }
    })

    CloseButton.onClick = new OnPointerDown(async () => {
        closeUI()
    })
}

export function closeUI() {
    background.visible = false
    background.isPointerBlocker = false
}

export const background = new UIContainerRect(screenSpaceUI)
background.name = 'background'
background.width = 1480 * scaleMultiplier
background.height = 921 * scaleMultiplier
background.hAlign = 'center'
background.vAlign = 'center'
background.visible = false
background.isPointerBlocker = false

export const rightContainer = new UIImage(background, rightPageTexture)
rightContainer.name = 'rightContainer'
rightContainer.width = 700 * scaleMultiplier
rightContainer.height = 800 * scaleMultiplier
rightContainer.hAlign = 'center'
rightContainer.vAlign = 'center'
rightContainer.positionY = 20
rightContainer.positionX = 277
rightContainer.sourceWidth = 230
rightContainer.sourceHeight = 330

export const leftContainer = new UIImage(background, leftPageTexture)
leftContainer.name = 'leftContainer'
leftContainer.width = 700 * scaleMultiplier
leftContainer.height = 800 * scaleMultiplier
leftContainer.hAlign = 'center'
leftContainer.vAlign = 'center'
leftContainer.positionY = 20
leftContainer.positionX = -280
leftContainer.sourceWidth = 230
leftContainer.sourceHeight = 330

export const signaturesLeftUI = new UIImage(leftContainer, page1Texture)
signaturesLeftUI.name = 'leftSignatures'
signaturesLeftUI.width = 700 * scaleMultiplier
signaturesLeftUI.height = 800 * scaleMultiplier
signaturesLeftUI.hAlign = 'center'
signaturesLeftUI.vAlign = 'center'
signaturesLeftUI.positionY = 0
signaturesLeftUI.positionX = 0
signaturesLeftUI.sourceWidth = 499
signaturesLeftUI.sourceHeight = 566

export const signaturesRightUI = new UIImage(rightContainer, page2Texture)
signaturesRightUI.name = 'rightSignatures'
signaturesRightUI.width = 700 * scaleMultiplier
signaturesRightUI.height = 800 * scaleMultiplier
signaturesRightUI.hAlign = 'center'
signaturesRightUI.vAlign = 'center'
signaturesRightUI.positionY = 0
signaturesRightUI.positionX = 0
signaturesRightUI.sourceWidth = 499
signaturesRightUI.sourceHeight = 566

export const NextButton = new UIImage(background, rightBtnTexture)
NextButton.name = 'NextButton'
NextButton.width = 76 * scaleMultiplier
NextButton.height = 76 * scaleMultiplier
NextButton.hAlign = 'center'
NextButton.vAlign = 'center'
NextButton.positionY = 0
NextButton.positionX = 600
NextButton.sourceWidth = 75
NextButton.sourceHeight = 75

export const LastButton = new UIImage(background, leftBtnTexture)
LastButton.name = 'LastButton'
LastButton.width = 76 * scaleMultiplier
LastButton.height = 76 * scaleMultiplier
LastButton.hAlign = 'center'
LastButton.vAlign = 'center'
LastButton.positionY = 0
LastButton.positionX = -600
LastButton.sourceWidth = 75
LastButton.sourceHeight = 75

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

// arrange all signatures into pages
function displaySignatures(allSignatures: any[], journalPage: number) {
    signaturesLeftUI.source = allSignatures[journalPage - 1].left
    signaturesRightUI.source = allSignatures[journalPage - 1].right
    log(
        'signature to show from page ',
        journalPage,
        ' :',
        journalPage - 1
    )

    return allSignatures.length
}

// Instance the input object
const input = Input.instance

//button down event
input.subscribe('BUTTON_DOWN', ActionButton.POINTER, false, () => {
    const currentTime = +Date.now()
    let isOpen: boolean
    if (background.visible) {
        isOpen = true
    } else {
        isOpen = false
    }

    if (isOpen && currentTime - UIOpenTime > 100) {
        closeUI()
    }
})
