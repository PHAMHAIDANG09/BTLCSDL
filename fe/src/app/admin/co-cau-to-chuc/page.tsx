"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, Spin, Alert, message } from "antd";
import { getOrganizationTreeApi, Department } from "@/services/organization.service";
import { getEmployeesApi, Employee } from "@/services/employee.service";
import OrgTree from "./_components/OrgTree";

export default function StructurePage() {
  const [treeData, setTreeData] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [orgTree, empList] = await Promise.all([
          getOrganizationTreeApi(),
          getEmployeesApi(),
        ]);
        setTreeData(orgTree);
        setEmployees(empList);
      } catch (err) {
        console.error("Error fetching org data:", err);
        setError("Không thể tải dữ liệu sơ đồ tổ chức.");
        message.error("Không thể tải dữ liệu sơ đồ tổ chức.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const employeeMap = useMemo(() => {
    const map = new Map<number, Employee>();
    employees.forEach(emp => map.set(emp.Id, emp));
    return map;
  }, [employees]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sơ đồ tổ chức</h1>
        </div>
      </div>

      <Card className="shadow-sm border-t-4 border-t-blue-500 rounded-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16">
            <Spin size="large" />
            <p className="mt-4 text-gray-500">Đang tải sơ đồ tổ chức...</p>
          </div>
        ) : error ? (
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        ) : (
          <OrgTree data={treeData} employeeMap={employeeMap} />
        )}
      </Card>
    </div>
  );
}
