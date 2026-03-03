import AddTask from "@/components/AddTask.jsx";
import DateTimeFilter from "@/components/DateTimeFilter.jsx";
import Footer from "@/components/Footer.jsx";
import Header from "@/components/Header.jsx";
import StatsAndFilters from "@/components/StatsAndFilters.jsx";
import TaskList from "@/components/TaskList.jsx";
import TaskListPagination from "@/components/TaskListPagination.jsx";
import React from "react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";
//import axios from "axios"; //goi api de hon

const HomePage = () => {
  // Handle backend
  const [taskBuffer, settaskBuffer] = useState([]);
  //Tao 2 useState luu gia tri cua activeCount va compleCount (1)
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteCount] = useState(0);

  //luu filter hien tai
  const [filter, setFilter] = useState("all");
  //Fillter datetime
  const [dateQuery, setDateQuery] = useState("today");
  //paging
  const [page, setPage] = useState(1);
  // Lay API
  // Nếu lỗi CORS:cài npm i cors và import trong index.js backend
  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);
  //sua loi paging complete
  useEffect(() => {
    setPage(1)
  },[filter,dateQuery])


  const fetchTasks = async () => {
    //Logic
    try {
      //const res = await axios.get("http://localhost:5001/api/tasks");
      //const res = await api.get("/tasks");
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      settaskBuffer(res.data.tasks);

      //Tao 2 useState luu gia tri cua activeCount va compleCount (2)
      setActiveTaskCount(res.data.activeCount);
      setCompleteCount(res.data.completeCount);

      //console.log(res.data);
    } catch (error) {
      console.error("Error access tasks: ", error);
      toast.error("Error access tasks");
    }
  };

  const handleTaskChanged = () => {
    fetchTasks();
  };

  const handleNext = () =>{//paging next
    if(page<totalPages){
      setPage((prev) => prev + 1);
    }
  }
  const handlePrev = () =>{//paging back
    if(page>1){
      setPage((prev) => prev - 1);
    }
  }
  const handlePageChange  = (newPage) =>{//paging any
    setPage(newPage);
  }
  //bien luu danh sach nhiem vu da loc
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
    }
  });
  //slide dung de cat mang tu index dau tien toi index truoc
  //vi du:[0,1,2,3,4].slice(0,2) => [0,1]
  const visibleTasks = filteredTasks.slice(
    (page-1) * visibleTaskLimit,
    page * visibleTaskLimit
  );
  
  //sua loi paging delete 
  if(visibleTasks.length === 0){
    handlePrev();
  }


  //tong so trang
  const totalPages = Math.ceil(filteredTasks.length/visibleTaskLimit);//lam tron len


  // Handle Front end
  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      {/* Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />
      {/* Your Content/Components */}
      {/* relative z-10(index10) of background */}
      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* Đầu Trang */}
          <Header />
          {/* Tạo Nhiệm Vụ */}
          <AddTask handleNewTaskAdded={handleTaskChanged} />
          {/* Thống Kê và Bộ lọc */}
          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />
          {/* Danh Sách Nhiệm Vụ */}
          <TaskList filteredTasks={visibleTasks} 
                    filter={filter}
                    handleTaskChanged={handleTaskChanged} />
          {/* Phân Trang và Lọc Theo Date */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination 
              handleNext = {handleNext}
              handlePrev = {handlePrev}
              handlePageChange = {handlePageChange}
              page = {page}
              totalPages = {totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery}/>
          </div>
          {/* Footer */}
          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
