import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {title && <h2 className="font-bold mb-2 text-xl font-bold text-blue-500">{title}</h2>}
      {children}
    </div>
  );
}