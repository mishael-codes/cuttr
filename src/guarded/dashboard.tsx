import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
const Dashboard = () => {

  const auth = getAuth()
  const navigate = useNavigate()
  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/signin")
    })
  }
  return (
    <div>
      <h1>This is the Dashboard</h1>
      <button onClick={handleSignOut} className="rounded-lg bg-accent font-bold text-background p-3 mt-4 border border-accent hover:bg-transparent hover:text-accent transition-all">Sign Out</button>
    </div>
  );
};

export default Dashboard;