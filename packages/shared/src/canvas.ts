export function createCanvas(width = 300, height = 300) {
  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height

  return {
    cxt: canvas.getContext('2d')!,
    canvas
  }
}

export function windowToCanvas(canvas: HTMLCanvasElement, x: number, y: number) {
  const bbox = canvas.getBoundingClientRect()
  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height)
  }
}
