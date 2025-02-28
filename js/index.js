const GITHUB_OWNER = "songsunkook";  // GitHub 저장소 소유자
const GITHUB_REPO = "web-wiki-introduction";        // 저장소 이름
const ISSUE_NUMBER = 1;                      // 이슈 번호

document.addEventListener("DOMContentLoaded", () => {
  const commentList = document.querySelector(".comment-list");
  const commentInput = document.querySelector(".comment-input-text");
  const submitButton = document.querySelector(".comment-submit-button");

  const API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${ISSUE_NUMBER}/comments`;

  async function fetchComments() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          "Accept": "application/vnd.github.v3+json"
        }
      });
      if (!response.ok) throw new Error("댓글을 불러오는 데 실패했습니다.");
      
      const comments = await response.json();
      commentList.innerHTML = ""; // 기존 목록 초기화

      comments.forEach(comment => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="comment-item">
            <div class="comment-author">
              <img src="./images/comment-author-icon.png" alt="사용자 프로필 이미지" />
              <span>${comment.user.login}</span>
            </div>
            <div class="comment-content">${comment.body}</div>
          </div>
        `;
        commentList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  async function postComment() {
    const commentText = commentInput.value.trim();
    if (!commentText) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "Authorization": `Bearer ${GITHUB_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ body: commentText })
      });

      if (!response.ok) throw new Error("댓글을 등록하는 데 실패했습니다.");

      commentInput.value = ""; // 입력창 초기화
      fetchComments(); // 댓글 다시 불러오기
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    postComment();
  });

  fetchComments(); // 페이지 로드 시 댓글 불러오기
});
