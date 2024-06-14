// src/App.js
import MessageList from './MessageList';

function Notifications() {
  return (
    <div className="notifications">
      <h1>Unread Messages</h1>
      <MessageList />
    </div>
  );
}

export default Notifications;
