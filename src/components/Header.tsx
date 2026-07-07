import { FaBell, FaCog, FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <div className="header">

      <div>

        <h1>Hello Ravi 👋</h1>

        <p>
          Your Personal Local AI Assistant
        </p>

      </div>

      <div className="header-icons">

        <FaSearch />

        <FaBell />

        <FaCog />

      </div>

    </div>
  );
}