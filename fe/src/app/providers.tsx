'use client';

import React from 'react';
import { ConfigProvider, App } from 'antd';
import viVN from 'antd/locale/vi_VN';

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#c41d1d',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#c41d1d',
          colorInfo: '#1890ff',
          borderRadius: 8,
          wireframe: false,
        },
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
}
