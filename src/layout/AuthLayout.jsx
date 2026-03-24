import { useState } from "react";
import { AuthPanel, AuthLeftSidePanel, AuthRightSidePanel, FormContainer } from "../pages/auth/AuthPanel";
import { Outlet } from "react-router-dom";


export default function AuthLayout() {
  const [sidePanel, setSidePanel] = useState({ title: "Welcome to CMS", children: <p>Welcome</p> });
  return (
    <>
      <AuthPanel>
        <AuthLeftSidePanel title={sidePanel.title}>{sidePanel.children}</AuthLeftSidePanel>

        <AuthRightSidePanel>
          <FormContainer>
            <Outlet context={{sidePanel, setSidePanel}} />
          </FormContainer>
        </AuthRightSidePanel>
      </AuthPanel>
    </>
  );
}
