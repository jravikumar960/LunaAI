interface Props {
  selected: string;
  setSelected: (value: string) => void;
}

const menus = [
  "Chat",
  "History",
  "Memory",
  "Files",
  "Documents",
  "Vision",
  "Automation",
  "Privacy",
  "Settings",
];

export default function Sidebar({
  selected,
  setSelected,
}: Props) {
  return (
    <aside className="sidebar">

      <div className="logo">

        🤖

        <span>Luna</span>

      </div>

      {menus.map((menu) => (

        <button
          key={menu}
          className={
            selected === menu
              ? "menu active"
              : "menu"
          }
          onClick={() => setSelected(menu)}
        >
          {menu}
        </button>

      ))}

    </aside>
  );
}