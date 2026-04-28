"use client";

import React from "react";
import { Card, Statistic } from "antd";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color: string;
  bg: string;
  size?: "small" | "default";
}

export default function StatsCard({ 
  label, 
  value, 
  icon, 
  color, 
  bg, 
  size = "small" 
}: StatsCardProps) {
  const isSmall = size === "small";

  return (
    <Card 
      bordered={false} 
      styles={{ 
        body: { 
          padding: isSmall ? '10px 14px' : '16px 24px', 
          backgroundColor: bg, 
          borderRadius: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        } 
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Statistic 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              {icon && <div style={{ color: color, fontSize: isSmall ? 14 : 18 }}>{icon}</div>}
              <span style={{ color: '#434343', fontSize: isSmall ? 11 : 13, fontWeight: 600 }}>{label}</span>
            </div>
          }
          value={value}
          valueStyle={{ 
            color: color, 
            fontSize: isSmall ? 26 : 32, 
            fontWeight: 800, 
            lineHeight: 1.2 
          }}
        />
      </div>
    </Card>
  );
}
