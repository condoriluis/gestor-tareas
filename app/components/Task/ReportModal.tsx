import { MdClose, MdPhotoCamera } from "react-icons/md";
import { 
  MdCheckCircle, 
  MdAccessTime, 
  MdOutlinePriorityHigh, 
  MdTrendingUp,
  MdArrowUpward,
  MdArrowDownward 
} from 'react-icons/md';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTaskUser } from '@/app/context/TaskUserContext';
import { showToast } from "@/utils/toastMessages";
import { useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';

type ChartData = {
  name: string;
  value: number;
  color: string;
};

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tasks: any[];
};

export const ReportModal = ({ isOpen, onClose, tasks }: ReportModalProps) => {

  const { userId, userName, setUserId } = useTaskUser();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCapture = async () => {
    if (!modalRef.current) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(modalRef.current, {
        backgroundColor: '#1E1E1E',
        quality: 1,
        pixelRatio: 2
      });
      
      saveAs(dataUrl, `reporte-tareas-${new Date().toISOString().slice(0,10)}.png`);
      showToast('Captura guardada correctamente', 'success');
    } catch (error) {
      showToast('Error al guardar la captura', 'error');
    }
  };

  if (!isOpen) return null;

  const reportData: ChartData[] = [
    { name: 'Por hacer', value: tasks.filter(t => t.status_task === 'todo').length, color: '#6B7280' },
    { name: 'En progreso', value: tasks.filter(t => t.status_task === 'in_progress').length, color: '#3B82F6' },
    { name: 'Completadas', value: tasks.filter(t => t.status_task === 'done').length, color: '#10B981' },
  ];

  const priorityData = [
    {
      name: 'Baja',
      value: tasks.filter(t => t.priority_task === 'low').length,
      color: '#3B82F6'
    },
    {
      name: 'Media',
      value: tasks.filter(t => t.priority_task === 'medium').length,
      color: '#F59E0B'
    },
    {
      name: 'Alta',
      value: tasks.filter(t => t.priority_task === 'high').length,
      color: '#EF4444'
    }
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name
  }: any) => {
    if (!percent || percent <= 0) return '';
    
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  const calculateAvgCompletionTime = () => {
    const completedTasks = tasks.filter(t => t.status_task === 'done' && t.date_start_task && t.date_completed_task);
    if (completedTasks.length === 0) return 'N/A';
    
    const totalMs = completedTasks.reduce((sum, task) => {
      const start = new Date(task.date_start_task).getTime();
      const end = new Date(task.date_completed_task).getTime();
      return sum + (end - start);
    }, 0);
    
    const avgMs = totalMs / completedTasks.length;
    
    const days = Math.floor(avgMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((avgMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));
    
    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0 || days > 0) result += `${hours}h `;
    result += `${mins}m`;
    
    return result.trim();
  };

  const calculateCompletionRate = () => {
    if (tasks.length === 0) return '0%';
    return `${Math.round((tasks.filter(t => t.status_task === 'done').length / tasks.length) * 100)}%`;
  };

  const getMostCommonPriority = () => {
    const counts = {
      high: tasks.filter(t => t.priority_task === 'high').length,
      medium: tasks.filter(t => t.priority_task === 'medium').length,
      low: tasks.filter(t => t.priority_task === 'low').length
    };
    
    const max = Math.max(...Object.values(counts));
    const result = Object.entries(counts).find(([_, value]) => value === max);
    return result ? result[0] : 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300">
      <div 
        ref={modalRef} 
        className="bg-[#1E1E1E] border border-gray-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] max-h-[800px] flex flex-col overflow-hidden animate-fade-in-up mx-2 sm:mx-4"
      >
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg sm:text-2xl font-semibold text-white">Reportes de Tareas { userId ? <span> de: <span className="text-[#00E57B]">{userName}</span></span> : ''}</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Resumen visual de {userId ? 'su' : 'tu'} productividad</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCapture}
              className="text-gray-400 hover:text-white p-1 sm:p-2 rounded-full hover:bg-gray-800 transition-all cursor-pointer"
            >
              <MdPhotoCamera size={20} className="sm:w-6 sm:h-6 w-5 h-5"/>
            </button>

            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 sm:p-2 rounded-full hover:bg-gray-800 transition-all"
            >
              <MdClose size={20} className="sm:w-6 sm:h-6 w-5 h-5"/>
            </button>

          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {[
              { 
                label: "Tareas completadas", 
                value: `${tasks.filter(t => t.status_task === 'done').length}/${tasks.length}`,
                icon: MdCheckCircle,
                color: 'text-green-500',
                trend: 'up'
              },
              { 
                label: "Tiempo promedio de finalización", 
                value: calculateAvgCompletionTime(),
                icon: MdAccessTime,
                color: 'text-blue-500'
              },
              { 
                label: "Prioridad común", 
                value: {
                  high: 'Alta',
                  medium: 'Media',
                  low: 'Baja'
                }[getMostCommonPriority()] || 'N/A',
                icon: MdOutlinePriorityHigh,
                color: 'text-yellow-500'
              },
              { 
                label: "Tasa de completado", 
                value: calculateCompletionRate(),
                icon: MdTrendingUp,
                color: 'text-purple-500',
                trend: 'up'
              }
            ].map((metric, i) => (
              <div key={i} className="bg-[#252525] p-3 sm:p-5 rounded-lg sm:rounded-xl border border-gray-800 hover:bg-[#2A2A2A] transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <metric.icon className={`${metric.color} w-4 h-4 sm:w-5 sm:h-5`}/>
                      {metric.label}
                    </p>
                    <p className="text-white text-xl sm:text-2xl font-medium">{metric.value}</p>
                  </div>
                  {metric.trend && (
                    <div className={`p-1 sm:p-1.5 rounded-full ${metric.trend === 'up' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      {metric.trend === 'up' ? <MdArrowUpward size={14} className="sm:w-4 sm:h-4 w-3 h-3"/> : <MdArrowDownward size={14} className="sm:w-4 sm:h-4 w-3 h-3"/>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            <div className="bg-[#252525] p-4 sm:p-4 rounded-lg sm:rounded-xl border border-gray-800">
              <h4 className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6">Estado de Tareas</h4>
              <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={window.innerWidth < 768 ? 80 : 120}
                      innerRadius={window.innerWidth < 768 ? 40 : 60}
                      dataKey="value"
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {reportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip 
                      formatter={(value: number) => [`${value} tareas`, 'Cantidad']}
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        borderColor: '#FFFFFF',
                        color: '#FFFFFF'
                      }}
                      itemStyle={{ color: '#FFFFFF' }}
                      labelStyle={{ color: '#FFFFFF' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#252525] p-4 sm:p-4 rounded-lg sm:rounded-xl border border-gray-800">
              <h4 className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6">Prioridad de Tareas</h4>
              <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={priorityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis dataKey="name" stroke="#D1D5DB" />
                    <YAxis stroke="#D1D5DB" />
                    <Tooltip 
                      formatter={(value: number) => [`${value} tareas`, 'Cantidad']}
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        borderColor: '#FFFFFF',
                        color: '#FFFFFF'
                      }}
                      itemStyle={{ color: '#FFFFFF' }}
                      labelStyle={{ color: '#FFFFFF' }}
                    />
                    <Bar 
                      dataKey="value" 
                      animationDuration={1000}
                      radius={[4, 4, 0, 0]}
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
