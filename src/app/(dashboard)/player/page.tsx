"use client";
import TotalClubs from "./components/TotalClubs";
import TotalPlayers from "./components/TotalPlayers";
import TotalUsers from "./components/TotalUsers";
import UserVisits from "./components/UsersVisit";
import Graph from "./components/Graph";
// import RecentActivities from "./components/RecenetActivities";
// import PlayersGraph from "../admin/components/PlayersGraph";
import UserActivationChart from "../admin/components/UserActivationChart";
import ClubsTable from "../admin/components/ClubsTable";

export default function Player() {
  return (
    <div className="bg-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TotalClubs />
        <TotalPlayers />
        <TotalUsers />
        <UserVisits />
      </div>
        <Graph /> 
      <div className="flex space-x-6 mt-6">
        {/* User Activation Pie Chart */}
        <UserActivationChart />

        {/* Clubs Table */}
        <ClubsTable />
        </div>

        {/* <div  className='max-w-full'>
          <RecentActivities />
        </div> */}
    </div>
  );
}
