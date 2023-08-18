import { MultiplayerSystem } from './multiplayer'
import { displayAnnouncement } from '@dcl/ui-scene-utils'

export class TreasureBox extends Entity {
    eventName: string
    constructor(
        transform: TranformConstructorArgs,
        eventName: string,
        multiplayer: MultiplayerSystem,
    ) {
        super()
        this.addComponent(new GLTFShape('models/escape-room/Treasure_box_openclose2.glb'))
        this.addComponent(new Transform(transform))
        this.eventName = eventName
        let opened = false
        const animator = new Animator()
        this.addComponent(animator)
        const opening = new AnimationState("open", { looping: false, speed: 2 })
        animator.addClip(opening)
        const ancientEgyptianOutfit = new Entity()

        this.addComponent(
            new OnPointerDown(
                () => {
                    if (opened === false) {
                        opening.play()
                        opened = true
                        this.removeComponent(OnPointerDown)
                        ancientEgyptianOutfit.getComponent(Transform).scale = new Vector3(3,3,3)
                    }
                },
                { hoverText: 'Open Treasure Box' }
            )
        )

        const clearMaterial = new BasicMaterial()
        clearMaterial.alphaTest = 2

        const ancientEgyptianOutfitItemsScale = 2
        const ancientEgyptianOutfitScale = 0
        const ancientEgyptianOutfitScalePosXAdj = 0.5
        const ancientEgyptianOutfitScalePosZAdj = 1
        const ancientEgyptianOutfitPosXAdj = -0.25
        const ancientEgyptianOutfitPosYAdj = 0.2

        void multiplayer.getUserGender().then((gender: string | boolean) => {

            const ancientEgyptianOutfitShape = new BoxShape()
            ancientEgyptianOutfit.addComponent(ancientEgyptianOutfitShape)
            ancientEgyptianOutfit.addComponent(clearMaterial)
            ancientEgyptianOutfit.addComponentOrReplace(new Transform({
                position: new Vector3(0, 0.75, 0), //x moves front to back, z moves left to right
                rotation: Quaternion.Euler(0, 0, 0),
                scale: new Vector3(ancientEgyptianOutfitScale * ancientEgyptianOutfitScalePosXAdj, ancientEgyptianOutfitScale, 
                    ancientEgyptianOutfitScale * ancientEgyptianOutfitScalePosZAdj)
            }))
            ancientEgyptianOutfit.addComponent(
                new OnPointerDown(
                    () => {
                        ancientEgyptianOutfit.getComponent(Transform).scale = Vector3.Zero()
                        ancientEgyptianHead.getComponent(Transform).scale = Vector3.Zero()
                        ancientEgyptianUpperBody.getComponent(Transform).scale = Vector3.Zero()
                        ancientEgyptianLowerBody.getComponent(Transform).scale = Vector3.Zero()
                        ancientEgyptianFeet.getComponent(Transform).scale = Vector3.Zero()
                        new (displayAnnouncement as any)('Outfit scheduled for delivery!', 5)
                    },
                    { 
                        distance: 5, 
                        hoverText: "Collect Outfit" 
                    }
                )
            )

            ancientEgyptianOutfit.setParent(this)
            // engine.addEntity(ancientEgyptianOutfit)

            const ancientEgyptianHead = new Entity()
            let headModel = ''
            if (gender === 'male') headModel = 'models/escape-room/Ancient Egyptian Outfit/Male/AncientEgyptianMale_head.glb'
            if (gender === 'female') headModel = 'models/escape-room/Ancient Egyptian Outfit/Female/AncientEgyptianFemale_head.glb'
            const ancientEgyptianHeadShape = new GLTFShape(headModel)
            ancientEgyptianHead.addComponent(ancientEgyptianHeadShape)
            ancientEgyptianHead.addComponent(new Transform({
                position: new Vector3(3.5 + ancientEgyptianOutfitPosXAdj, 1 + ancientEgyptianOutfitPosYAdj, -0.6),
                rotation: Quaternion.Euler(-45, 0, 90),
                scale: new Vector3(ancientEgyptianOutfitItemsScale, ancientEgyptianOutfitItemsScale, ancientEgyptianOutfitItemsScale)
            }))
            // ancientEgyptianHead.isPointerBlocker = false //error
            ancientEgyptianHead.setParent(this)

            const ancientEgyptianUpperBody = new Entity()
            let upperBodyModel = ''
            if (gender === 'male') upperBodyModel = 'models/escape-room/Ancient Egyptian Outfit/Male/AncientEgyptianMale_upper_body.glb'
            if (gender === 'female') upperBodyModel = 'models/escape-room/Ancient Egyptian Outfit/Female/AncientEgyptianFemale_upper_body.glb'
            const ancientEgyptianUpperBodyShape = new GLTFShape(upperBodyModel)
            ancientEgyptianUpperBody.addComponent(ancientEgyptianUpperBodyShape)
            ancientEgyptianUpperBody.addComponent(new Transform({
                position: new Vector3(2 + ancientEgyptianOutfitPosXAdj, -0.25 + ancientEgyptianOutfitPosYAdj, 0),
                rotation: Quaternion.Euler(45, -90, 0),
                scale: new Vector3(ancientEgyptianOutfitItemsScale / 1.3, ancientEgyptianOutfitItemsScale / 1.3, ancientEgyptianOutfitItemsScale /1.3)
            }))
            ancientEgyptianUpperBody.setParent(this)

            const ancientEgyptianLowerBody = new Entity()
            let lowerBodyModel = ''
            if (gender === 'male') lowerBodyModel = 'models/escape-room/Ancient Egyptian Outfit/Male/AncientEgyptianMale_lower_body-7.glb'
            if (gender === 'female') lowerBodyModel = 'models/escape-room/Ancient Egyptian Outfit/Female/AncientEgyptianFemale_lower_body-3.glb'
            const ancientEgyptianLowerBodyShape = new GLTFShape(lowerBodyModel)
            ancientEgyptianLowerBody.addComponent(ancientEgyptianLowerBodyShape)
            ancientEgyptianLowerBody.addComponent(new Transform({
                position: new Vector3(0 + ancientEgyptianOutfitPosXAdj, 1 + ancientEgyptianOutfitPosYAdj,-1),
                rotation: Quaternion.Euler(90, 90, 90),
                scale: new Vector3(ancientEgyptianOutfitItemsScale, ancientEgyptianOutfitItemsScale, ancientEgyptianOutfitItemsScale)
            }))
            ancientEgyptianLowerBody.setParent(this)

            const ancientEgyptianFeet = new Entity()
            let feetModel = ''
            if (gender === 'male') feetModel = 'models/escape-room/Ancient Egyptian Outfit/Male/AncientEgyptianMale_feet.glb'
            if (gender === 'female') feetModel = 'models/escape-room/Ancient Egyptian Outfit/Female/AncientEgyptianFemale_feet.glb'
            const ancientEgyptianFeetShape = new GLTFShape(feetModel)
            ancientEgyptianFeet.addComponent(ancientEgyptianFeetShape)
            ancientEgyptianFeet.addComponent(new Transform({
                position: new Vector3(-0.15 + ancientEgyptianOutfitPosXAdj, 1 + ancientEgyptianOutfitPosYAdj, -0.25),
                rotation: Quaternion.Euler(0, 0, 35),
                scale: new Vector3(ancientEgyptianOutfitItemsScale, ancientEgyptianOutfitItemsScale, ancientEgyptianOutfitItemsScale)
            }))
            ancientEgyptianFeet.setParent(this)
        })
    }
}
