export class Figurine extends Entity {
  isGrabbed: boolean = false

  constructor(model: GLTFShape, transform: Transform) {
    super()
    this.addComponent(model)
    this.addComponent(transform)
  }
}
