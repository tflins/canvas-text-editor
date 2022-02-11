export interface ITextCursorOptions {
  width?: number;
  fillStyle?: string;
  editorCanvas: HTMLCanvasElement;
  editorContent: CanvasRenderingContext2D;
}

export const defaultTextCursorOptions: Partial<ITextCursorOptions> = {
  width: 2,
  fillStyle: 'rgba(0, 0, 0, 0.5)'
}

export class TextCursor {
  options: ITextCursorOptions;
  left: number = 0;
  top: number = 0;

  constructor(options: ITextCursorOptions) {
    this.options = Object.assign({}, defaultTextCursorOptions, options);
  }

  get fillStyle() {
    return this.options.fillStyle;
  }

  get width() {
    return this.options.width;
  }

  get height() {
    const h = this.editorContent.measureText('W').width
    return h + h / 6
  }

  get editorContent() {
    return this.options.editorContent;
  }

  createPath() {
    this.editorContent.beginPath()
    this.editorContent.rect(this.left, this.top, this.width, this.height)
  }

  draw(left: number, top: number) {
    this.editorContent.save()

    this.left = left
    this.top = top

    this.createPath()

    this.editorContent.fillStyle = this.fillStyle
    this.editorContent.fill()

    this.editorContent.restore()
  }
}