import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home/Home";
import Cookbook from "../pages/Cookbook/Cookbook";
import WeekPlan from "../pages/WeekPlan/WeekPlan";
import Groceries from "../pages/Groceries/Groceries";
import SurpriseMe from "../pages/SurpriseMe";


export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cookbook" element={<Cookbook />} />
        <Route path="/week-plan" element={<WeekPlan />} />
        <Route path="/groceries" element={<Groceries />} />
        <Route path="/surprise" element={<SurpriseMe />} />
      </Route>
    </Routes>
  );
}
