import React, { useState } from 'react';
import { Plus, X, ArrowRight, ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';
import { KanbanTask } from '../types';

interface KanbanBoardProps {
  tasks: KanbanTask[];
  onAddTask: (content: string, status: KanbanTask['status']) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: KanbanTask['status']) => void;
  onDeleteTask: (taskId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onAddTask, onUpdateTaskStatus, onDeleteTask }) => {
  const [newTaskInput, setNewTaskInput] = useState<{ [key: string]: string }>({});

  const columns: { id: KanbanTask['status']; label: string; color: string; icon: React.ElementType }[] = [
    { id: 'todo', label: 'To Do', color: 'bg-slate-100 border-slate-200', icon: Circle },
    { id: 'doing', label: 'In Progress', color: 'bg-blue-50 border-blue-200', icon: Clock },
    { id: 'done', label: 'Done', color: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  ];

  const handleAddTask = (columnId: KanbanTask['status']) => {
    const content = newTaskInput[columnId]?.trim();
    if (!content) return;
    onAddTask(content, columnId);
    setNewTaskInput({ ...newTaskInput, [columnId]: '' });
  };

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-6 h-full min-w-[1000px] p-1">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id).sort((a, b) => b.createdAt - a.createdAt);
          const Icon = col.icon;

          return (
            <div key={col.id} className={`flex-1 flex flex-col rounded-xl border ${col.color} h-full max-h-full`}>
              {/* Column Header */}
              <div className="p-4 flex items-center justify-between border-b border-black/5 bg-white/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-slate-600" />
                  <h3 className="font-semibold text-slate-800">{col.label}</h3>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 shadow-sm">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* Add Task Input */}
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <input
                    type="text"
                    placeholder="Add a task..."
                    className="w-full text-sm outline-none placeholder-slate-400 mb-2"
                    value={newTaskInput[col.id] || ''}
                    onChange={(e) => setNewTaskInput({ ...newTaskInput, [col.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask(col.id)}
                  />
                  <div className="flex justify-end">
                     <button 
                        onClick={() => handleAddTask(col.id)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                     >
                        <Plus size={16} />
                     </button>
                  </div>
                </div>

                {colTasks.map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 group hover:shadow-md transition-all">
                    <p className="text-slate-700 text-sm mb-3 leading-relaxed">{task.content}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                      <div className="flex gap-1">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, col.id === 'done' ? 'doing' : 'todo')}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                            title="Move Back"
                          >
                            <ArrowLeft size={16} />
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, col.id === 'todo' ? 'doing' : 'done')}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                            title="Move Forward"
                          >
                            <ArrowRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
