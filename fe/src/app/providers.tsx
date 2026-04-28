'use client';

import React from 'react';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: 'rgb(20, 64, 209)',
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
