const fs = require('fs')

function Main (get) {
  ImportScript('Event', get)
}

function ImportScript (dir, get) {
  const ev = fs.readdirSync(dir)
  for (let i = 0; i < ev.length; i++) {
    const file = ev[i]
    if (file.replace(/.*\./gi, '') === 'js') {
      const temp = (require(`../${dir}/${ev[i]}`))
      get.SignalEvent[temp.index] = temp.func
      console.log(`   load - ../${dir}/${ev[i]}`.replace('../', ''))
    }

    if (file.match(/.*\./gi) == null) ImportScript(dir + '/' + ev[i])
  }
}

module.exports = Main
