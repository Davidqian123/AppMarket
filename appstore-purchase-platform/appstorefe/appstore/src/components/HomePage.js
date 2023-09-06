import {
    Button,
    Card,
    Form,
    Image,
    Input,
    List,
    message,
    Tabs,
    Tooltip,
    Typography,
  } from "antd";
  import { useEffect, useState } from "react";
  import { searchApps, checkout, deleteApp } from "../utils";
  import PostApps from "./PostApps";
  
  const { TabPane } = Tabs;
  const { Text } = Typography;
  
  const BrowseApps = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
  
    useEffect(() => {
      handleSearch();
    }, []);
  
    const handleSearch = async (query) => {
      setLoading(true);
      try {
        const resp = await searchApps(query);
        setData(resp || []);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <>
        <Form onFinish={handleSearch} layout="inline">
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
        <List
          style={{ marginTop: 20 }}
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 3,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Card
                key={item.id}
                title={
                  <Tooltip title={item.description}>
                    <Text ellipsis={true} style={{ maxWidth: 150 }}>
                      {item.title}
                    </Text>
                  </Tooltip>
                }
                extra={<Text type="secondary">${item.price}</Text>}
                actions={[
                  <Button
                    shape="round"
                    type="primary"
                    onClick={() => checkout(item.id)}
                  >
                    Checkout
                  </Button>,
                  <Button
                    shape="round"
                    type="danger"
                    onClick={() => deleteApp(item.id)}
                  >
                    Delete
                  </Button>,
                ]}
              >
                <Image src={item.url} width="100%" />
              </Card>
            </List.Item>
          )}
        />
      </>
    );
  };
  
  const HomePage = () => {
    return (
      <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
        <TabPane tab="Browse Apps" key="1">
          <BrowseApps />
        </TabPane>
        <TabPane tab="Post Apps" key="2">
          <PostApps />
        </TabPane>
      </Tabs>
    );
  };
  
  export default HomePage;