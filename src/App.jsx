import { useState, useEffect, useRef } from "react";
import "./index.css";

export default function App() {
  const [timer, setTimer] = useState(6);
  const [deadline, setDeadline] = useState(30);

  return (
    <div className="App" style={styles.app}>
      <Timer
        label="Timer"
        timeInMinutes={timer}
        setTimeInMinutes={setTimer}
        alarmSoundUrl="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
      />
      <Timer
        label="Deadline"
        timeInMinutes={deadline}
        setTimeInMinutes={setDeadline}
        alarmSoundUrl="https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg"
      />
    </div>
  );
}

function Timer({ label, timeInMinutes, setTimeInMinutes, alarmSoundUrl }) {
  const [timeLeft, setTimeLeft] = useState(timeInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const alarmRef = useRef(new Audio(alarmSoundUrl));

  useEffect(() => {
    setTimeLeft(timeInMinutes * 60);
  }, [timeInMinutes]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            alarmRef.current.play();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeLeft(timeInMinutes * 60);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(timeInMinutes * 60);
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div style={styles.timerContainer}>
      <h2 style={styles.label}>{label}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="number"
          value={timeInMinutes}
          onChange={(e) => setTimeInMinutes(Number(e.target.value))}
          step="0.1"
          min="0"
          style={styles.input}
          aria-label={`${label} time input in minutes`}
        />
        <button
          type="submit"
          style={{ ...styles.button, ...styles.startButton }}
        >
          Start
        </button>
      </form>

      <h1 style={styles.timerDisplay}>{formatTime(timeLeft)}</h1>

      <div style={styles.buttonGroup}>
        <button
          onClick={handlePause}
          disabled={!isRunning}
          style={{
            ...styles.button,
            ...(isRunning ? {} : styles.disabledButton),
          }}
        >
          Pause
        </button>
        <button onClick={handleReset} style={styles.button}>
          Reset
        </button>
      </div>
    </div>
  );
}

const styles = {
  app: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "10px",
    // fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  timerContainer: {
    border: "2px solid #444",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#fafafa",
  },

  label: {
    marginBottom: "15px",
    fontSize: "1.5rem",
    color: "#222",
  },

  form: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  input: {
    flexGrow: 1,
    minWidth: "80px",
    padding: "8px 12px",
    fontSize: "1.1rem",
    borderRadius: "6px",
    border: "1.5px solid #ccc",
    transition: "border-color 0.3s",
  },

  button: {
    padding: "10px 20px",
    fontSize: "1.1rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    userSelect: "none",
    transition: "background-color 0.3s",
    color: "white",
    backgroundColor: "#007bff",
  },

  startButton: {
    backgroundColor: "#28a745",
  },

  disabledButton: {
    backgroundColor: "#aaa",
    cursor: "not-allowed",
  },

  timerDisplay: {
    fontSize: "3rem",
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: "20px",
    fontVariantNumeric: "tabular-nums",
  },

  buttonGroup: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
  },
};
