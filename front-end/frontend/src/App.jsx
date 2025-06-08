import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [mode, setMode] = useState('login'); // login | register | loggedIn
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const AUTH_BASE = 'https://auth-service-je75.onrender.com';
  const NOTE_BASE = 'https://note-service-xn67.onrender.com';
  const PROFILE_BASE = 'https://profile-service-itcr.onrender.com';

  const handleRegister = async () => {
    try {
      await axios.post(`${AUTH_BASE}/register`, { username, password });
      alert('Registered successfully!');
      setMode('login');
    } catch {
      alert('Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${AUTH_BASE}/login`, { username, password });
      setToken(res.data.token);
      setMode('loggedIn');
    } catch {
      alert('Login failed');
    }
  };

  const fetchNotes = async () => {
const res = await axios.post(`${NOTE_BASE}/my-notes`, { token });
    setNotes(res.data);
  };

  const saveNote = async () => {
    if (!newNote.trim()) return;
await axios.post(`${NOTE_BASE}/notes`, { token, content: newNote });
    setNewNote('');
    fetchNotes();
  };

  const changePassword = async () => {
await axios.post(`${AUTH_BASE}/change-password`, { token, newPassword });
    alert('Password changed!');
    setNewPassword('');
  };

  const fetchProfile = async () => {
const res = await axios.post(`${PROFILE_BASE}/get-profile`, { token });
  setProfile(res.data);
  };

  const updateProfile = async () => {
await axios.post(`${PROFILE_BASE}/update-profile`, { token, name, bio });
    fetchProfile();
  };


  useEffect(() => {
    if (mode === 'loggedIn') {
      fetchNotes();
      fetchProfile();

    }
  }, [mode]);

  if (mode === 'register') {
    return (
      <div style={{ padding: 20 }}>
        <h2>Register</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />
        <button onClick={handleRegister}>Register</button>
        <p onClick={() => setMode('login')}>Already have account? Login</p>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />
        <button onClick={handleLogin}>Login</button>
        <p onClick={() => setMode('register')}>Don't have account? Register</p>
      </div>
    );
  }

  return (
    
    <div style={{ padding: 20 }}> 
      <h2>Welcome {username}</h2>
            {profile ? (
        <div>
          <h3>Profile</h3>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
        </div>
      ) : (
        <div>
          <h3>Update Profile</h3>
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br />
          <input placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} /><br />
          <button onClick={updateProfile}>Update</button>
        </div>
      )}

      <div>
        <input
          placeholder="Write note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button onClick={saveNote}>Save</button>
      </div>

      <h3>Your Notes</h3>
      <ul>
        {notes.map(note => (
          <li key={note.id}>📝 {note.content}</li>
        ))}
      </ul>

      <h4>Change Password</h4>
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <button onClick={changePassword}>Change</button>
      <div>
          {mode === 'loggedIn' && (
        <button onClick={() => {
          setToken('');
          setMode('login');  // chuyển về màn hình đăng nhập
          setProfile(null);
          setNotes([]);
          // Nếu dùng localStorage, xóa token ở đây nữa
        }}>Logout</button>
      )}
      </div>
    </div>
  );
}

export default App;
