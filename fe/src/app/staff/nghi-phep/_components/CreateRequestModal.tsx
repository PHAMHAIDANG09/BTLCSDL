"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, DatePicker, Select, Space, message, Tabs, InputNumber, Row, Col, theme } from "antd";
import { LeaveService } from "@/services/leave.service";
import { AttendanceService } from "@/services/attendance.service";
import dayjs from "dayjs";
import type { TabsProps } from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface CreateRequestModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  defaultTab?: string; // '1' for Leave, '2' for OT
}

export default function CreateRequestModal({ open, onCancel, onSuccess, defaultTab = '1' }: CreateRequestModalProps) {
  const { token } = theme.useToken();
  const [leaveForm] = Form.useForm();
  const [otForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [fetchingTypes, setFetchingTypes] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (open) {
      fetchLeaveTypes();
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

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
      leaveForm.resetFields();
      onSuccess();
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
        GioBatDau: values.GioBatDau.format("HH:mm"),   // BE expect "HH:mm"
        GioKetThuc: values.GioKetThuc.format("HH:mm"),  // BE expect "HH:mm"
        TongSoGio: values.TongSoGio,
        // LoaiOT KHÔNG gửi lên — backend tự tính từ ngày (NgayThuong/CuoiTuan/NgayLe)
        LyDo: values.LyDo
      };
      
      await AttendanceService.registerOT(payload);
      message.success("Đã gửi đơn đăng ký làm thêm giờ thành công!");
      otForm.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(error?.message || "Không thể gửi đơn, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };


  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      const diff = dates[1].diff(dates[0], 'day') + 1;
      leaveForm.setFieldsValue({ TongSoNgay: diff });
    } else {
      leaveForm.setFieldsValue({ TongSoNgay: null });
    }
  };

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
      className="mt-4"
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
            label="Thời gian nghỉ"
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
            <TextArea rows={3} placeholder="Nhập lý do xin nghỉ chi tiết..." />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={loading}>Gửi đơn nghỉ</Button>
      </div>
    </Form>
  );

  const otFormContent = (
    <Form
      form={otForm}
      layout="vertical"
      onFinish={onFinishOT}
      className="mt-4"
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
          <Form.Item label="Loại OT">
            <span style={{ color: token.colorTextDescription, fontSize: 13 }}>
              🤖 Hệ thống tự xác định (Ngày thường / Cuối tuần / Ngày lễ)
            </span>
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
            <TextArea rows={3} placeholder="Mô tả công việc sẽ làm thêm..." />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={loading}>Gửi đơn OT</Button>
      </div>
    </Form>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Nghỉ phép',
      children: leaveFormContent,
    },
    {
      key: '2',
      label: 'Làm thêm giờ',
      children: otFormContent,
    },
  ];

  return (
    <Modal
      title={<span className="text-xl font-bold">Tạo Đơn Mới</span>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered
      destroyOnClose
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="middle" />
    </Modal>
  );
}
