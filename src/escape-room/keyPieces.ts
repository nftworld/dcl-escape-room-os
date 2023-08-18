import { openUI } from './keyui'

export class KeyPieces extends Entity {
  eventName: string
  constructor(
    //transform: TranformConstructorArgs,
    eventName: string
  ) {
    super()
    //engine.addEntity(this)
    this.addComponent(new GLTFShape('models/escape-room/key/key_pile.glb'))
    //this.addComponent(new Transform(transform)) //passed from game.ts call
    this.addComponent(new Transform({
      position: new Vector3(14, 0.075, 10),   
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(0.25,0.25,0.25) 
    }))
    this.eventName = eventName
    this.addComponent(
      new OnPointerDown(
        () => {
          openUI(eventName).catch((error) => log(error))
          //log('OPENED KEY PUZZLE')
        },
        { hoverText: 'Reconstruct Key' }
      )
    ) 

    // const keyHandle = new Entity()
    // const keyHandleShape = new GLTFShape('models/escape-room/key_handle.glb')
    // keyHandle.addComponent(keyHandleShape)
    // keyHandle.addComponent(new Transform({
    //   position: new Vector3(0, 1, 0),
    //   rotation: new Quaternion(50, -10, 30)
    // }))
    // keyHandle.setParent(this) 

    // const keyHoles = new Entity()
    // const keyHolesShape = new GLTFShape('models/escape-room/key_holes.glb')
    // keyHoles.addComponent(keyHolesShape)
    // keyHoles.addComponent(new Transform({
    //   position: new Vector3(-0.5, -0.5, 0),
    //   rotation: new Quaternion(0, 30, 0)
    // }))
    // keyHoles.setParent(this)

    // const keyTooth1 = new Entity()
    // const keyTooth1Shape = new GLTFShape('models/escape-room/key_tooth_1.glb')
    // keyTooth1.addComponent(keyTooth1Shape)
    // keyTooth1.addComponent(new Transform({
    //   position: new Vector3(-1, -3.5, 0.4),
    //   rotation: new Quaternion(0, 1, 1)
    // }))
    // keyTooth1.setParent(this)

    // const keyTooth2 = new Entity()
    // const keyTooth2Shape = new GLTFShape('models/escape-room/key_tooth_2.glb')
    // keyTooth2.addComponent(keyTooth2Shape)
    // keyTooth2.addComponent(new Transform({
    //   position: new Vector3(-2, -3.9, 1),
    //   rotation: new Quaternion(0, 0, 1)
    // }))
    // keyTooth2.setParent(this)

    // const keyTooth3 = new Entity()
    // const keyTooth3Shape = new GLTFShape('models/escape-room/key_tooth_3.glb')
    // keyTooth3.addComponent(keyTooth3Shape)
    // keyTooth3.addComponent(new Transform({
    //   position: new Vector3(-4, -2, 1.5), 
    //   rotation: new Quaternion(0, 0.1, 0.25)
    // }))
    // keyTooth3.setParent(this)

    // const keyTooth4 = new Entity()
    // const keyTooth4Shape = new GLTFShape('models/escape-room/key_tooth_4.glb')
    // keyTooth4.addComponent(keyTooth4Shape)
    // keyTooth4.addComponent(new Transform({
    //   position: new Vector3(-2.3, 0, -0.2),
    //   rotation: Quaternion.Euler(60, 0, 0)
    // }))
    // keyTooth4.setParent(this)

    // const keyTooth5 = new Entity()
    // const keyTooth5Shape = new GLTFShape('models/escape-room/key_tooth_5.glb')
    // keyTooth5.addComponent(keyTooth5Shape)
    // keyTooth5.addComponent(new Transform({
    //   position: new Vector3(-2.7, -0.7, 0),
    //   rotation: Quaternion.Euler(-60, -20, 60)
    // }))
    // keyTooth5.setParent(this)
  }
}
