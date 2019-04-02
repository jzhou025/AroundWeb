import React from 'react';
import { Modal, Button, message } from 'antd';
import { CreatPostForm } from './CreatePostForm';
import { API_ROOT, POS_KEY, AUTH_HEADER, TOKEN_KEY } from '../constants';

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {
        this.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
                const token = localStorage.getItem(TOKEN_KEY);
                const formData = new FormData();
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);
                formData.set('lat', lat);
                formData.set('lon', lon);
                this.setState({
                    confirmLoading: true,
                });
                // Fire API -> upload data
                fetch(`${API_ROOT}/post`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `${AUTH_HEADER} ${token}`
                    }
                }).then((response) => {
                    if (response.ok) {
                        this.form.resetFields();
                        this.setState({
                            confirmLoading: false,
                            visible: false
                        });
                        return this.props.loadNearbyPosts();
                    }
                    throw new Error(response.statusText);
                }).then(() => {
                    message.success('Post Created :)');
                }).catch((err) => {
                    message.error('Create Post Failed :(');
                    this.setState({
                        confirmLoading: false
                    });
                })
            }
        });
        this.setState({
            visible: false,
            confirmLoading: false,
        });
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }

    getFormRef = (formInstance) => {
        this.form = formInstance;
    }

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText="Create"
                >
                    <CreatPostForm ref={this.getFormRef} />
                </Modal>
            </div>
        );
    }
}
