import React from 'react';
import { Modal, Button, message } from 'antd';
import { CreatPostForm } from './CreatePostForm';
import { API_ROOT, POS_KEY, AUTH_HEADER, TOKEN_KEY, LOC_SHAKE } from '../constants';

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
                formData.set('image', values.file[0].originFileObj);
                formData.set('lat', lat + 2 * Math.random() * LOC_SHAKE - LOC_SHAKE);
                formData.set('lon', lon + 2 * Math.random() * LOC_SHAKE - LOC_SHAKE);
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
                    console.log(err);
                    message.error('Create Post Failed :(');
                    this.setState({
                        confirmLoading: false
                    });
                })
            }
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
        this.form.resetFields();
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
