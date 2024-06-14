# sse-notification-client

ReactJs based CSR website to receive notification message from server using Server-Sent Events (SSE)

## SSE client side code

```js
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
```
