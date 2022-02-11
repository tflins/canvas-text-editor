import {
  createCanvas,
  isHtmlElement,
  windowToCanvas
} from '@canvas-text-editor/shared'
import { TextCursor } from '@canvas-text-editor/text-cursor'

export interface ICanvasTextEditorOptions {
  el: string | HTMLElement
}

const defaultCanvasTextEditorOptions: Partial<ICanvasTextEditorOptions> = {}

export class CanvasTextEditor {
  options: ICanvasTextEditorOptions
  el: HTMLElement | null = null
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement

  textCursor: TextCursor

  constructor(options: ICanvasTextEditorOptions) {
    this.options = Object.assign({}, defaultCanvasTextEditorOptions, options)

    this.init()
  }

  init() {
    const { canvas, cxt } = createCanvas()
    this.canvas = canvas
    this.ctx = cxt

    this.textCursor = new TextCursor({
      editorCanvas: this.canvas,
      editorContent: this.ctx
    })

    this.bindEvent()
    this.mount()
  }

  bindEvent() {
    this.canvas.onmousedown = (e: MouseEvent) => {
      const loc = windowToCanvas(this.canvas, e.clientX, e.clientY)
      this.moveCursor(loc)
    }
  }

  moveCursor(loc: { x: number, y: number }) {
    this.textCursor.draw(loc.x, loc.y)
  }

  mount() {
    if (!this.options.el) {
      throw new Error('el is undefined')
    }

    let wrapElenemt: HTMLElement = null
    if (typeof this.options.el === 'string') {
      wrapElenemt = document.querySelector(this.options.el)
    } else if (isHtmlElement(this.options.el)) {
      wrapElenemt = this.options.el
    } else {
      throw new Error('el must dom or class name')
    }

    wrapElenemt.appendChild(this.canvas)
  }
}
