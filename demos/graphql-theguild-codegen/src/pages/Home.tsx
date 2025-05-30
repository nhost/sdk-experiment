import { type JSX } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_NINJA_TURTLES_WITH_COMMENTS,
  ADD_COMMENT,
} from "../lib/graphql/operations";
import { useState } from "react";
import { useAuth } from "../lib/nhost/AuthProvider";
import { Navigate } from "react-router-dom";

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

  if (loading) return <div>Loading ninja turtles...</div>;
  if (error) return <div>Error loading ninja turtles: {error.message}</div>;

  const ninjaTurtles: NinjaTurtle[] = data?.ninja_turtles || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teenage Mutant Ninja Turtles</h1>

      {ninjaTurtles.map((turtle) => (
        <div key={turtle.id} className="mb-8 p-4 border rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold">{turtle.name}</h2>
          </div>

          <p className="my-2">{turtle.description}</p>

          <div className="text-sm text-gray-500 mb-4">
            Added on {formatDate(turtle.created_at)}
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">
              Comments ({turtle.comments.length})
            </h3>

            {turtle.comments.map((comment) => (
              <div key={comment.id} className="mb-2 p-2 bg-gray-50 rounded">
                <p>{comment.comment}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {comment.user?.displayName ||
                    comment.user?.email ||
                    "Anonymous"}{" "}
                  - {formatDate(comment.created_at)}
                </p>
              </div>
            ))}

            {activeCommentId === turtle.id ? (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add your comment..."
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setActiveCommentId(null);
                      setCommentText("");
                    }}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddComment(turtle.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveCommentId(turtle.id)}
                className="text-blue-500 mt-2 text-sm"
              >
                Add a comment
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
