export function createCanvas(width = 300, height = 300) {
  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height

  return {
    cxt: canvas.getContext('2d'),
    canvas
  }
}
