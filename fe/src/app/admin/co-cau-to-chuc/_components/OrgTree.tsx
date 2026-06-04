"use client";

import React, { useState } from "react";
import { Popover, Avatar, Typography, Tag, Empty, Button, Divider, Card, Space, Tooltip, Badge } from "antd";
import { Department } from "@/services/organization.service";
import { Employee } from "@/services/employee.service";
import { 
  UserOutlined, 
  TeamOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  MinusOutlined, 
  PlusOutlined,
  IdcardOutlined,
  CrownOutlined
} from "@ant-design/icons";

const { Text, Title } = Typography;

interface OrgTreeProps {
  data: Department[];
  employeeMap: Map<number, Employee>;
}

// Hàm render một Node (Phòng ban) trong sơ đồ
const OrgNode = ({ dept, employeeMap, employeesInDept }: { dept: Department; employeeMap: Map<number, Employee>, employeesInDept: Employee[] }) => {
  const [collapsed, setCollapsed] = useState(false);
  const manager = dept.MaQuanLy ? employeeMap.get(dept.MaQuanLy) : null;
  const hasChildren = dept.children && dept.children.length > 0;

  // Tìm tất cả nhân viên thuộc phòng ban này
  const members = employeesInDept.filter(emp => emp.MaPhongId === dept.Id);
  const regularMembers = members.filter(emp => emp.Id !== manager?.Id);

  return (
    <li className="relative">
      <div className="inline-block relative">
        <Popover
          content={
            <div style={{ width: 320 }}>
              {/* Header người quản lý */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <Avatar 
                  size={56} 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: manager ? '#1677ff' : '#d9d9d9', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
                />
                <div>
                  <Title level={5} style={{ margin: 0 }}>{manager ? manager.HoTen : "Chưa có quản lý"}</Title>
                  {manager && manager.chucVu && (
                    <Text type="secondary" strong>{manager.chucVu.TenChucVu}</Text>
                  )}
                </div>
              </div>
              
              {manager ? (
                <Card size="small" style={{ backgroundColor: '#f0f5ff', border: '1px solid #d6e4ff', marginBottom: 16 }}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space>
                      <MailOutlined style={{ color: '#1677ff' }} />
                      <Text copyable>{manager.Email}</Text>
                    </Space>
                    {manager.SoDienThoai && (
                      <Space>
                        <PhoneOutlined style={{ color: '#1677ff' }} />
                        <Text copyable>{manager.SoDienThoai}</Text>
                      </Space>
                    )}
                  </Space>
                </Card>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px 0', background: '#fafafa', borderRadius: 8, marginBottom: 16 }}>
                  <Text type="secondary" italic>Chưa bổ nhiệm người quản lý</Text>
                </div>
              )}

              <Divider style={{ margin: '12px 0' }} />
              
              {/* Danh sách nhân viên */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text strong><TeamOutlined style={{ color: '#1677ff', marginRight: 8 }}/>Thành viên phòng ban</Text>
                  <Tag color="blue" style={{ borderRadius: 12 }}>{members.length} người</Tag>
                </div>
                {regularMembers.length > 0 ? (
                  <div style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 8 }} className="custom-scrollbar">
                    {regularMembers.map(member => (
                      <div key={member.Id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 8px', borderBottom: '1px solid #f0f0f0', borderRadius: 4 }} className="hover:bg-gray-50">
                        <Text strong style={{ fontSize: 13 }}>{member.HoTen}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{member.chucVu?.TenChucVu || 'Nhân viên'}</Text>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có nhân viên khác" />
                )}
              </div>
            </div>
          }
          title={
            <Space style={{ padding: '4px 0' }}>
              <IdcardOutlined style={{ color: '#1677ff', fontSize: 18 }} /> 
              <span style={{ fontSize: 16 }}>Chi tiết phòng ban</span>
            </Space>
          }
          trigger="hover"
          placement="right"
          mouseEnterDelay={0.2}
        >
          {/* Card phòng ban sử dụng Ant Design */}
          <div style={{ position: 'relative', margin: '0 12px', zIndex: 10 }}>
            <Badge count={members.length} style={{ backgroundColor: '#1677ff', zIndex: 11 }} offset={[-10, 10]}>
              <Card
                hoverable
                style={{ 
                  width: 260, 
                  borderRadius: 12, 
                  border: '1px solid #d9d9d9',
                  borderTop: '4px solid #1677ff', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff'
                }}
                styles={{ body: { padding: '20px 16px' } }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%', alignItems: 'center' }}>
                  
                  {/* Tên và Mã phòng ban */}
                  <Space direction="vertical" size={4} style={{ alignItems: 'center', textAlign: 'center' }}>
                    <Title level={5} style={{ margin: 0, color: '#1f2937' }}>{dept.TenPhong}</Title>
                    <Tag color="blue" style={{ margin: 0, borderRadius: 4, fontWeight: 500 }}>
                      {dept.MaPhong}
                    </Tag>
                  </Space>
                  
                  {/* Thông tin quản lý */}
                  <div style={{ 
                    width: '100%', 
                    background: '#f8fafc', 
                    padding: '10px 12px', 
                    borderRadius: 8, 
                    textAlign: 'center',
                    border: '1px solid #f1f5f9'
                  }}>
                    <Text type="secondary" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6, color: '#64748b' }}>
                      QUẢN LÝ
                    </Text>
                    {manager ? (
                      <Space size="small">
                        <Avatar size="small" icon={<CrownOutlined />} style={{ backgroundColor: '#1677ff' }} />
                        <Text strong style={{ color: '#334155', fontSize: 13 }}>{manager.HoTen}</Text>
                      </Space>
                    ) : (
                      <Text type="secondary" italic style={{ fontSize: 13 }}>Trống</Text>
                    )}
                  </div>
                </Space>
              </Card>
            </Badge>

            {/* Nút thu gọn / mở rộng */}
            {hasChildren && (
              <Button 
                size="small" 
                shape="circle"
                icon={collapsed ? <PlusOutlined style={{ fontSize: 10 }} /> : <MinusOutlined style={{ fontSize: 10 }} />} 
                onClick={(e) => {
                  e.stopPropagation();
                  setCollapsed(!collapsed);
                }}
                style={{ 
                  position: 'absolute', 
                  bottom: -14, 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  zIndex: 20,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  color: '#1677ff',
                  borderColor: '#d9d9d9'
                }}
              />
            )}
          </div>
        </Popover>
      </div>

      {/* Danh sách phòng ban con */}
      {hasChildren && !collapsed && (
        <ul className="flex justify-center pt-10 relative transition-all duration-500">
          {dept.children!.map((child) => (
            <OrgNode key={child.Id} dept={child} employeeMap={employeeMap} employeesInDept={employeesInDept} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function OrgTree({ data, employeeMap }: OrgTreeProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center py-24">
        <Empty description="Không có dữ liệu sơ đồ tổ chức" />
      </div>
    );
  }

  // Chuyển map sang mảng để truyền xuống các node dễ dàng filter
  const employeesInDept = Array.from(employeeMap.values());

  return (
    <div className="org-tree-container overflow-x-auto min-w-full p-10 rounded-2xl min-h-[600px] flex justify-center" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
      <style>{`
        .org-tree-container {
          cursor: grab;
        }
        .org-tree-container:active {
          cursor: grabbing;
        }
        .org-tree ul {
          padding-top: 40px;
          position: relative;
          display: flex;
          justify-content: center;
        }
        .org-tree li {
          float: left;
          text-align: center;
          list-style-type: none;
          position: relative;
          padding: 40px 12px 0 12px;
        }
        /* Các đường kẻ ngang */
        .org-tree li::before, .org-tree li::after {
          content: '';
          position: absolute;
          top: 0;
          right: 50%;
          border-top: 2px solid #94a3b8; /* Làm đậm đường kẻ hơn */
          width: 50%;
          height: 40px;
          z-index: 1;
        }
        .org-tree li::after {
          right: auto;
          left: 50%;
          border-left: 2px solid #94a3b8;
        }
        /* Bỏ đường kẻ của phần tử đầu và cuối */
        .org-tree li:only-child::after, .org-tree li:only-child::before {
          display: none;
        }
        .org-tree li:only-child {
          padding-top: 0;
        }
        .org-tree li:first-child::before, .org-tree li:last-child::after {
          border: 0 none;
        }
        /* Bo góc cho đường kẻ */
        .org-tree li:last-child::before {
          border-right: 2px solid #94a3b8;
          border-radius: 0 12px 0 0;
        }
        .org-tree li:first-child::after {
          border-radius: 12px 0 0 0;
        }
        /* Đường kẻ dọc từ cha xuống con */
        .org-tree ul ul::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          border-left: 2px solid #94a3b8;
          width: 0;
          height: 40px;
          transform: translateX(-50%);
          z-index: 1;
        }
        
        /* QUAN TRỌNG: Ẩn đường kẻ phía trên của các node gốc (Root) */
        .org-tree > ul {
          padding-top: 0 !important;
        }
        .org-tree > ul > li {
          padding-top: 0 !important;
        }
        .org-tree > ul > li::before,
        .org-tree > ul > li::after {
          display: none !important;
          border: none !important;
        }

        /* Custom scrollbar cho danh sách nhân viên */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}</style>
      
      <div className="org-tree inline-block mt-4">
        <ul>
          {data.map((rootDept) => (
            <OrgNode key={rootDept.Id} dept={rootDept} employeeMap={employeeMap} employeesInDept={employeesInDept} />
          ))}
        </ul>
      </div>
    </div>
  );
}

