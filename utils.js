function intToHex(int) {
  let str_int = int.toString()
  let hexString = "#000000"
  hexString = hexString.substring(0, hexString.length-str_int.length)
  return hexString + str_int
}

function rgbToInt(r, g, b) {
  let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  hex = hex.replace('#', '')
  return parseInt(hex)
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return [x, y]
  
}

//this is magic idk
function getIntSuffix(int) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const number = int % 100
  return int + (suffixes[(number - 20) % 10] ?? suffixes[number] ?? suffixes[0])
}

function sortNumber(array) {
    return array.sort((a, b) => a - b);
}

export {intToHex, rgbToInt, getCursorPosition, getIntSuffix, sortNumber}