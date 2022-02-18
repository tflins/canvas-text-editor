import {
  createCanvas,
  isHtmlElement,
  windowToCanvas
} from '@canvas-text-editor/shared'
import { TextCursor } from '@canvas-text-editor/text-cursor'
import { TextLine } from '@canvas-text-editor/text-line'

export interface ICanvasTextEditorOptions {
  el: string | HTMLElement
}

const defaultCanvasTextEditorOptions: Partial<ICanvasTextEditorOptions> = {}

const BLINK_ON = 700
const BLINK_OFF = 300

export class CanvasTextEditor {
  options: ICanvasTextEditorOptions
  el!: HTMLElement
  ctx!: CanvasRenderingContext2D
  canvas!: HTMLCanvasElement
  drawingSurfaceImageData!: ImageData
  blinkingInterval!: NodeJS.Timer

  textCursor!: TextCursor
  textLine!: TextLine

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
    this.saveDrawingSurface()
  }

  bindEvent() {
    this.canvas.onmousedown = (e: MouseEvent) => {
      const loc = windowToCanvas(this.canvas, e.clientX, e.clientY)

      this.textLine = new TextLine({
        editorCanvas: this.canvas,
        editorContent: this.ctx,
        x: loc.x,
        y: loc.y
      })

      this.moveCursor(loc)
    }

    document.onkeydown = (e: KeyboardEvent) => {
      if (e.keyCode === 8 || e.keyCode === 13) {
        e.preventDefault()
      }

      if (e.keyCode === 8) {
        this.ctx.save()
        this.textLine.erase(this.drawingSurfaceImageData)
        this.moveCursor({
          x: this.textLine.left + this.textCursor.width,
          y: this.textLine.bottom
        })
        this.textLine.draw()
        this.ctx.restore()
      }
    }

    document.onkeypress = (e: KeyboardEvent) => {
      const key = String.fromCharCode(e.which);
      if (e.keyCode !== 8 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();

        this.ctx.save();
        this.textLine.erase(this.drawingSurfaceImageData);
        this.textLine.insert(key);
        this.moveCursor({
          x: this.textLine.left + this.textLine.width,
          y: this.textLine.bottom
        })
        this.ctx.shadowColor = 'rgba (0,0, 0,0.5) ';
        this.ctx.shadowOffsetY = 1;
        this.ctx.shadowOffsetY = 1;
        this.ctx.shadowBlur = 2;
        this.textLine.draw();
        this.ctx.restore();
      }
    }
  }


  saveDrawingSurface() {
    return this.drawingSurfaceImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
  }

  blinkCursor() {
    this.blinkingInterval = setInterval(() => {
      this.textCursor.erase(this.drawingSurfaceImageData)

      setTimeout(() => {
        this.textCursor.draw()
      }, BLINK_OFF)
    }, BLINK_ON)
  }

  moveCursor(loc: { x: number, y: number }) {
    this.textCursor.erase(this.drawingSurfaceImageData)
    this.textCursor.draw(loc.x, loc.y)

    if (!this.blinkingInterval) {
      this.blinkCursor()
    }
  }

  mount() {
    if (!this.options.el) {
      throw new Error('el is undefined')
    }

    let wrapElenemt: HTMLElement | null = null
    if (typeof this.options.el === 'string') {
      wrapElenemt = document.querySelector(this.options.el)
    } else if (isHtmlElement(this.options.el)) {
      wrapElenemt = this.options.el
    } else {
      throw new Error('el must dom or class name')
    }

    wrapElenemt!.appendChild(this.canvas)
  }
}
