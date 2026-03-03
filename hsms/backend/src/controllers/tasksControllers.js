import { response } from "express";

import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;
  switch (filter) {
    case "today": {
      // 2026-01-01 00:00
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "week": {
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null;
    }
  }
  //Truy van
  const query = startDate ? { createdAt: { $gte: startDate } } : {};

  try {
    // sort -1 là sort từ dưới lên or 'desc'
    //const tasks = await Task.find().sort({createAt:-1});
    const result = await Task.aggregate([
      // pipeline 
      {$match:query},
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    //Kiem tra xem phan tu dau tien co rong hay khong neu rong tra ve 0
    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;
    const result2 = { tasks, activeCount, completeCount };
    //res.status(200).send(tasks);
    res.status(200).send(result2);
  } catch (error) {
    console.error("Loi khi goi getAllTask", error);
    res.status(500).json({ message: "Loi he thong" });
  }
};

export const createTasks = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Loi khi goi createTasks", error);
    res.status(500).json({ message: "Loi he thong" });
  }
};

export const updateTasks = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updateTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        status,
        completedAt,
      },
      { new: true } //tra ve gia tri sau khi update
    );
    if (!updateTask) {
      return res.status(404).json({
        message: "Nhiem vu khong ton tai",
      });
    }
    res.status(200).json(updateTask);
  } catch (error) {
    console.error("Loi khi goi updateTask", error);
    res.status(500).json({ message: "Loi he thong" });
  }
};

export const deleteTasks = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);
    if (!deleteTask) {
      return res.status(404).json({
        message: "Nhiem vu khong ton tai",
      });
    }
    res.status(200).json(deleteTask);
  } catch (error) {
    console.error("Loi khi goi deleteTask", error);
    res.status(500).json({ message: "Loi he thong" });
  }
};
