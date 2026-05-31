"use client";

import React from "react";

interface ReportHeaderProps {
  title: string;
  description: string;
}

export default function ReportHeader({ title, description }: ReportHeaderProps) {
  return (
    <div className="mb-8">
      <h1
        style={{
          fontSize: "30px",
          fontWeight: 900,
          letterSpacing: "-0.025em",
          color: "var(--primary-color)",
          margin: 0,
        }}
      >
        {title}
      </h1>
      <p className="text-gray-500 mt-1">{description}</p>
    </div>
  );
}
