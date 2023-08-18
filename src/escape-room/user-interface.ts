import { MultiplayerSystem } from './multiplayer'
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { TreasureBox } from './treasurebox'

export function splashScreen(escaped: boolean, screenUI: UICanvas, scene: Entity, pyramidExterior: Entity, pyramidInterior: Entity, multiplayer: MultiplayerSystem) {
    screenUI.visible = true
    let img = ''
    // let opacity=0.1
    if (escaped) {
        img = 'images/escape-room/End_Game_Success_Splash_Screen.jpg'
        // opacity=0.9
    } else {
        img = 'images/escape-room/End_Game_Fail_Splash_Screen.jpg'
    }

    const splash = new UIImage(screenUI, new Texture(img))
    const splashScale = 0.85

    splash.sourceTop = 0
    splash.sourceLeft = 0
    splash.sourceWidth = 800
    splash.sourceHeight = 800
    splash.positionY = 18
    splash.width = splash.sourceWidth * splashScale
    splash.height = splash.sourceHeight * splashScale
    splash.isPointerBlocker = true
    splash.visible = true
    // splash.opacity = opacity
    splash.onClick = new OnPointerDown(() => {
        splash.visible = false
    })

    let headlineTxt = ''

    const headline = new UIText(splash)
    headline.adaptHeight
    headline.adaptWidth
    headline.hTextAlign = "middle"
    if (escaped) {
        headlineTxt = 'You Did It!'
    } else {
        headlineTxt = 'Nice Try!'
    }
    headline.value = headlineTxt
    headline.positionY = 255
    headline.fontSize = 90
    headline.color = Color4.Yellow()
    headline.outlineWidth = 0.1
    headline.outlineColor = Color4.Yellow()

    const subheadline = new UIText(splash)
    subheadline.adaptHeight
    subheadline.adaptWidth
    subheadline.hTextAlign = "middle"
    // subheadline.value = "Dont forget to collect your treasure on the way out."
    subheadline.value = ""
    subheadline.positionY = -240
    subheadline.fontSize = 20
    subheadline.color = Color4.White()

    const thanks = new UIText(subheadline)
    thanks.adaptHeight
    thanks.adaptWidth
    thanks.hTextAlign = "middle"
    thanks.value = "Thanks for playing!"
    // thanks.positionY = -55
    thanks.positionY = 0
    thanks.fontSize = 40
    thanks.outlineWidth = 0.1
    thanks.color = Color4.Lerp(Color4.Green(), Color4.Yellow(), 0.3)

    //"Exit the tomb to collect your reward. Thanks for playing!"

    const exitTombBtn = new UIImage(splash, new Texture('images/escape-room/ExitTomb.png'))
    const exitTombBtnScale = 0.3

    exitTombBtn.sourceTop = 0
    exitTombBtn.sourceLeft = 0
    exitTombBtn.sourceWidth = 484
    exitTombBtn.sourceHeight = 167
    exitTombBtn.positionY = -300
    exitTombBtn.width = exitTombBtn.sourceWidth * exitTombBtnScale
    exitTombBtn.height = exitTombBtn.sourceHeight * exitTombBtnScale
    exitTombBtn.isPointerBlocker = true
    exitTombBtn.visible = true
    // exitTombBtn.opacity = 1
    exitTombBtn.onClick = new OnPointerDown(() => {
        const treasurebox = new TreasureBox(
            {
                position: new Vector3(3, 0, -14.25),
                rotation: Quaternion.Euler(0, 0, 0), 
                scale: new Vector3(0.5, 0.5, 0.5)
            },
            'TreasureBox',
            multiplayer
        )

        treasurebox.setParent(scene)

        void movePlayerTo({
          x: scene.getComponent(Transform).position.x-13,
          y: 1 + scene.getComponent(Transform).position.y,
          z: scene.getComponent(Transform).position.z+2
        }, {
          x: scene.getComponent(Transform).position.x-16,
          y: scene.getComponent(Transform).position.y,
          z: scene.getComponent(Transform).position.z-16
        })

        pyramidInterior.getComponent(Transform).scale = Vector3.Zero()
        pyramidExterior.getComponent(Transform).scale = Vector3.One()
        splash.visible = false
        instructionsButton.visible = false
    })

    const instructionsButton = new UIImage(screenUI, new Texture('images/escape-room/ExitTomb.png'))
    const instructionsButtonScale = 0.25

    instructionsButton.vAlign = 'top'
    instructionsButton.hAlign = "right"
    instructionsButton.positionX = "-70px"
    instructionsButton.positionY = "60px"
    instructionsButton.sourceWidth = 484
    instructionsButton.sourceHeight = 167
    instructionsButton.width = instructionsButton.sourceWidth * instructionsButtonScale
    instructionsButton.height = instructionsButton.sourceHeight * instructionsButtonScale
    instructionsButton.isPointerBlocker = true
    instructionsButton.visible = true
    instructionsButton.onClick = new OnPointerDown(() => {
        splash.visible = !splash.visible
    })
    instructionsButton.visible = true
}

export let cancelButton: UIImage
export function createCancelButton(screenUI: UICanvas) {
  cancelButton = new UIImage(screenUI, new Texture('images/escape-room/cancel.png'))
  cancelButton.sourceLeft = 0
  cancelButton.sourceTop = 0
  cancelButton.height = 200
  cancelButton.width = 200
  cancelButton.sourceWidth = 512
  cancelButton.sourceHeight = 512
  cancelButton.hAlign = 'right'
  cancelButton.vAlign = 'bottom'
  cancelButton.isPointerBlocker = true
  cancelButton.visible = false
}
