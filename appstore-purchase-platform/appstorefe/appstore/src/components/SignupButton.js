import { Button, Modal, Form, Input, message } from "antd";
import { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { register } from "../utils";

const SignupButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegisterOnClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);

    try {
      await register(data);
      message.success("Sign up successfully");
      setModalVisible(false);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="link"
        style={{ padding: 0 }}
        onClick={handleRegisterOnClick}
      >
        Register Now!
      </Button>
      <Modal
        title="Sign Up"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form onFinish={handleFormSubmit}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              disabled={loading}
              prefix={<UserOutlined />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password disabled={loading} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SignupButton;
