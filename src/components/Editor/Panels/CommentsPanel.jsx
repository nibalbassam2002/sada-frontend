// src/components/Editor/Panels/CommentsPanel.js
import React, { useState } from 'react';
import { MessageSquare, Plus, Send } from 'lucide-react';
import { useEditor } from '../EditorContext';

const CommentsPanel = ({ comments, onResolve, onReply, onClose }) => {
  const [replyText, setReplyText] = useState('');
  const [activeReply, setActiveReply] = useState(null);
  const { handleNewComment } = useEditor();

  if (!comments.length) {
    return (
      <div className="comments-panel">
        <div className="comments-header">
          <h4>Comments</h4>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="comments-empty">
          <MessageSquare size={32} color="#94a3b8" />
          <p>No comments yet</p>
          <button className="btn-add-comment" onClick={handleNewComment}>
            <Plus size={14} /> Add a comment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="comments-panel">
      <div className="comments-header">
        <h4>Comments ({comments.length})</h4>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className={`comment-thread ${comment.resolved ? 'resolved' : ''}`}>
            <div className="comment-main">
              <div className="comment-avatar">
                <div className="avatar-circle">
                  {comment.author.charAt(0)}
                </div>
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time">
                    {new Date(comment.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {comment.selectedText && (
                  <div className="quoted-text">
                    "{comment.selectedText}"
                  </div>
                )}

                <div className="comment-text">
                  {comment.text || <em>New comment...</em>}
                </div>

                <div className="comment-actions">
                  <button
                    className={`resolve-btn ${comment.resolved ? 'resolved' : ''}`}
                    onClick={() => onResolve(comment.id)}
                  >
                    {comment.resolved ? 'Reopen' : 'Resolve'}
                  </button>
                  <button
                    className="reply-btn"
                    onClick={() => setActiveReply(activeReply === comment.id ? null : comment.id)}
                  >
                    Reply
                  </button>
                </div>

                {activeReply === comment.id && (
                  <div className="reply-input">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && replyText.trim()) {
                          onReply(comment.id, replyText);
                          setReplyText('');
                          setActiveReply(null);
                        }
                      }}
                    />
                    <button onClick={() => {
                      if (replyText.trim()) {
                        onReply(comment.id, replyText);
                        setReplyText('');
                        setActiveReply(null);
                      }
                    }}>
                      <Send size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {comment.replies.length > 0 && (
              <div className="comment-replies">
                {comment.replies.map(reply => (
                  <div key={reply.id} className="reply">
                    <div className="reply-avatar">
                      <div className="avatar-circle small">{reply.author.charAt(0)}</div>
                    </div>
                    <div className="reply-content">
                      <div className="reply-header">
                        <span className="reply-author">{reply.author}</span>
                        <span className="reply-time">
                          {new Date(reply.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="reply-text">{reply.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsPanel;