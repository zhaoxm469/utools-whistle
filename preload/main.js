/* eslint-disable no-unused-vars */
// https://u.tools/docs/developer/preload.html
// 可以在此文件内调用uTools 、nodejs、electron提供的api
// 开发者可以暴露自定义API供后加载脚本使用

const ip = require('./lib/ip')
const Base64 = require('./lib/base64').Base64
const QRCode = require('./lib/qrcode/qrcode')

const command = require('./command')

/**
 * 生成二维码
 */
window.getQrCode = async function() {
  const address = `${ip.address()}:8899`
  const ss = `http://${Base64.encode(address).replace(/=+$/, '')}#w2`
  const qrcode = await QRCode.toDataURL(ss)

  return {
    address,
    ss,
    qrcode
  }
}

/**
 * 检查node环境
 */
window.checkNode = async function() {
  console.log(`[LOG]: checkNode -> 开始检查 node`)
  const result = await command.exec('node -v && npm -v')
  console.log(`[LOG]: result`, result)

  if (!result.success) {
    throw new Error(
      '检测到未安装node，请安装node后重启应用。下载地址：https://nodejs.org/en/download/'
    )
  }
}

/**
 * 检查是否有安装Whistle
 */
window.whistleCheck = async function() {
  console.log(`[LOG]: whistleCheck -> 开始检查 whistle`)
  const result = await command.exec('npm list -g --depth 0')
  console.log(`[LOG]: result`, result)

  if (!result.data.includes('whistle')) {
    // await command.exec('npm install -g whistle')
    throw new Error(`检测未安装whistle，请安装后重试。https://wproxy.org/whistle/install.html`)
  }
}

/**
 * 安装Whistle
 */
window.whistleInstall = async function() {
  console.log(`[LOG]: whistleInstall -> 开始安装 whistle`)
  const result = await command.exec('npm install -g whistle')
  console.log(`[LOG]: result`, result)

  if (!result.success) {
    throw new Error('whistle安装失败，请重试。https://wproxy.org/whistle/install.html')
  }
}

/**
 * 操作whistle
 */
window.whistleControl = async function(cmd) {
  console.log(`[LOG]: whistleControl -> w2 ${cmd}`)
  const result = await command.exec(`w2 ${cmd}`)
  console.log(`[LOG]: result`, result)

  if (!result.success) {
    // await command.exec('npm install -g whistle')
    throw new Error(`${cmd} 执行失败，请重试。https://wproxy.org/whistle/install.html`)
  }
}
