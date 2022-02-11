export interface ITextLineOptions {
  editorCanvas: HTMLCanvasElement
  editorContent: CanvasRenderingContext2D
  x: number
  y: number
}

export const defaultTextLineOptions: Partial<ITextLineOptions> = {}

export class TextLine {
  options: ITextLineOptions
  text = ''
  caret = 0

  constructor(options: ITextLineOptions) {
    this.options = Object.assign({}, defaultTextLineOptions, options)
  }

  get left() {
    return this.options.x
  }

  get bottom() {
    return this.options.y
  }

  get width() {
    return this.editorContent.measureText(this.text).width
  }

  get height() {
    const h = this.editorContent.measureText('W').width
    return Math.floor(h + h / 6)
  }

  get editorContent() {
    return this.options.editorContent
  }

  get editorCanvas() {
    return this.options.editorCanvas
  }

  insert(text: string) {
    this.text = this.text.substring(0, this.caret) + text + this.text.substring(this.caret)
    this.caret += text.length
  }

  removeCharacterBeforeCaret() {
    if (this.caret === 0) return

    this.text = this.text.substring(0, this.caret - 1) + this.text.substring(this.caret)
    this.caret--
  }

  draw() {
    this.editorContent.save()
    this.editorContent.textAlign = 'start'
    this.editorContent.textBaseline = 'bottom'

    this.editorContent.strokeText(this.text, this.left, this.bottom)
    this.editorContent.fillText(this.text, this.left, this.bottom)

    this.editorContent.restore()
  }

  erase(imageData: ImageData) {
    this.editorContent.putImageData(imageData, 0, 0)
  }
}
