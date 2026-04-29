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
          colorPrimary: 'rgb(201, 12, 12)',
          colorSuccess: '#13940c',
          colorWarning: '#dba211',
          colorError: '#e00c10',
          colorInfo: '#1572c9',
          borderRadius: 8,
        },
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
}
