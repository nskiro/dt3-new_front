import React, { Component } from 'react'
import ReactExport from 'react-data-export'
import { Button } from 'antd'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

class ExportToExcel extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps = (nextProps, state) => {
    const { dataset, filename, buttonsize } = nextProps
    let nextState = { ...state }
    nextState.dataset = dataset
    nextState.filename = filename
    nextState.buttonsize = buttonsize
    return nextState
  }
  render() {
    let { dataset, filename, buttonsize } = this.state
    const button_size = buttonsize ? buttonsize : 'default'
    const excel_dateset = dataset ? dataset : [[]]
    const excel_filename = filename ? filename : 'undefined'
    let children = []
    for (let i = 0; i < dataset.length; i++) {
      children.push(
        <ExcelSheet
          dataSet={dataset[i].data}
          name={dataset[i].sheetname}
          key={dataset[i].sheetname}
        />,
      )
    }
    return dataset ? (
      <ExcelFile
        filename={excel_filename}
        element={
          <Button icon="arrow-down" type="primary" style={{ marginTop: 5 }}>
            Export
          </Button>
        }
      >
        {children}
      </ExcelFile>
    ) : null
  }
}

export default ExportToExcel
