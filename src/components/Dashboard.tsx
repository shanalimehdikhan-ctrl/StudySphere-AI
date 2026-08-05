import { useNavigate } from "react-router-dom";

type DashboardProps = {
  onOpenTutor?: () => void;
};

export default function Dashboard({ onOpenTutor }: DashboardProps) {
  const navigate = useNavigate();

  const handleTutorClick = () => {
    onOpenTutor?.();
    navigate("/chat");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>📚 StudySphere AI</h1>
      <p>Learn Smarter with AI</p>

      <button
        onClick={handleTutorClick}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        🤖 Open AI Tutor
      </button>
    </div>
  );
}