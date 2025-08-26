export async function GET() {
  return Response.json({
    status: 200,
    message: "노트를 조회했습니다.",
    data: [
      {
        noteId: 3,
        name: "000 원두",
        content: "이커피는 맛있다.",
        rating: 5,
        photo: "https://cdn.example.com/notes/123.jpg",
        date: "2025-08-10",
        likes: 14,
      },
      {
        noteId: 2,
        name: "000 원두",
        content: "이커피는 맛있다.",
        rating: 4,
        photo: "https://cdn.example.com/notes/123.jpg",
        date: "2025-08-09",
        likes: 14,
      },
    ],
  });
}
