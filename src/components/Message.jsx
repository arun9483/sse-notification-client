import PropTypes from 'prop-types';

const Message = ({ message, onRead }) => {
  return (
    <div
      onClick={() => onRead(message.id)}
      style={{
        cursor: 'pointer',
        margin: '10px',
        padding: '10px',
        border: '1px solid black',
      }}
    >
      <h4>{message.title}</h4>
      <p>{message.content}</p>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  onRead: PropTypes.func.isRequired,
};

export default Message;
