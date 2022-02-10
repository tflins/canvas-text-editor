import { createCanvas, isHtmlElement } from '@canvas-text-editor/shared'

export interface ICanvasTextEditorOptions {
  el: string | HTMLElement
}

const defaultCanvasTextEditorOptions: Partial<ICanvasTextEditorOptions> = {}

export class CanvasTextEditor {
  options: ICanvasTextEditorOptions
  el: HTMLElement | null = null
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement

  constructor(options: ICanvasTextEditorOptions) {
    this.options = Object.assign({}, defaultCanvasTextEditorOptions, options)

    this.init()
  }

  init() {
    const { canvas, cxt } = createCanvas()
    this.canvas = canvas
    this.ctx = cxt

    this.mount()
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
