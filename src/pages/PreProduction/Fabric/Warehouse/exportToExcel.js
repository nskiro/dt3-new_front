import React, { Component } from 'react'
import ExcelFileSheet from 'react-data-export'
import { Button } from 'antd'

const { ExcelFile, ExcelSheet } = ExcelFileSheet

class ExportToExcel extends Component {

    /*
    constructor(props) {
        super(props)

    }
    */

    componentWillReceiveProps = (nextprops) => {

    }

    render() {
        let { dataset, filename } = this.props.dataset

        const button_size = 'small'
        const excel_dateset = dataset ? dataset : [[]];
        const excel_filename = filename ? filename : 'undefined'

        return <ExcelFile
            element={
                <Button icon="export" size={button_size} type="primary">
                    {' '}
                    Download Data{' '}
                </Button>
            }
            filename={excel_filename}
        >
            <ExcelSheet dataSet={excel_dateset} name="Inventory" />
        </ExcelFile>
    }
}


export default ExportToExcel