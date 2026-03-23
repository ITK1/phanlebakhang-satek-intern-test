import { useState, useEffect } from "react";
import TaskCard from "./components/TaskCard";
import { isOverdue } from "./utils/helpers";

function App() {
  // --- 1. STATE & LOCALSTORAGE ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("khang");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("khang", JSON.stringify(tasks));
  }, [tasks]);

  // --- 2. LOGIC NGHIỆP VỤ ---
  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newTask = {
      id: Date.now(),
      title: text,
      deadline: deadline,
      status: "TODO",
    };
    setTasks([newTask, ...tasks]);
    setText("");
    setDeadline("");
  };

  const moveStatus = (id, newStatus) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const removeTask = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa không?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const getButtons = (currentStatus) => {
    const config = [
      {
        status: "TODO",
        icon: "⏪",
        style: "hover:bg-slate-100 text-slate-400",
      },
      {
        status: "IN_PROGRESS",
        icon: "▶️",
        style: "hover:bg-blue-50 text-blue-500",
      },
      { status: "DONE", icon: "✔️", style: "hover:bg-green-50 text-green-500" },
    ];
    return config
      .filter((c) => c.status !== currentStatus)
      .map((c) => ({ ...c, action: moveStatus }));
  };

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-10 text-slate-100 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 gap-6">
          <div>
            <h1 className="text-3xl font-black text-blue-400 tracking-tight">
              Trang Quản Lý Công Việc Cá Nhân{" "}
            </h1>
            <p className="text-slate-400 text-sm">
              Quản lý công việc - Intern Test [2026]
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-slate-700/50 p-3 rounded-xl text-center border border-slate-600">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Tổng
              </p>
              <p className="text-xl font-black">{tasks.length}</p>
            </div>
            <div className="bg-green-900/20 p-3 rounded-xl text-center border border-green-900/30">
              <p className="text-[10px] uppercase font-bold text-green-400">
                Xong
              </p>
              <p className="text-xl font-black text-green-400">
                {tasks.filter((t) => t.status === "DONE").length}
              </p>
            </div>
            <div className="bg-red-900/20 p-3 rounded-xl text-center border border-red-900/30">
              <p className="text-[10px] uppercase font-bold text-red-400">
                Trễ
              </p>
              <p className="text-xl font-black text-red-400">
                {
                  tasks.filter(
                    (t) => isOverdue(t.deadline) && t.status !== "DONE",
                  ).length
                }
              </p>
            </div>
          </div>
        </header>

        {/* --- FORM NHẬP & TÌM KIẾM --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <form
            onSubmit={handleAdd}
            className="lg:col-span-2 flex flex-col sm:flex-row gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-lg"
          >
            <input
              className="flex-1 p-3 outline-none rounded-lg bg-slate-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-200"
              placeholder="Thêm công việc mới..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="date"
              className="p-3 outline-none rounded-lg bg-slate-900 border-none text-slate-400"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-900/20">
              Thêm
            </button>
          </form>
          <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 flex items-center shadow-lg">
            <input
              className="w-full p-3 outline-none rounded-lg bg-slate-900 text-slate-200"
              placeholder="🔍 Tìm kiếm nhanh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* --- TASK BOARD --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["TODO", "IN_PROGRESS", "DONE"].map((colStatus) => (
            <div
              key={colStatus}
              className="bg-slate-800/40 p-4 rounded-2xl min-h-[500px] border border-slate-800 shadow-inner"
            >
              <div className="flex justify-between items-center mb-5 px-1">
                <h2 className="font-black text-slate-500 text-xs uppercase tracking-widest">
                  {colStatus === "TODO"
                    ? "📌 Cần làm"
                    : colStatus === "IN_PROGRESS"
                      ? "⚡ Đang làm"
                      : "✅ Hoàn thành"}
                </h2>
                <span className="bg-slate-700 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-600">
                  {filtered.filter((t) => t.status === colStatus).length}
                </span>
              </div>

              <div className="space-y-4">
                {filtered
                  .filter((t) => t.status === colStatus)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={getButtons(colStatus)}
                      onDelete={removeTask}
                      isDone={colStatus === "DONE"}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
