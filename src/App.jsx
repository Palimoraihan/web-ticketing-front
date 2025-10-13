import "./App.css";
import { ConfigProvider, theme } from "antd";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./feature/auth/AuthContext";
const { useToken } = theme;
function App() {
  const { token } = useToken();
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            // colorPrimary:"#407933"
          },
          components: {
            Segmented: {
              // itemSelectedBg:token.colorPrimary,
              itemSelectedColor: token.colorPrimary,
            },
          },
        }}
      >
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ConfigProvider>
    </div>
  );
}

export default App;
