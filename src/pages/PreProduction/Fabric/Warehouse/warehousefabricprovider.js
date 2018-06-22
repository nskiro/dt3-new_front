import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Input, Button, Form, Modal, Collapse } from 'antd';
import PropTypes from 'prop-types';

import ReactDataGrid from 'react-data-grid';
//import update from 'immutability-helper';

import RowRenderer from './rowrenderer';
import DateFormatter from './dateformatter';

//import moment from 'moment';
import axios from '../../../../axiosInst';
//css
import './views.css';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { DateLongFormatter, DateShortFormatter } = DateFormatter;
const button_size = 'small';

class ProviderForm extends Component {
    constructor(props) {
        super(props);
    }
    onChangeProviderCode = (v) => {
        this.setState({ provider_code: v });
    }
    render() {
        const { visible, onCancel, onCreate, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title="SUPPILER"
                visible={visible}
                onOk={onCreate}
                maskClosable={false}
                onCancel={onCancel}
            >
                <Form >
                    <Grid>
                        <Row className="show-grid">
                            <Col>
                                <FormItem>
                                    {getFieldDecorator('id', { initialValue: this.props.data._id })
                                        (<Input name='id' style={{ display: 'none', visible: false }} />)}
                                </FormItem>
                            </Col>

                            < Col md={5} sm={8} xs={5} >
                                <FormItem label={'SUPPLIER'}>
                                    {getFieldDecorator('provider_code', {
                                        rules: [{ required: true, message: 'Vui lòng nhập tên nhà cung cấp!' }],
                                        initialValue: this.props.data.provider_code
                                    })
                                        (<Input onChange={this.onChangeProviderCode} placeholder="nhà cung cấp" />)}
                                </FormItem>
                            </Col>
                        </Row>

                    </Grid>
                </Form>
            </Modal>
        );
    }
}
;

ProviderForm.propTypes = {
    // setDataForm: PropTypes.func,
    data: PropTypes.object
};
ProviderForm.defaultProps = {

};

class WarehouseFabricProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expand: false,
            modalvisible: false,
            provider_code: '',
            provider_name: '',
            data_providers: [],

            selected_provider: { 'provider_code': undefined, 'provider_name': undefined }
        };

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // console.log('Received values of form: ', values);
            if (values.provider_code) {
                this.loadSearchProviders(values);
            } else {
                this.loadSearchProviders({});
            }
        });
    }

    handleReset = () => {
        this.props.form.resetFields();
        this.loadSearchProviders({});
    }

    onRefeshGrid = () => {
        this.handleReset();
    }

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }

    //Modal
    showModal = (e) => {
        if (e) {
            let mod = e.target.value;
            if (mod === 'new') {
                this.setState({
                    modalvisible: true,
                    selected_provider: { 'provider_code': undefined, 'provider_name': undefined }
                });

            } else if (mod === 'edit') {

                let provider = this.state.selected_provider;
                if (provider.provider_code) {
                    this.setState({
                        modalvisible: true
                    });
                }

            }
        }
    }
    handleCancel = (e) => {
        this.setState({
            modalvisible: false,
        });
    }

    handleCreate = (e) => {
        const form = this.formRef.props.form;

        form.validateFields((err, values) => {
            if (err) { return; }
            if (!values.provider_code) { return; }
            let data = {
                _id: values.id,
                provider_code: values.provider_code,
                provider_name: values.provider_name,

            }
            if (values.id) {
                console.log('call update');
                axios.post(`api/fabric/provider/update/${values.id}`, data)
                    .then((res) => {
                        this.loadSearchProviders({});
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log('call add');
                axios.post('api/fabric/provider/add', data)
                    .then((res) => {
                        this.loadSearchProviders({});
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            form.resetFields();
            this.setState({ modalvisible: false });

        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    //end modal

    rowGetter = (i) => {
        return this.state.data_providers[i];
    };

    loadSearchProviders = (v) => {
        axios.get('api/fabric/provider/get', { params: v })
            .then((res) => {
                let data = res.data;
                // update data
                this.setState({ data_providers: data });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ data_providers: [] });
            });
    }

    componentDidMount = () => {
        this.loadSearchProviders({});
    }

    onRowProviderClick = (e) => {
        let index = e;
        if (index >= 0 && index < this.state.data_providers.length) {
            let provider = this.state.data_providers[index];
            this.setState({ selected_provider: provider });
        }

    }
    render() {

        const WrappedProviderForm = Form.create()(ProviderForm);
        const { getFieldDecorator } = this.props.form;
        const columns = [
            // {key: '_id', name: 'id', hidd: false },
            { key: 'provider_code', name: 'SUPPLIER' },
            { key: 'create_date', name: 'CREATE DATE', formatter: DateLongFormatter },
            { key: 'update_date', name: 'UPDATE DATE', formatter: DateLongFormatter },
        ];
        return (
            <div>
                <Collapse className='ant-advanced-search-panel-collapse'>
                    <Panel header="SEARCH" key="1" >
                        <Form className="ant-advanced-search-panel " onSubmit={this.handleSearch}>
                            <Grid>
                                <Row className="show-grid">
                                    <Col md={4} sm={6} xs={12} style={{ textAlign: 'left' }}>
                                        <FormItem label={'SUPPLIER'}>
                                            {
                                                getFieldDecorator('provider_code', {})(<Input placeholder="nhà cung cấp" />)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col md={4} sm={6} xs={12} style={{ textAlign: 'left' }}>
                                        <Button icon="search" size={button_size} type="primary" htmlType="submit">SEARCH</Button>
                                        <Button icon="sync" size={button_size} style={{ marginLeft: 8 }} onClick={this.handleReset}>CLEAR</Button>
                                    </Col>
                                </Row>

                            </Grid>
                        </Form>
                    </Panel>
                </Collapse>
                <div className="ant-advanced-toolbar">
                    <Button icon="plus" size={button_size} type="primary" value='new' className='ant-advanced-toolbar-item' onClick={this.showModal}>NEW</Button>
                    <Button icon="edit" size={button_size} type="primary" value='edit' className='ant-advanced-toolbar-item' onClick={this.showModal}>EDIT</Button>
                    <Button icon="sync" size={button_size} type="primary" className='ant-advanced-toolbar-item' onClick={this.onRefeshGrid}>REFESH</Button>

                </div>
                <WrappedProviderForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.modalvisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    data={this.state.selected_provider}
                >
                </WrappedProviderForm>

                <ReactDataGrid
                    enableCellSelect={true}
                    resizable={true}
                    columns={columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.data_providers.length}
                    minHeight={390}
                    onRowClick={this.onRowProviderClick}
                    rowRenderer={RowRenderer}
                ></ReactDataGrid>
            </div >
        );
    }
}


export default WarehouseFabricProvider;