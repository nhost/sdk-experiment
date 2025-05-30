import { type JSX } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_NINJA_TURTLES_WITH_COMMENTS,
  ADD_COMMENT,
} from "../lib/graphql/operations";
import { useState } from "react";
import { useAuth } from "../lib/nhost/AuthProvider";
import { Navigate } from "react-router-dom";
import "./Home.css";

type Comment = {
  id: string;
  comment: string;
  created_at: string;
  user?: {
    id: string;
    displayName?: string;
    email?: string;
  };
};

type NinjaTurtle = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  comments: Comment[];
};

export default function Home(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // If authentication is still loading, show a loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to signin page
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  const { loading, error, data, refetch } = useQuery(
    GET_NINJA_TURTLES_WITH_COMMENTS,
  );

  // Debug: Log the raw data from GraphQL response
  console.log("GraphQL response data:", data);

  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setCommentText("");
      setActiveCommentId(null);
      refetch();
    },
  });

  const handleAddComment = (turtleId: string) => {
    if (!commentText.trim()) return;

    addComment({
      variables: {
        ninja_turtle_id: turtleId,
        comment: commentText,
      },
    });
  };

  if (loading) return (
    <div className="loading-container">
      <p>Loading ninja turtles...</p>
    </div>
  );
  if (error) return (
    <div className="alert alert-error">
      Error loading ninja turtles: {error.message}
    </div>
  );
  
  // Access the data using the correct field name from the GraphQL response
  const ninjaTurtles: NinjaTurtle[] = data?.ninjaTurtles || [];
  
  // Set the active tab to the first turtle if there's no active tab and there are turtles
  if (activeTabId === null && ninjaTurtles.length > 0) {
    setActiveTabId(ninjaTurtles[0].id);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="ninja-turtles-container">
      <h1 className="ninja-turtles-title text-3xl font-bold mb-6">Teenage Mutant Ninja Turtles</h1>

      {/* Tabs navigation */}
      <div className="turtle-tabs">
        {ninjaTurtles.map((turtle) => (
          <button
            key={turtle.id}
            className={`turtle-tab ${activeTabId === turtle.id ? "active" : ""}`}
            onClick={() => setActiveTabId(turtle.id)}
          >
            {turtle.name}
          </button>
        ))}
      </div>

      {/* Display active turtle */}
      {ninjaTurtles
        .filter((turtle) => turtle.id === activeTabId)
        .map((turtle) => (
          <div key={turtle.id} className="turtle-card glass-card p-6">
            <div className="turtle-header">
              <h2 className="turtle-name text-2xl font-semibold">{turtle.name}</h2>
            </div>

            <p className="turtle-description">{turtle.description}</p>

            <div className="turtle-date">
              Added on {formatDate(turtle.createdAt || turtle.created_at)}
            </div>

            <div className="comments-section">
              <h3 className="comments-title">
                Comments ({turtle.comments.length})
              </h3>

              {turtle.comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <p className="comment-text">{comment.comment}</p>
                  <div className="comment-meta">
                    <div className="comment-avatar">
                      {(comment.user?.displayName || comment.user?.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <p>
                      {comment.user?.displayName ||
                        comment.user?.email ||
                        "Anonymous"}{" "}
                      - {formatDate(comment.createdAt || comment.created_at)}
                    </p>
                  </div>
                </div>
              ))}

              {activeCommentId === turtle.id ? (
                <div className="comment-form">
                  <textarea
                    className="comment-textarea"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add your comment..."
                    rows={3}
                  />
                  <div className="comment-actions">
                    <button
                      onClick={() => {
                        setActiveCommentId(null);
                        setCommentText("");
                      }}
                      className="btn cancel-button"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddComment(turtle.id)}
                      className="btn submit-button"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setActiveCommentId(turtle.id)}
                  className="add-comment-button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add a comment
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
