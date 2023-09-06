import { Layout, Dropdown, Menu, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";

const { Header, Content } = Layout;

const App = () => {
  const [authed, setAuthed] = useState();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthed(authToken !== null);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      message.success("Login success");
    }
  }, []);

  const handleLoginSuccess = () => {
    setAuthed(true);
  };

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    setAuthed(false);
  };

  const renderContent = () => {
    if (authed === undefined) {
      return <></>;
    }

    if (!authed) {
      return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    }

    return <HomePage />;
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
          App Store
        </div>
        {authed && (
          <div>
            <Dropdown trigger="click" overlay={userMenu}>
              <Button icon={<UserOutlined />} shape="circle" />
            </Dropdown>
          </div>
        )}
      </Header>
      <Content
        style={{ height: "calc(100% - 64px)", padding: 20, overflow: "auto" }}
      >
        {renderContent()}
      </Content>
    </Layout>
  );
};

export default App;