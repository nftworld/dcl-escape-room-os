export default {
  backend: {
    giveUp: 20,
    syncInterval: 1000,
    continuousSync: false, // ignore whether the player is in the boundaries
    // url: 'https://example.ngrok-free.app/projectid/region' // use ngrok for local emulators (DCL requires https)
    url: 'https://region-projectid.cloudfunctions.net'
  },

  game: {
    playerLimit: 4
  },

  scene: {
    xBase: 4,
    yBase: 0,
    zBase: 4,
    xMinBoundary: 41.17,
    yMinBoundary: 0,
    zMinBoundary: 48,
    xMaxBoundary: 80,
    yMaxBoundary: 40,
    zMaxBoundary: 80,
    xRotation: 0,
    yRotation: 90,
    zRotation: 0
  },

  fees: {
    entryFee: 1, // MANA
    skip: false, // For development, paid games don't collect fees
    metaTxServer: undefined, // Define to use a custom meta tx server
    escrowAddress: '0xYOURADDRESSHERE'
  }
}
