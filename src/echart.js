/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

// import * as scene from '../bower_components/things-scene-core/things-scene-min.js'

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties : [{
    type: 'textarea',
    label: 'option',
    name: 'option',
    property: 'option'
  }, {
    type: 'textarea',
    label: 'series',
    name: 'series',
    property: 'series'
  }]
}

const DEFAULT_OPTION = {
  title: 'NO OPTIONS'
}

var {
  HTMLOverlayContainer
} = scene

export default class Echart extends HTMLOverlayContainer {

  static load(component) {
    if (Echart.loaded) {
      component.onload()
      // requestAnimationFrame(() => component.onload())
      return
    }

    if (this.script) {
      Echart.readies.push(component)
      return
    }

    this.readies = [component]

    var script = document.createElement('script');
    script.onload = function () {
      Echart.loaded = true
      Echart.readies.forEach(component => component.onload())
      delete Echart.readies
    }

    script.src = 'http://echarts.baidu.com/dist/echarts.min.js';

    document.head.appendChild(script)
    Echart.script = script
  }

  onload() {
    this._chart = echarts.init(this._anchor);
    requestAnimationFrame(() => this.reposition())
    // this.reposition();
  }

  dispose() {
    this._echart && this._echart.dispose()
    delete this._echart
    delete this._anchor

    super.dispose();
  }

  reposition() {
    super.reposition()

    if(!this._chart)
      return

    this._chart.setOption(this.buildOptions(Object.assign({series: this.series}, this.option)));

    this._chart.resize({
      width: 'auto',
      height: 'auto',
      silent: true
    });
  }

  oncreate_element(div) {
    this._anchor = document.createElement('div')
    this._anchor.style.width = '100%';
    this._anchor.style.height = '100%';

    this.element.appendChild(this._anchor)

    Echart.load(this)
  }

  setElementProperties(div) {
  }

  buildOptions(options) {
    var {
      title = {}
    } = options

    options.title = Object.assign(title, {
      text: this.text,
      show: !!this.text
    })

    // if(!series.length)
    //   return options

    // if(series.length == 1) {
    //   let {
    //     name,
    //     data
    //   } = series[0]

    //   options.series[0].data = this.data[name] || this.data || data
    // } else {
    //   options.series = series.map(serial => {
    //     let {
    //       name,
    //       data
    //     } = serial

    //     serial.data = (this.data && this.data[name]) || data

    //     return serial
    //   })
    // }

    return options
  }

  get series() {
    var {
      series,
      data
    } = this.state

    if(typeof(series) !== 'object') {
      try {
        eval(`series = ${series}`)
      } catch (e) {
        scene.error(e)
      }
    }

    return series
  }

  get option() {
    var {
      option = DEFAULT_OPTION,
      data
    } = this.state

    if(typeof(option) !== 'object') {
      try {
        eval(`option = ${option}`)
      } catch (e) {
        scene.error(e)
      }
    }

    return option
  }

  get tagName() {
    return 'div'
  }

  get nature(){
    return NATURE;
  }
}

scene.Component.register('echart', Echart);
