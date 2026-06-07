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
          colorSuccess: '#47af12ff',
          colorWarning: '#faad14',
          colorError: '#c41d1d',
          colorInfo: '#158af8ff',
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
