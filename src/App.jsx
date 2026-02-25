import { useState } from "react";
import Contents from "./components/Contents/Contents";
import Header from "./components/Header/Header";
import Menu from "./components/Menu/Menu";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Menu activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Contents activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
}


