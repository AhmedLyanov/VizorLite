import ReactDOM from 'react-dom/client';
import '../index.css';
import App from './App';
import { ConfigProvider, theme } from 'antd';


const { darkAlgorithm } = theme;


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
   <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
        token: {
          colorPrimary: '#177ddc',
          colorBgBase: '#141414',
          colorTextBase: '#e5e5e5',
        },
        components: {
          Popover: {
            colorBgElevated: '#1f1f1f',
            colorText: '#e5e5e5',
          },
        },
      }}
    >
    <App />

    </ConfigProvider>
);

