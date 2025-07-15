'use client';

import React, { useState } from 'react';
import { MdClose, MdDescription } from 'react-icons/md';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-[#1E1E1E] border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Acerca del Gestor de Tareas</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-all duration-200"
          >
            <MdClose size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-6">
          <section className="bg-[#2A2A2A] p-4 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-3">Descripción del Proyecto</h3>
            <p className="text-gray-300">
              El Gestor de Tareas es una aplicación profesional diseñada para mejorar la productividad 
              y organización del trabajo en equipo. Permite crear, asignar y hacer seguimiento de tareas 
              con diferentes niveles de prioridad y estados.
            </p>
          </section>
          
          <section className="bg-[#2A2A2A] p-4 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-3">Características Principales</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Gestión completa de tareas con historial de cambios</li>
              <li>Roles de usuario (admin/user) con permisos diferenciados</li>
              <li>Interfaz intuitiva y responsive</li>
              <li>Documentación API completa con Swagger</li>
              <li>Desarrollado con Next.js v15+, React y TypeScript</li>
            </ul>
          </section>
          
          <section className="bg-[#2A2A2A] p-4 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-3">Documentación API</h3>
            <p className="text-gray-300 mb-4">
              Explora nuestra documentación interactiva para integrarte con el backend:
            </p>
            <a 
              href="/api-docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#00E57B] hover:bg-teal-600 text-[#1E1E1E] font-medium px-4 py-2 rounded transition"
            >
              <MdDescription size={18} />
              Ver Documentación Swagger
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};
