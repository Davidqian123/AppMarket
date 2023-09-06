import React, { useRef, useState } from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import { uploadApp } from "../utils";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const PostApps = () => {
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleFormSubmit = async (data) => {
    const { files } = fileInputRef.current;

    setLoading(true);

    try {
      await uploadApp(data, files[0]);
      message.success("upload successfully");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      {...layout}
      onFinish={handleFormSubmit}
      style={{ maxWidth: 1000, margin: "auto" }}
    >
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
      </Form.Item>
      <Form.Item name="picture" label="Picture" rules={[{ required: true }]}>
        <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, type: "number", min: 0 }]}
      >
        <InputNumber prefix="$" precision={2} />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PostApps;
