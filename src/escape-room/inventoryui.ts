export const uiCanvas = new UICanvas()

const thumbnailsPosY = "150px"

export const staffThumbnail = new UIImage(uiCanvas, new Texture("images/escape-room/staff_thumbnail.png"))
staffThumbnail.name = "staff-thumbanil-image"
staffThumbnail.width = "70px"
staffThumbnail.height = "250px"
staffThumbnail.sourceWidth = 139
staffThumbnail.sourceHeight = 500
staffThumbnail.isPointerBlocker = true
staffThumbnail.hAlign = "right"
staffThumbnail.hAlign = "right"
staffThumbnail.positionX = "-10px"
staffThumbnail.positionY = thumbnailsPosY
staffThumbnail.visible = false

export const uraseusThumbnail = new UIImage(uiCanvas, new Texture("images/escape-room/uraseus_thumbnail.png"))
uraseusThumbnail.name = "uraseus-thumbanil-image"
uraseusThumbnail.width = "213px"
uraseusThumbnail.height = "228px"
uraseusThumbnail.sourceWidth = 425
uraseusThumbnail.sourceHeight = 456
uraseusThumbnail.isPointerBlocker = true
uraseusThumbnail.hAlign = "right"
uraseusThumbnail.hAlign = "right"
uraseusThumbnail.positionX = "-10px"
uraseusThumbnail.positionY = thumbnailsPosY
uraseusThumbnail.visible = false

export const scarabThumbnail = new UIImage(uiCanvas, new Texture("images/escape-room/scarab_thumbnail.png"))
scarabThumbnail.name = "scarab-thumbanil-image"
scarabThumbnail.width = "250px"
scarabThumbnail.height = "169px"
scarabThumbnail.sourceWidth = 500
scarabThumbnail.sourceHeight = 337
scarabThumbnail.isPointerBlocker = true
scarabThumbnail.hAlign = "right"
scarabThumbnail.hAlign = "right"
scarabThumbnail.positionX = "-10px"
scarabThumbnail.positionY = thumbnailsPosY
scarabThumbnail.visible = false

export const keyThumbnail = new UIImage(uiCanvas, new Texture("images/escape-room/key_thumbnail.png"))
keyThumbnail.name = "key-thumbanil-image"
keyThumbnail.width = "250px"
keyThumbnail.height = "97px"
keyThumbnail.sourceWidth = 500
keyThumbnail.sourceHeight = 193
keyThumbnail.isPointerBlocker = true
keyThumbnail.hAlign = "right"
keyThumbnail.hAlign = "right"
keyThumbnail.positionX = "-10px"
keyThumbnail.positionY = thumbnailsPosY
keyThumbnail.visible = false
