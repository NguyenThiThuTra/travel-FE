import React from 'react';
import { Form, Input, Button, Space, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import './_FormReview.scss';

const { TextArea } = Input;

export default function FormReview({
  handleOk,
  visible,
  handleCancel,
  loading,
}) {
  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };
  return (
    <Modal
      className="form-review"
      visible={visible}
      title={<h3 className="form-review__title">Review của bạn</h3>}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Return
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          Submit
        </Button>,
        <Button
          key="link"
          href="https://google.com"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          Search on Google
        </Button>,
      ]}
    >
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="users">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'first']}
                    rules={[{ required: true, message: 'Missing first name' }]}
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'last']}
                    rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    <Input placeholder="Last Name" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
