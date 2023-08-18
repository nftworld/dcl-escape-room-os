import * as utils from '@dcl/ecs-scene-utils'
import { openUI } from './journalui'

export class Journal extends Entity {
    eventName: string
    constructor(
        transform: TranformConstructorArgs,
        eventName: string
    ) {
        super()
        this.addComponent(new GLTFShape('models/escape-room/journal.glb'))
        this.addComponent(new Transform(transform))
        this.eventName = eventName
        let opened = false

        const animator = new Animator()

        this.addComponent(animator)

        const openning = new AnimationState("opening", { looping: false, speed: 2 })

        animator.addClip(openning)

        //engine.addEntity(this)
        
        this.addComponent(
            new OnPointerDown(
                () => {
                    if (opened === false) {
                        openning.play()
                        utils.setTimeout(3200, () => {
                            openUI(eventName).catch((error) => log(error))
                            opened = true
                        })
                    } else {
                        openUI(eventName).catch((error) => log(error))
                    }
                },
                { hoverText: 'View Journal' }
            )
        )
    }
}
