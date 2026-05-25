"use client";

import React, { useState, useEffect } from "react";
import { Typography, Card, Form, Input, Button, DatePicker, Select, Space, message, Tabs, InputNumber, Row, Col, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { LeaveService } from "@/services/leave.service";
import { AttendanceService } from "@/services/attendance.service";
import dayjs from "dayjs";
import type { TabsProps } from 'antd';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function LeaveRequestPage() {
  const router = useRouter();
  const [leaveForm] = Form.useForm();
  const [otForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [fetchingTypes, setFetchingTypes] = useState(true);

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const types = await LeaveService.getLeaveTypes();
      setLeaveTypes(types || []);
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải danh sách loại phép");
    } finally {
      setFetchingTypes(false);
    }
  };

  const onFinishLeave = async (values: any) => {
    setLoading(true);
    try {
      const [start, end] = values.dateRange;
      const payload = {
        MaLoaiPhepId: values.MaLoaiPhepId,
        NgayBatDau: start.format("YYYY-MM-DD"),
        NgayKetThuc: end.format("YYYY-MM-DD"),
        TongSoNgay: values.TongSoNgay,
        LyDo: values.LyDo
      };
      
      await LeaveService.applyLeave(payload);
      message.success("Đã gửi đơn xin nghỉ phép thành công!");
      router.push("/staff/nghi-phep");
    } catch (error: any) {
      message.error(error?.message || "Không thể gửi đơn, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishOT = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        NgayLamThem: values.NgayLamThem.format("YYYY-MM-DD"),
        GioBatDau: values.GioBatDau.format("HH:mm:00"),
        GioKetThuc: values.GioKetThuc.format("HH:mm:00"),
        TongSoGio: values.TongSoGio,
        LoaiOT: values.LoaiOT,
        LyDo: values.LyDo
      };
      
      await AttendanceService.registerOT(payload);
      message.success("Đã gửi đơn đăng ký làm thêm giờ thành công!");
      router.push("/staff/nghi-phep");
    } catch (error: any) {
      message.error(error?.message || "Không thể gửi đơn, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Tính số ngày nghỉ dự kiến
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      const diff = dates[1].diff(dates[0], 'day') + 1; // +1 vì tính cả ngày bắt đầu và kết thúc
      leaveForm.setFieldsValue({ TongSoNgay: diff });
    } else {
      leaveForm.setFieldsValue({ TongSoNgay: null });
    }
  };

  // Tính số giờ làm thêm
  const handleTimeChange = () => {
    const start = otForm.getFieldValue("GioBatDau");
    const end = otForm.getFieldValue("GioKetThuc");
    if (start && end) {
      const diffHours = end.diff(start, 'minute') / 60;
      if (diffHours > 0) {
        otForm.setFieldsValue({ TongSoGio: Number(diffHours.toFixed(2)) });
      } else {
        otForm.setFieldsValue({ TongSoGio: 0 });
      }
    }
  };

  const leaveFormContent = (
    <Form
      form={leaveForm}
      layout="vertical"
      onFinish={onFinishLeave}
      initialValues={{ TongSoNgay: 1 }}
    >
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="MaLoaiPhepId"
            label="Loại nghỉ phép"
            rules={[{ required: true, message: "Vui lòng chọn loại nghỉ phép" }]}
          >
            <Select 
              placeholder="Chọn loại phép" 
              loading={fetchingTypes}
              options={leaveTypes.map(t => ({ value: t.Id, label: t.TenLoaiPhep }))}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12}>
          <Form.Item
            name="dateRange"
            label="Thời gian nghỉ (Từ ngày - Đến ngày)"
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
          >
            <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" onChange={handleDateRangeChange} />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="TongSoNgay"
            label="Tổng số ngày nghỉ"
            rules={[{ required: true, message: "Nhập tổng số ngày" }]}
          >
            <InputNumber min={0.5} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="LyDo"
            label="Lý do nghỉ"
            rules={[{ required: true, message: "Vui lòng nhập lý do nghỉ" }]}
          >
            <TextArea rows={4} placeholder="Nhập lý do xin nghỉ chi tiết..." />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={() => router.push("/staff/nghi-phep")}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>Gửi đơn</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const otFormContent = (
    <Form
      form={otForm}
      layout="vertical"
      onFinish={onFinishOT}
    >
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="NgayLamThem"
            label="Ngày làm thêm"
            rules={[{ required: true, message: "Vui lòng chọn ngày làm thêm" }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="LoaiOT"
            label="Loại làm thêm"
            rules={[{ required: true, message: "Vui lòng chọn loại làm thêm" }]}
            initialValue="NgayThuong"
          >
            <Select placeholder="Chọn loại OT">
              <Select.Option value="NgayThuong">Ngày thường</Select.Option>
              <Select.Option value="CuoiTuan">Cuối tuần</Select.Option>
              <Select.Option value="NgayLe">Ngày lễ</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name="GioBatDau"
            label="Giờ bắt đầu"
            rules={[{ required: true, message: "Chọn giờ bắt đầu" }]}
          >
            <DatePicker.TimePicker format="HH:mm" style={{ width: '100%' }} onChange={handleTimeChange} minuteStep={15} />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name="GioKetThuc"
            label="Giờ kết thúc"
            rules={[{ required: true, message: "Chọn giờ kết thúc" }]}
          >
            <DatePicker.TimePicker format="HH:mm" style={{ width: '100%' }} onChange={handleTimeChange} minuteStep={15} />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name="TongSoGio"
            label="Tổng số giờ"
            rules={[{ required: true, message: "Nhập tổng số giờ" }]}
          >
            <InputNumber min={0.5} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="LyDo"
            label="Công việc thực hiện"
            rules={[{ required: true, message: "Vui lòng nhập công việc thực hiện" }]}
          >
            <TextArea rows={4} placeholder="Mô tả công việc sẽ làm thêm..." />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={() => router.push("/staff/nghi-phep")}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>Gửi đơn</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Đơn Xin Nghỉ Phép',
      children: leaveFormContent,
    },
    {
      key: '2',
      label: 'Đơn Làm Thêm Giờ',
      children: otFormContent,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push("/staff/nghi-phep")}
          className="hover:bg-gray-100"
        />
        <div>
          <Title level={2} style={{ margin: 0 }}>Tạo Đơn Mới</Title>
          <Text type="secondary">Điền thông tin vào form dưới đây để gửi đơn cho quản lý phê duyệt</Text>
        </div>
      </div>

      <Card className="shadow-sm border-0 rounded-lg">
        <Tabs defaultActiveKey="1" items={tabItems} size="large" />
      </Card>
    </div>
  );
}
