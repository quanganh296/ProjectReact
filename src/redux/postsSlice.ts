  import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../types";

interface PostsState {
  posts: Post[];
}

const initialState: PostsState = {
  posts: [
    {
      id: 1,
      title: "Hôm nay là một ngày tuyệt vời",
      excerpt: "Hôm nay tôi thức dậy sớm, đi dạo công viên và cảm thấy thật bình yên...",
      content: `Hôm nay tôi thức dậy sớm, đi dạo công viên và cảm thấy thật bình yên. 
      
      Mặt trời vừa ló dạng, không khí trong lành, tiếng chim hót líu lo. 
      Tôi đã uống một ly cà phê nóng và viết vài dòng nhật ký. 
      
      Cuộc sống đôi khi chỉ cần những khoảnh khắc nhỏ như vậy để thấy hạnh phúc.`,
      image: "https://picsum.photos/800/400",
      date: "2025-10-30",
      category: "Daily Journal",
      mood: "happy",
      isMine: true,
      status: "public",
      likes: 15,
      comments: [
        { id: 1, postId: 1, text: "Bài viết hay quá!", author: "Lan", date: "2025-10-31" },
        { id: 2, postId: 1, text: "Mình cũng thích đi dạo sáng", author: "Minh", date: "2025-10-31" }
      ]
    }
  ]
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
  },
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;