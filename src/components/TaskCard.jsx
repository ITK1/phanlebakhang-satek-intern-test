import { isOverdue, isNearDeadline } from "../utils/helpers";

export default function TaskCard({ task, onUpdate, onDelete, isDone }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all group relative overflow-hidden">
      {!isDone && task.deadline && (
        <div
          className={`absolute top-0 left-0 w-full h-1 ${isOverdue(task.deadline) ? "bg-red-500" : isNearDeadline(task.deadline) ? "bg-orange-400" : "bg-blue-400"}`}
        ></div>
      )}

      <h3 className="font-bold text-slate-700 leading-tight mb-2">
        {task.title}
      </h3>

      {task.deadline && (
        <div
          className={`text-[10px] font-bold inline-block px-2 py-1 rounded ${
            isDone
              ? "bg-slate-100 text-slate-400"
              : isOverdue(task.deadline)
                ? "bg-red-50 text-red-500"
                : isNearDeadline(task.deadline)
                  ? "bg-orange-50 text-orange-600"
                  : "bg-slate-100 text-slate-500"
          }`}
        >
          📅 Hạn: {task.deadline}{" "}
          {isOverdue(task.deadline) && !isDone && " - TRỄ!"}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
        <div className="flex gap-1">
          {onUpdate.map((btn) => (
            <button
              key={btn.status}
              onClick={() => btn.action(task.id, btn.status)}
              className={`p-1.5 rounded-lg transition-colors ${btn.style}`}
            >
              {btn.icon}
            </button>
          ))}
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg text-red-300 hover:text-red-500 transition-all"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
