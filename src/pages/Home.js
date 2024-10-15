import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../SessionProvider";
import { Navigate } from "react-router-dom";
import { SideMenu } from "../components/SideMenu";
import { postRepository } from "../repositories/post";
import { Post } from "../components/Post";
import { Pagination } from "../components/Pagenation";
import { authRepository } from "../repositories/auth";

function Home() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const { currentUser, setCurrentUser } = useContext(SessionContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    const post = await postRepository.create(content, currentUser.id);
    setPosts([
      { ...post, userId: currentUser.id, userName: currentUser.userName },
      ...posts,
    ]);
    setContent("");
  };

  const limit = 5;

  const fetchPosts = async (page) => {
    const posts = await postRepository.find(page, limit);
    setPosts(posts);
  };

  const moveToNext = async () => {
    const nextPage = page + 1;
    await fetchPosts(nextPage);
    setPage(nextPage);
  };

  const moveToPrevious = async () => {
    const previousPage = page - 1;
    await fetchPosts(previousPage);
    setPage(previousPage);
  };

  const deletePost = async (id) => {
    await postRepository.delete(id);
    setPosts(posts.filter((post) => post.id !== id));
  };

  const signout = async () => {
    await authRepository.signout();
    setCurrentUser(null);
  };

  if (currentUser == null) {
    return <Navigate replace to="/signin" />;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#ff862f] p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">なんでも掲示板</h1>
          <button onClick={signout} className="text-white hover:text-red-600">
            ログアウト
          </button>
        </div>
      </header>
      <div className="container mx-auto mt-6 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                value={content}
                className="w-full p-2 mb-4 border-2 border-gray-200 rounded-md"
                placeholder="What's on your mind?"
              />
              <button
                onClick={createPost}
                disabled={content === ""}
                className="bg-[#d33434] text-white px-4 py-2 rounded-md hover:bg-[#d33434]/90 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
            <div className="mt-4">
              {posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  userId={currentUser.id}
                  onDelete={deletePost}
                />
              ))}
            </div>
            <Pagination
              moveToNext={posts.length >= limit ? moveToNext : null}
              moveToPrevious={page > 1 ? moveToPrevious : null}
            />
          </div>
          <SideMenu />
        </div>
      </div>
    </div>
  );
}

export default Home;
