import { useEffect, useState } from 'react';
import Message from './Message';

const baseUrl = 'http://localhost:4000';

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();

    // Fetch unread messages on load
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${baseUrl}/messages`, {
          signal: abortController.signal,
        });
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    return () => {
      abortController.abort();
    };
  }, []);

  // Client side code for Server-Sent-Event(SSE)
  useEffect(() => {
    /**
     * open SSE connection with server - event-stream
     */
    const eventSource = new EventSource(`${baseUrl}/events`);

    /**
     * read message from event-stream - assign callback function for onmessage event
     * once SSE connection is established server can sent message in the format of key-value pair i.e. res.write(`key:value\n\n`);
     * message of interest can be read from event by it's key i.e. event.data is used to read message sent from server and rest is ignored inside onmessage callback function.
     */
    eventSource.onmessage = (event) => {
      /**
       * read only event's data value that was sent from server using res.write(`data: ${JSON.stringify(newMessage)}\n\n`);
       * Ignore others i.e. res.write(': keep-alive\n\n');
       * `\n\n` in SSE: Used to indicate the end of a message, allowing the client to properly parse each message.
       */
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    // Cleanup on unmount
    return () => {
      /**
       * close SSE connection with server - event-stream
       */
      eventSource.close();
    };
  }, []);

  const handleRead = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== id)
        );
      } else {
        console.error('Failed to mark message as read');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <div>
      {messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message.id} message={message} onRead={handleRead} />
        ))
      ) : (
        <>You don&apos;t have new message to read.</>
      )}
    </div>
  );
};

export default MessageList;
