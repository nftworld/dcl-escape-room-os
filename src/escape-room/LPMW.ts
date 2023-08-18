import { scene } from './game'

const myEntity = new Entity()
const plane = new PlaneShape()
plane.withCollisions = false
myEntity.addComponent(plane)
myEntity.setParent(scene)
myEntity.addComponent(
    new OnPointerDown(() => {
        openExternalURL("https://www.lowpolymodelsworld.com/")
    })
)
myEntity.addComponent(new Billboard())
const myEntityTransform = new Transform({
    position: new Vector3(16.75, 0.575, -16),
    scale: new Vector3(1.2, 1.2, 1.2)
})
myEntity.addComponent(myEntityTransform)

const myTexture = new Texture("images/lowpolymodelsworld/LPMcircle-blueWhite-blackBG-alt_for_billboard.png")
const myMaterial = new Material()
myMaterial.albedoTexture = myTexture
myMaterial.metallic = 0
myMaterial.roughness = 1
myEntity.addComponent(myMaterial)

const myEntity2 = new Entity()
const plane2 = new PlaneShape()
plane2.withCollisions = false
myEntity2.addComponent(plane2)
myEntity2.setParent(scene)
myEntity2.addComponent(
    new OnPointerDown(() => {
        openExternalURL("https://www.lowpolymodelsworld.com/")
    })
)
myEntity2.addComponent(new Billboard())
const myEntityTransform2 = new Transform({
    position: new Vector3(-16.5, 0.6, -16),
    scale: new Vector3(1.2, 1.2, 1.2)
})
myEntity2.addComponent(myEntityTransform2)

const myTexture2 = new Texture("images/lowpolymodelsworld/LPMcircle-blueWhite-blackBG-alt_for_billboard.png")
const myMaterial2 = new Material()
myMaterial2.albedoTexture = myTexture2
myMaterial2.metallic = 0
myMaterial2.roughness = 1
myEntity2.addComponent(myMaterial2)
