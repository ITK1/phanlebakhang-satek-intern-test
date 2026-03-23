import { useState, useEffect } from "react";

function App() {
  // --- 1. KHỞI TẠO STATE (Giống như truy vấn dữ liệu ban đầu) ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("satek_task_manager");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [search, setSearch] = useState("");

  // --- 2. LƯU DỮ LIỆU (Tự động chạy mỗi khi mảng tasks thay đổi) ---
  useEffect(() => {
    localStorage.setItem("satek_task_manager", JSON.stringify(tasks));
  }, [tasks]);

  // --- 3. CÁC HÀM XỬ LÝ LOGIC (CRUD) ---
  const addTask = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newTask = {
      id: Date.now(),
      title: text,
      deadline: deadline,
      status: "TODO", // Trạng thái: TODO, IN_PROGRESS, DONE
    };
    setTasks([newTask, ...tasks]);
    setText("");
    setDeadline("");
  };

  const updateStatus = (id, newStatus) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const deleteTask = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  // --- 4. LOGIC TÌM KIẾM & CẢNH BÁO ---
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()),
  );

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date().setHours(0, 0, 0, 0);
  };

  const isNearDeadline = (dateStr) => {
    if (!dateStr) return false;
    const diff = new Date(dateStr) - new Date();
    return diff > 0 && diff < 86400000; // Còn dưới 24 giờ
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* --- HEADER & THỐNG KÊ --- */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-6">
          <div>
            <h1 className="text-3xl font-black text-blue-600 tracking-tight">
              SATEK <span className="text-slate-400 font-light">TaskFlow</span>
            </h1>
            <p className="text-slate-500 text-sm">
              Quản lý công việc - Intern Test [2026]
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-blue-50 p-3 rounded-xl text-center border border-blue-100">
              <p className="text-[10px] uppercase font-bold text-blue-400">
                Tổng
              </p>
              <p className="text-xl font-black text-blue-700">{tasks.length}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl text-center border border-green-100">
              <p className="text-[10px] uppercase font-bold text-green-400">
                Xong
              </p>
              <p className="text-xl font-black text-green-700">
                {tasks.filter((t) => t.status === "DONE").length}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-xl text-center border border-red-100">
              <p className="text-[10px] uppercase font-bold text-red-400">
                Trễ
              </p>
              <p className="text-xl font-black text-red-700">
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
            onSubmit={addTask}
            className="lg:col-span-2 flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-200"
          >
            <input
              className="flex-1 p-3 outline-none rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Thêm công việc mới..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="date"
              className="p-3 outline-none rounded-lg bg-slate-50 border-none"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
              Thêm
            </button>
          </form>
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <input
              className="w-full p-3 outline-none rounded-lg bg-slate-50"
              placeholder="🔍 Tìm kiếm nhanh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* --- BẢNG CÔNG VIỆC (3 CỘT) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["TODO", "IN_PROGRESS", "DONE"].map((columnStatus) => (
            <div
              key={columnStatus}
              className="bg-slate-200/40 p-4 rounded-2xl min-h-[500px] border border-slate-200/50"
            >
              <div className="flex justify-between items-center mb-5 px-1">
                <h2 className="font-black text-slate-500 text-xs uppercase tracking-widest">
                  {columnStatus === "TODO"
                    ? "📌 Cần làm"
                    : columnStatus === "IN_PROGRESS"
                      ? "⚡ Đang làm"
                      : "✅ Hoàn thành"}
                </h2>
                <span className="bg-white text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-slate-100">
                  {
                    filteredTasks.filter((t) => t.status === columnStatus)
                      .length
                  }
                </span>
              </div>

              <div className="space-y-4">
                {filteredTasks
                  .filter((t) => t.status === columnStatus)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all group relative overflow-hidden"
                    >
                      {/* Cảnh báo deadline bằng thanh màu nhỏ */}
                      {task.deadline && columnStatus !== "DONE" && (
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
                            columnStatus === "DONE"
                              ? "bg-slate-100 text-slate-400"
                              : isOverdue(task.deadline)
                                ? "bg-red-50 text-red-500"
                                : isNearDeadline(task.deadline)
                                  ? "bg-orange-50 text-orange-600"
                                  : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          📅 Hạn: {task.deadline}{" "}
                          {isOverdue(task.deadline) &&
                            columnStatus !== "DONE" &&
                            " - TRỄ!"}
                        </div>
                      )}

                      <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
                        <div className="flex gap-1">
                          {columnStatus !== "TODO" && (
                            <button
                              onClick={() => updateStatus(task.id, "TODO")}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                              title="Chờ"
                            >
                              ⏪
                            </button>
                          )}
                          {columnStatus !== "IN_PROGRESS" && (
                            <button
                              onClick={() =>
                                updateStatus(task.id, "IN_PROGRESS")
                              }
                              className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                              title="Làm"
                            >
                              ▶️
                            </button>
                          )}
                          {columnStatus !== "DONE" && (
                            <button
                              onClick={() => updateStatus(task.id, "DONE")}
                              className="p-1.5 hover:bg-green-50 rounded-lg text-green-500 transition-colors"
                              title="Xong"
                            >
                              ✔️
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg text-red-300 hover:text-red-500 transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
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
