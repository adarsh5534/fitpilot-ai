import { useEffect, useMemo, useState } from "react";

type Tab = "home" | "workouts" | "nutrition" | "progress" | "profile";
type IconName =
  | "home"
  | "workouts"
  | "nutrition"
  | "progress"
  | "profile"
  | "spark"
  | "bell"
  | "chevron"
  | "play"
  | "clock"
  | "fire"
  | "drop"
  | "steps"
  | "plus"
  | "search"
  | "check"
  | "send"
  | "back"
  | "more"
  | "scale"
  | "ruler"
  | "trophy"
  | "settings"
  | "target"
  | "calendar"
  | "edit"
  | "heart"
  | "moon"
  | "zap"
  | "camera"
  | "lock"
  | "help"
  | "logout";

const paths: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5.5 9.5V21h13V9.5M9 21v-6h6v6" />
    </>
  ),
  workouts: (
    <>
      <path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11" />
    </>
  ),
  nutrition: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12C6 12 4 8 4 3c5 0 8 2 8 7" />
      <path d="M12 15c1-5 4-7 8-7 0 5-3 8-8 8" />
    </>
  ),
  progress: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
      <path d="M2 19h21" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.7-5 3.3-7 8-7s7.3 2 8 7" />
    </>
  ),
  spark: (
    <>
      <path d="m12 2 1.7 5.2L19 9l-5.3 1.8L12 16l-1.7-5.2L5 9l5.3-1.8L12 2Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  play: <path d="m8 5 11 7-11 7V5Z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  fire: (
    <path d="M12 22c4 0 7-3 7-7 0-6-5-9-7-13 0 5-7 6-7 13 0 4 3 7 7 7Zm0-3c-2 0-3-1.3-3-3 0-2.5 2-3.5 3-5.5 0 2.5 3 3.3 3 5.5 0 1.7-1 3-3 3Z" />
  ),
  drop: <path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z" />,
  steps: (
    <>
      <path d="M8 13c-2.5.8-4 2.4-3.4 4.2.7 2.1 3.4 2.5 5.2 1.2 2.1-1.4 1.3-6.1-1.8-5.4Z" />
      <path d="M15 4c-2.5.8-4 2.4-3.4 4.2.7 2.1 3.4 2.5 5.2 1.2C19 8 18.1 3.3 15 4Z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  send: (
    <>
      <path d="m3 3 18 9-18 9 3-9-3-9Z" />
      <path d="M6 12h15" />
    </>
  ),
  back: (
    <>
      <path d="m15 18-6-6 6-6" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
  scale: (
    <>
      <path d="M5 5h14l2 16H3L5 5Z" />
      <path d="M9 9a3 3 0 0 1 6 0" />
    </>
  ),
  ruler: (
    <>
      <path d="m4 17 13-13 3 3L7 20l-3-3Z" />
      <path d="m14 7 3 3M11 10l2 2M8 13l3 3" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5c0 3-1.5 5-4 5s-4-2-4-5V4Z" />
      <path d="M8 6H4c0 4 1 6 5 6M16 6h4c0 4-1 6-5 6M12 14v4M8 21h8M9 18h6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4M17 3v4M3 10h18" />
    </>
  ),
  edit: (
    <>
      <path d="m14 5 5 5L8 21H3v-5L14 5Z" />
      <path d="m12 7 5 5" />
    </>
  ),
  heart: (
    <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
  zap: <path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z" />,
  camera: (
    <>
      <path d="M4 7h4l1.5-2h5L16 7h4v13H4V7Z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.6 2.6 0 1 1 4 2.2c-1 .6-1.5 1.3-1.5 2.3M12 17h.01" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10" />
    </>
  ),
};

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Ring({
  value,
  size = 88,
  width = 8,
  children,
  color = "#B8F34A",
}: {
  value: number;
  size?: number;
  width?: number;
  children?: React.ReactNode;
  color?: string;
}) {
  const r = (size - width) / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,.08)"
          strokeWidth={width}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={width}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <div className="ring-content">{children}</div>
    </div>
  );
}

function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && (
        <button onClick={onAction}>
          {action}
          <Icon name="chevron" size={14} />
        </button>
      )}
    </div>
  );
}

function Header({
  title,
  subtitle,
  onCoach,
}: {
  title?: string;
  subtitle?: string;
  onCoach: () => void;
}) {
  return (
    <header className="top-header">
      <div>
        {subtitle && <span className="eyebrow">{subtitle}</span>}
        <h1>{title}</h1>
      </div>
      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications">
          <Icon name="bell" />
        </button>
        <button className="coach-orb" onClick={onCoach} aria-label="Open AI coach">
          <Icon name="spark" size={20} />
        </button>
      </div>
    </header>
  );
}

function MacroBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  return (
    <div className="macro-row">
      <div>
        <span>{label}</span>
        <b>
          {value}
          <small> / {total}g</small>
        </b>
      </div>
      <div className="bar">
        <i style={{ width: `${Math.min(100, (value / total) * 100)}%`, background: color }} />
      </div>
    </div>
  );
}

function Home({ go }: { go: (tab: Tab | "coach") => void }) {
  return (
    <div className="screen">
      <Header
        subtitle="WEDNESDAY, JUNE 18"
        title="Good morning, Alex"
        onCoach={() => go("coach")}
      />
      <section className="hero-workout">
        <img
          src="https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?auto=format&fit=crop&w=900&q=85"
          alt="Athlete strength training in a dark gym"
        />
        <div className="hero-shade" />
        <div className="hero-top">
          <span className="pill lime">TODAY</span>
          <span className="streak">
            <Icon name="fire" size={15} /> 12 day streak
          </span>
        </div>
        <div className="hero-copy">
          <span className="eyebrow">PUSH • STRENGTH</span>
          <h2>Chest & Triceps</h2>
          <p>6 exercises · 45 min</p>
          <button className="primary" onClick={() => go("workouts")}>
            <Icon name="play" size={17} /> Start workout
          </button>
        </div>
      </section>

      <SectionTitle title="Today's progress" action="Details" onAction={() => go("progress")} />
      <section className="card calorie-card">
        <Ring value={67} size={116} width={10}>
          <b>1,540</b>
          <span>of 2,300 kcal</span>
        </Ring>
        <div className="macro-list">
          <MacroBar label="Protein" value={118} total={170} color="#B8F34A" />
          <MacroBar label="Carbs" value={142} total={240} color="#E6A6FF" />
          <MacroBar label="Fats" value={48} total={75} color="#FFB45C" />
        </div>
      </section>

      <div className="stat-grid">
        <div className="card mini-stat">
          <div className="stat-icon purple">
            <Icon name="steps" />
          </div>
          <span>Steps</span>
          <b>7,842</b>
          <small>of 10,000</small>
          <div className="bar">
            <i style={{ width: "78%" }} />
          </div>
        </div>
        <div className="card mini-stat">
          <div className="stat-icon blue">
            <Icon name="drop" />
          </div>
          <span>Water</span>
          <b>
            1.8 <small>L</small>
          </b>
          <small>of 2.5 L</small>
          <button className="round-plus" aria-label="Add water">
            <Icon name="plus" size={16} />
          </button>
        </div>
      </div>

      <SectionTitle title="FitPilot insight" />
      <button className="coach-card" onClick={() => go("coach")}>
        <span className="ai-mark">
          <Icon name="spark" />
        </span>
        <span>
          <b>You're primed for a strong session</b>
          <small>
            Your sleep and recovery are up. Consider adding 2.5 kg to your bench press today.
          </small>
          <em>
            Ask FitPilot <Icon name="chevron" size={14} />
          </em>
        </span>
      </button>
    </div>
  );
}

const exercises = [
  { name: "Barbell Bench Press", meta: "4 sets · 6–8 reps", prev: "Last: 80 kg × 7", letter: "BP" },
  {
    name: "Incline Dumbbell Press",
    meta: "3 sets · 8–10 reps",
    prev: "Last: 28 kg × 9",
    letter: "IP",
  },
  { name: "Cable Chest Fly", meta: "3 sets · 10–12 reps", prev: "Last: 16 kg × 12", letter: "CF" },
  {
    name: "Rope Tricep Pushdown",
    meta: "3 sets · 10–12 reps",
    prev: "Last: 25 kg × 11",
    letter: "TP",
  },
];

function Workouts() {
  const [active, setActive] = useState(false);
  const [done, setDone] = useState<number[]>([]);
  const [rest, setRest] = useState(0);
  useEffect(() => {
    if (!rest) return;
    const timer = setInterval(() => setRest((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(timer);
  }, [rest]);
  const complete = (i: number) => {
    setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
    if (!done.includes(i)) setRest(90);
  };
  if (active)
    return (
      <div className="screen active-screen">
        <div className="workout-header">
          <button className="icon-button" onClick={() => setActive(false)}>
            <Icon name="back" />
          </button>
          <div>
            <span>ACTIVE WORKOUT</span>
            <b>Chest & Triceps</b>
          </div>
          <button className="finish" onClick={() => setActive(false)}>
            Finish
          </button>
        </div>
        <div className="workout-time">
          <div>
            <small>Duration</small>
            <b>24:18</b>
          </div>
          <div>
            <small>Volume</small>
            <b>4,820 kg</b>
          </div>
          <div>
            <small>Sets</small>
            <b>{done.length}/10</b>
          </div>
        </div>
        <section className="active-exercise">
          <div className="exercise-heading">
            <span className="exercise-art">BP</span>
            <div>
              <h2>Barbell Bench Press</h2>
              <p>4 sets · 6–8 reps</p>
            </div>
            <Icon name="more" />
          </div>
          <div className="set-labels">
            <span>SET</span>
            <span>PREVIOUS</span>
            <span>KG</span>
            <span>REPS</span>
            <span></span>
          </div>
          {[
            ["1", "77.5 × 8", "80", "8"],
            ["2", "77.5 × 7", "80", "7"],
            ["3", "77.5 × 7", "80", ""],
            ["4", "75 × 8", "77.5", ""],
          ].map((row, i) => (
            <div className={`set-row ${done.includes(i) ? "completed" : ""}`} key={row[0]}>
              <b>{row[0]}</b>
              <span>{row[1]}</span>
              <input aria-label={`Set ${i + 1} weight`} defaultValue={row[2]} />
              <input aria-label={`Set ${i + 1} reps`} defaultValue={row[3]} />
              <button onClick={() => complete(i)} aria-label={`Complete set ${i + 1}`}>
                <Icon name="check" size={18} />
              </button>
            </div>
          ))}
          <button className="add-set">
            <Icon name="plus" size={16} /> Add set
          </button>
        </section>
        <section className="next-exercise">
          <span>NEXT EXERCISE</span>
          <b>Incline Dumbbell Press</b>
          <small>3 sets · 8–10 reps</small>
        </section>
        {rest > 0 && (
          <div className="rest-timer">
            <Ring value={((90 - rest) / 90) * 100} size={44} width={4}>
              <Icon name="clock" size={16} />
            </Ring>
            <span>
              <small>REST TIMER</small>
              <b>
                {Math.floor(rest / 60)}:{String(rest % 60).padStart(2, "0")}
              </b>
            </span>
            <button onClick={() => setRest((r) => r + 30)}>+30s</button>
            <button onClick={() => setRest(0)}>Skip</button>
          </div>
        )}
      </div>
    );

  return (
    <div className="screen">
      <Header subtitle="YOUR TRAINING" title="Workouts" onCoach={() => {}} />
      <div className="week-strip">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <button className={i === 2 ? "selected" : i < 2 ? "done" : ""} key={i}>
            <span>{day}</span>
            <b>{16 + i}</b>
            {i < 2 && (
              <i>
                <Icon name="check" size={10} />
              </i>
            )}
          </button>
        ))}
      </div>
      <section className="schedule-card">
        <div className="schedule-top">
          <div>
            <span className="pill lime">TODAY</span>
            <small>WEEK 3 · DAY 2</small>
          </div>
          <Icon name="more" />
        </div>
        <h2>Chest & Triceps</h2>
        <p>Strength · 6 exercises · 45 min</p>
        <div className="exercise-stack">
          {exercises.slice(0, 3).map((x, i) => (
            <div key={x.name}>
              <span className="exercise-art">{x.letter}</span>
              <span>
                <b>{x.name}</b>
                <small>{x.meta}</small>
              </span>
              {i === 2 ? <small className="more-count">+3</small> : null}
            </div>
          ))}
        </div>
        <button className="primary full" onClick={() => setActive(true)}>
          <Icon name="play" size={17} /> Start workout
        </button>
      </section>
      <SectionTitle title="This week" />
      <div className="week-summary card">
        <div>
          <b>2</b>
          <span>Workouts</span>
        </div>
        <div>
          <b>1h 34m</b>
          <span>Training time</span>
        </div>
        <div>
          <b>12.4k</b>
          <span>Volume</span>
        </div>
      </div>
      <SectionTitle title="Exercise library" action="See all" />
      <label className="search-box">
        <Icon name="search" />
        <input placeholder="Search exercises" />
        <button aria-label="Filter">
          <Icon name="settings" size={18} />
        </button>
      </label>
      <div className="chips">
        <button className="active">All</button>
        <button>Chest</button>
        <button>Back</button>
        <button>Legs</button>
        <button>Arms</button>
      </div>
    </div>
  );
}

function Nutrition() {
  const [water, setWater] = useState(5);
  return (
    <div className="screen">
      <Header subtitle="WEDNESDAY, JUNE 18" title="Nutrition" onCoach={() => {}} />
      <div className="date-switch">
        <button>
          <Icon name="back" size={16} />
        </button>
        <b>Today</b>
        <button>
          <Icon name="chevron" size={16} />
        </button>
      </div>
      <section className="card nutrition-hero">
        <Ring value={67} size={142} width={11}>
          <small>Remaining</small>
          <b>760</b>
          <span>kcal</span>
        </Ring>
        <div className="cal-equation">
          <span>
            <b>2,300</b>
            <small>Goal</small>
          </span>
          <i>−</i>
          <span>
            <b>1,540</b>
            <small>Food</small>
          </span>
          <i>+</i>
          <span>
            <b>0</b>
            <small>Exercise</small>
          </span>
        </div>
        <div className="macro-circles">
          <div>
            <Ring value={69} size={46} width={4} />
            <b>118g</b>
            <small>Protein</small>
          </div>
          <div>
            <Ring value={59} size={46} width={4} color="#E6A6FF" />
            <b>142g</b>
            <small>Carbs</small>
          </div>
          <div>
            <Ring value={64} size={46} width={4} color="#FFB45C" />
            <b>48g</b>
            <small>Fats</small>
          </div>
        </div>
      </section>
      <SectionTitle title="Meals" />
      <div className="meal-list">
        {[
          ["Breakfast", "420 kcal", "Oats, banana & whey", "B"],
          ["Lunch", "680 kcal", "Chicken rice bowl", "L"],
          ["Snack", "210 kcal", "Greek yogurt & berries", "S"],
          ["Dinner", "230 kcal", "2 items logged", "D"],
        ].map((m, i) => (
          <div className="meal card" key={m[0]}>
            <span className={`meal-icon m${i}`}>{m[3]}</span>
            <span>
              <b>{m[0]}</b>
              <small>{m[2]}</small>
            </span>
            <span className="meal-cal">
              <b>{m[1]}</b>
              <button>
                <Icon name="plus" size={17} />
              </button>
            </span>
          </div>
        ))}
      </div>
      <section className="card water-card">
        <div className="water-top">
          <span className="stat-icon blue">
            <Icon name="drop" />
          </span>
          <span>
            <b>Water</b>
            <small>{water * 250} ml of 2,500 ml</small>
          </span>
          <b>{water}/10</b>
        </div>
        <div className="water-glasses">
          {Array.from({ length: 10 }).map((_, i) => (
            <button onClick={() => setWater(i + 1)} className={i < water ? "filled" : ""} key={i} />
          ))}
        </div>
      </section>
      <button className="floating-add">
        <Icon name="plus" /> Log food
      </button>
    </div>
  );
}

function LineChart() {
  return (
    <svg viewBox="0 0 340 150" className="line-chart" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B8F34A" stopOpacity=".26" />
          <stop offset="1" stopColor="#B8F34A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 65, 105, 145].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="340"
          y2={y}
          stroke="rgba(255,255,255,.06)"
          strokeWidth="1"
        />
      ))}
      <path
        d="M0 22 C35 30,45 40,78 42 S122 65,155 70 S198 88,230 95 S280 100,340 128 L340 150 L0 150Z"
        fill="url(#chartFill)"
      />
      <path
        d="M0 22 C35 30,45 40,78 42 S122 65,155 70 S198 88,230 95 S280 100,340 128"
        fill="none"
        stroke="#B8F34A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="230" cy="95" r="5" fill="#101211" stroke="#B8F34A" strokeWidth="3" />
    </svg>
  );
}

function Progress() {
  const [period, setPeriod] = useState("3M");
  return (
    <div className="screen">
      <Header subtitle="KEEP MOVING FORWARD" title="Progress" onCoach={() => {}} />
      <div className="segmented">
        {["1M", "3M", "6M", "1Y"].map((x) => (
          <button className={period === x ? "active" : ""} onClick={() => setPeriod(x)} key={x}>
            {x}
          </button>
        ))}
      </div>
      <section className="card weight-chart">
        <div className="chart-title">
          <span>
            <small>CURRENT WEIGHT</small>
            <b>
              78.4 <em>kg</em>
            </b>
          </span>
          <span className="trend">−3.8 kg</span>
        </div>
        <LineChart />
        <div className="chart-labels">
          <span>MAR</span>
          <span>APR</span>
          <span>MAY</span>
          <span>JUN</span>
        </div>
        <div className="goal-line">
          <Icon name="target" size={16} />
          <span>Goal weight</span>
          <b>75 kg</b>
        </div>
      </section>
      <div className="stat-grid">
        <div className="card progress-stat">
          <span className="stat-icon purple">
            <Icon name="ruler" />
          </span>
          <small>Body fat</small>
          <b>18.2%</b>
          <em>−1.4%</em>
        </div>
        <div className="card progress-stat">
          <span className="stat-icon orange">
            <Icon name="zap" />
          </span>
          <small>Muscle mass</small>
          <b>34.8 kg</b>
          <em>+0.6 kg</em>
        </div>
      </div>
      <SectionTitle title="Strength progress" action="See all" />
      <section className="card strength-list">
        {[
          ["Bench press", "82.5 kg", "+7.5 kg", "82"],
          ["Back squat", "110 kg", "+10 kg", "67"],
          ["Deadlift", "140 kg", "+12.5 kg", "91"],
        ].map((x) => (
          <div key={x[0]}>
            <span className="lift-icon">
              <Icon name="workouts" />
            </span>
            <span>
              <b>{x[0]}</b>
              <small>Estimated 1 rep max</small>
            </span>
            <span>
              <b>{x[1]}</b>
              <em>{x[2]}</em>
            </span>
          </div>
        ))}
      </section>
      <SectionTitle title="Consistency" />
      <section className="card consistency">
        <div>
          <Ring value={86} size={82} width={7}>
            <b>86%</b>
          </Ring>
          <span>
            <b>12 workouts</b>
            <small>of 14 planned</small>
          </span>
        </div>
        <div className="day-dots">
          {["M", "T", "W", "T", "F", "S", "S"].map((x, i) => (
            <span key={i}>
              <i className={i !== 3 ? "hit" : ""}>{i !== 3 && <Icon name="check" size={11} />}</i>
              <small>{x}</small>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function Profile({ restart }: { restart: () => void }) {
  const items: [IconName, string, string][] = [
    ["target", "Fitness goal", "Build muscle"],
    ["workouts", "Training preferences", "4 days / week"],
    ["settings", "Equipment", "Full gym"],
    ["nutrition", "Dietary preferences", "High protein"],
    ["bell", "Notifications", "On"],
  ];
  return (
    <div className="screen">
      <Header subtitle="YOUR ACCOUNT" title="Profile" onCoach={() => {}} />
      <section className="profile-card">
        <div className="avatar">
          AM
          <button aria-label="Change photo">
            <Icon name="camera" size={14} />
          </button>
        </div>
        <div>
          <h2>Alex Morgan</h2>
          <p>alex.morgan@example.com</p>
          <span className="pill lime">PRO MEMBER</span>
        </div>
        <button className="icon-button">
          <Icon name="edit" size={17} />
        </button>
      </section>
      <div className="profile-metrics">
        <span>
          <b>78.4</b>
          <small>Weight · kg</small>
        </span>
        <span>
          <b>182</b>
          <small>Height · cm</small>
        </span>
        <span>
          <b>29</b>
          <small>Age</small>
        </span>
      </div>
      <SectionTitle title="My plan" />
      <div className="settings-list card">
        {items.map(([icon, title, value]) => (
          <button key={title}>
            <span className="settings-icon">
              <Icon name={icon} />
            </span>
            <span>
              <b>{title}</b>
              <small>{value}</small>
            </span>
            <Icon name="chevron" size={18} />
          </button>
        ))}
      </div>
      <SectionTitle title="Settings" />
      <div className="settings-list card">
        <button>
          <span className="settings-icon">
            <Icon name="lock" />
          </span>
          <span>
            <b>Privacy & security</b>
            <small>Data and permissions</small>
          </span>
          <Icon name="chevron" size={18} />
        </button>
        <button>
          <span className="settings-icon">
            <Icon name="help" />
          </span>
          <span>
            <b>Help & support</b>
            <small>FAQs and contact</small>
          </span>
          <Icon name="chevron" size={18} />
        </button>
        <button onClick={restart}>
          <span className="settings-icon">
            <Icon name="spark" />
          </span>
          <span>
            <b>Retake onboarding</b>
            <small>Update your plan</small>
          </span>
          <Icon name="chevron" size={18} />
        </button>
      </div>
      <button className="logout">
        <Icon name="logout" /> Log out
      </button>
      <small className="version">FitPilot AI · Version 1.0.0</small>
    </div>
  );
}

function Coach({ back }: { back: () => void }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const send = () => {
    if (message.trim()) {
      setMessages((m) => [...m, message]);
      setMessage("");
    }
  };
  return (
    <div className="coach-screen">
      <div className="coach-header">
        <button className="icon-button" onClick={back}>
          <Icon name="back" />
        </button>
        <span className="ai-mark">
          <Icon name="spark" />
        </span>
        <span>
          <b>FitPilot AI</b>
          <small>
            <i /> Online · Knows your plan
          </small>
        </span>
        <button className="icon-button">
          <Icon name="more" />
        </button>
      </div>
      <div className="chat">
        <div className="chat-date">TODAY, 8:32 AM</div>
        <div className="ai-bubble">
          <span className="ai-mark small">
            <Icon name="spark" size={15} />
          </span>
          <div>
            <p>
              Good morning, Alex. You're well recovered today — your sleep score is 84 and soreness
              is low.
            </p>
            <p>
              You're scheduled for <b>Chest & Triceps</b>. Want me to adjust anything before you
              train?
            </p>
            <small>8:32 AM</small>
          </div>
        </div>
        <div className="quick-prompts">
          <button>Optimize today's workout</button>
          <button>What should I eat before?</button>
          <button>How's my progress?</button>
        </div>
        <div className="user-bubble">What weight should I use for bench press?</div>
        <div className="ai-bubble">
          <span className="ai-mark small">
            <Icon name="spark" size={15} />
          </span>
          <div>
            <p>
              Based on last week's <b>77.5 kg × 8</b> and today's readiness, start at <b>80 kg</b>{" "}
              for 6–8 reps.
            </p>
            <div className="coach-plan">
              <span>
                <Icon name="workouts" />
              </span>
              <div>
                <small>RECOMMENDED</small>
                <b>Bench Press · 80 kg</b>
                <p>4 sets × 6–8 reps · 2 min rest</p>
              </div>
            </div>
            <p>If set one feels above RPE 8, drop to 77.5 kg. I'll adapt the next sets with you.</p>
            <small>8:34 AM</small>
          </div>
        </div>
        {messages.map((m, i) => (
          <div className="user-bubble" key={i}>
            {m}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <button aria-label="Add attachment">
          <Icon name="plus" />
        </button>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask your coach anything..."
        />
        <button className="send" onClick={send}>
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  );
}

const onboardingSteps = [
  {
    kicker: "LET'S GET TO KNOW YOU",
    title: "What’s your primary goal?",
    subtitle: "FitPilot will shape your training and nutrition plan around what matters most.",
    options: [
      ["Lose weight", "Burn fat while preserving strength"],
      ["Build muscle", "Add lean mass and get stronger"],
      ["Improve fitness", "Build endurance and feel your best"],
      ["Stay healthy", "Create consistent, sustainable habits"],
    ],
  },
  {
    kicker: "YOUR EXPERIENCE",
    title: "How do you train today?",
    subtitle: "This helps us set the right intensity and exercise complexity.",
    options: [
      ["Just starting", "Less than 6 months"],
      ["Intermediate", "6 months to 2 years"],
      ["Experienced", "More than 2 years"],
      ["Getting back into it", "Returning after a break"],
    ],
  },
  {
    kicker: "YOUR ROUTINE",
    title: "Where will you train?",
    subtitle: "We'll only recommend exercises you can actually do.",
    options: [
      ["Full gym", "Machines, cables and free weights"],
      ["Home gym", "Dumbbells, bench and bands"],
      ["Bodyweight only", "No equipment needed"],
      ["A mix of places", "Flexible week to week"],
    ],
  },
  {
    kicker: "ALMOST THERE",
    title: "Your body & routine",
    subtitle: "Used to personalize calories, recovery, and weekly training load.",
    options: [],
  },
];

function Onboarding({ finish, close }: { finish: () => void; close: () => void }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(1);
  const s = onboardingSteps[step];
  return (
    <div className="onboarding">
      <div className="onboard-top">
        <div className="brand-mark">
          <Icon name="spark" />
        </div>
        <b>
          FitPilot <i>AI</i>
        </b>
        <button onClick={close}>Skip</button>
      </div>
      <div className="progress-track">
        <i style={{ width: `${((step + 1) / 4) * 100}%` }} />
      </div>
      <div className="onboard-body">
        <div className="step-count">STEP {step + 1} OF 4</div>
        <span className="eyebrow">{s.kicker}</span>
        <h1>{s.title}</h1>
        <p>{s.subtitle}</p>
        {step < 3 ? (
          <div className="option-list">
            {s.options.map((o, i) => (
              <button
                className={selected === i ? "selected" : ""}
                onClick={() => setSelected(i)}
                key={o[0]}
              >
                <span>
                  <Icon
                    name={i === 0 ? "fire" : i === 1 ? "workouts" : i === 2 ? "heart" : "target"}
                  />
                </span>
                <span>
                  <b>{o[0]}</b>
                  <small>{o[1]}</small>
                </span>
                <i>{selected === i && <Icon name="check" size={14} />}</i>
              </button>
            ))}
          </div>
        ) : (
          <div className="body-form">
            <label>
              <span>Age</span>
              <div>
                <input defaultValue="29" />
                <b>years</b>
              </div>
            </label>
            <div className="form-row">
              <label>
                <span>Height</span>
                <div>
                  <input defaultValue="182" />
                  <b>cm</b>
                </div>
              </label>
              <label>
                <span>Weight</span>
                <div>
                  <input defaultValue="78.4" />
                  <b>kg</b>
                </div>
              </label>
            </div>
            <label>
              <span>Activity level</span>
              <select defaultValue="Moderately active">
                <option>Moderately active</option>
                <option>Very active</option>
                <option>Lightly active</option>
              </select>
            </label>
            <label>
              <span>Dietary preference</span>
              <select defaultValue="No restrictions">
                <option>No restrictions</option>
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Low carb</option>
              </select>
            </label>
          </div>
        )}
      </div>
      <div className="onboard-bottom">
        <button className="back-button" onClick={() => (step ? setStep(step - 1) : close())}>
          <Icon name="back" /> {step ? "Back" : "Maybe later"}
        </button>
        <button
          className="primary"
          onClick={() => (step === 3 ? finish() : (setStep(step + 1), setSelected(0)))}
        >
          {step === 3 ? "Generate my plan" : "Continue"} <Icon name="chevron" size={17} />
        </button>
      </div>
    </div>
  );
}

function BottomNav({
  active,
  setActive,
  coach,
}: {
  active: Tab;
  setActive: (t: Tab) => void;
  coach: () => void;
}) {
  const nav: [Tab, IconName, string][] = [
    ["home", "home", "Home"],
    ["workouts", "workouts", "Workouts"],
    ["nutrition", "nutrition", "Nutrition"],
    ["progress", "progress", "Progress"],
    ["profile", "profile", "Profile"],
  ];
  return (
    <nav className="bottom-nav">
      {nav.map(([tab, icon, label], i) => (
        <div key={tab}>
          {i === 2 && (
            <button className="nav-coach" onClick={coach}>
              <Icon name="spark" size={19} />
            </button>
          )}
          <button className={active === tab ? "active" : ""} onClick={() => setActive(tab)}>
            <Icon name={icon} />
            <span>{label}</span>
          </button>
        </div>
      ))}
    </nav>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [coach, setCoach] = useState(false);
  const [onboarding, setOnboarding] = useState(true);
  const content = useMemo(() => {
    if (tab === "home") return <Home go={(x) => (x === "coach" ? setCoach(true) : setTab(x))} />;
    if (tab === "workouts") return <Workouts />;
    if (tab === "nutrition") return <Nutrition />;
    if (tab === "progress") return <Progress />;
    return <Profile restart={() => setOnboarding(true)} />;
  }, [tab]);
  return (
    <main className="app-shell">
      <div className="phone">
        {coach ? (
          <Coach back={() => setCoach(false)} />
        ) : (
          <>
            {content}
            <BottomNav active={tab} setActive={setTab} coach={() => setCoach(true)} />
          </>
        )}
        {onboarding && (
          <Onboarding finish={() => setOnboarding(false)} close={() => setOnboarding(false)} />
        )}
      </div>
    </main>
  );
}
