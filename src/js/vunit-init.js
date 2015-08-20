/**
 * Created by Estevao on 20/08/2015.
 */
new vUnit({
  CSSMap: {
    '.vh_height': {
      property: 'height',
      reference: 'vh'
    },
    '.vh_min-height': {
      property: 'min-height',
      reference: 'vh'
    },
    '.vh_width': {
      property: 'width',
      reference: 'vw'
    },
    '.vw_font-size': {
      property: 'font-size',
      reference: 'vw'
    },
    '.vmin_margin-top': {
      property: 'margin-top',
      reference: 'vmin'
    }
  }
}).init();
