import React, { Component } from 'react'
import { Form, Input, Button, Icon, Card, Row, Col, Upload, message } from 'antd'
import { connect } from 'react-redux'

const FormItem = Form.Item
const { Meta } = Card;
const mapStateToProps = ({ app }, props) => {
    const { userState } = app
    return {
        user: userState
    }
}

const uploadProps = {
    name: 'avatar',
    accept: 'image/*',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

@connect(mapStateToProps)
@Form.create()
class ProfileForm extends Component {
    render() {
        const { user } = this.props
        const { dept } = user
        return (
            <Row>
                <Col span={6}>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={`data:${dept.avatar.mimetype};base64,${dept.avatar.data}`} />}
                        actions={[
                            <Upload {...uploadProps}>
                                <Button>
                                    <Icon type="upload" /> Click to Upload
                                </Button>
                            </Upload>
                        ]}
                    >
                        <Meta
                            title={user.fullname}
                            description={`Department: ${dept.name}`}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    Form change profile
                </Col>
            </Row>
        )
    }
}

export default ProfileForm