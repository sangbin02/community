function login(event) {
    event.preventDefault(); // 기존 방식으로 폼을 제출하는 것을 방지합니다.
  
    // 입력 값 가져오기
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    // 사용자 이름과 비밀번호 유효성 검사 (실제 유효성 검사 로직으로 대체해야 합니다)
    if (username === 'your_username' && password === 'your_password') {
      // 로그인 성공
      alert('로그인 성공!'); // 더 정교한 알림 방법으로 대체할 수 있습니다.
  
      // 홈 페이지로 리디렉션
      window.location.href = 'index.html';
    } else {
      // 로그인 실패
      alert('로그인 실패. 사용자 이름 또는 비밀번호가 올바르지 않습니다.');
    }
  }

async function signupUser(event) {
  event.preventDefault();

  var username = document.getElementById('signup-username').value;
  var password = document.getElementById('signup-password').value;

  try {
    // 서버로 데이터 전송
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('가입이 완료되었습니다.');
      window.location.href = 'index.html'; // 회원가입 성공 시 홈페이지로 이동
    } else {
      const data = await response.json();
      alert(`가입 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('가입 중 오류:', error);
    alert('서버와의 통신 중 오류가 발생했습니다.');
  }
}

// 글 목록 데이터 (임시로 배열 사용, 실제로는 서버에서 데이터를 받아와야 함)
let postList = [];

// Toggle 메뉴 함수
function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
}

// 이동 함수
function goToLogin() {
  location.href = 'login.html';
}

// 글쓰기 버튼 클릭 시 호출되는 함수
function goToWritePage() {
  location.href = 'write.html';
}

// 글쓰기 폼 제출 시 호출되는 함수
function submitPostForm(event) {
  event.preventDefault();

  // 폼에서 입력한 값을 가져오기
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const image = document.getElementById('image').value; // 이미지는 여기서 예시로 가져오지만, 실제로는 파일 업로드로 처리해야 함

  // 새로운 글 객체 생성
  const newPost = {
    title,
    content,
    image,
  };

  // 글 목록에 추가
  postList.push(newPost);

  // 글 목록을 업데이트
  updatePostList();

  // 글 목록을 로컬 스토리지에 저장 (실제로는 서버에 전송하여 저장)
  saveToLocalStorage();

  // 폼 초기화
  document.getElementById('title').value = '';
  document.getElementById('content').value = '';
  document.getElementById('image').value = '';
}

// 글 목록 업데이트 함수
async function loadPostList() {
    try {
      // 서버에서 글 목록 가져오기
      const response = await fetch('/api/posts');
      const data = await response.json();
  
      // 가져온 데이터로 글 목록 업데이트
      postList = data;
      updatePostList();
    } catch (error) {
      console.error('글 목록 가져오기 오류:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  }
  
  // 페이지 로드 시 실행되는 함수
  window.onload = function () {
    loadPostList();
  };
  
  // 글쓰기 폼 제출 시 호출되는 함수
  async function submitPostForm(event) {
    event.preventDefault();
  
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const image = document.getElementById('image').value;
  
    try {
      // 서버로 데이터 전송
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, image }),
      });
  
      if (response.ok) {
        alert('글이 성공적으로 작성되었습니다.');
        await loadPostList(); // 글 작성 성공 시 목록 업데이트 (await 추가)
      } else {
        const data = await response.json();
        alert(`글 작성 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('글 작성 중 오류:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  }
  

// 로컬 스토리지에 저장하는 함수
function saveToLocalStorage() {
  localStorage.setItem('postList', JSON.stringify(postList));
}

// 로컬 스토리지에서 불러오는 함수
function loadFromLocalStorage() {
  const storedPostList = localStorage.getItem('postList');

  if (storedPostList) {
    postList = JSON.parse(storedPostList);
    updatePostList();
  }
}

// 페이지 로드 시 실행되는 함수
window.onload = function () {
  loadFromLocalStorage();
};

// 글쓰기 페이지에서 폼 제출 시 호출되는 함수 등록
document.querySelector('.write-post form').addEventListener('submit', submitPostForm);

// ...

async function submitCommentForm(event, postId) {
    event.preventDefault();
  
    const text = document.getElementById(`comment-text-${postId}`).value;
  
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
  
      if (response.ok) {
        alert('댓글이 성공적으로 작성되었습니다.');
        await loadPostList();
      } else {
        const data = await response.json();
        alert(`댓글 작성 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('댓글 작성 중 오류:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  }
  
  // ...
  
  function updatePostList() {
    const postListSection = document.querySelector('.post-list');
    postListSection.innerHTML = '<h2>글 목록</h2>';
  
    if (postList.length === 0) {
      postListSection.innerHTML += '<p>글이 없습니다.</p>';
    } else {
      postList.forEach((post) => {
        postListSection.innerHTML += `<div class="post">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <img src="${post.image}" alt="Post Image">
  
          <form onsubmit="submitCommentForm(event, '${post._id}')">
            <label for="comment-text-${post._id}">댓글:</label>
            <input type="text" id="comment-text-${post._id}" name="comment-text" required>
            <button type="submit">댓글 작성</button>
          </form>
  
          <h4>댓글</h4>
          <ul>
            ${post.comments.map((comment) => `<li>${comment.text}</li>`).join('')}
          </ul>
        </div>`;
      });
    }
  }
  
  // ...
  
// 가상의 데이터베이스 역할을 하는 배열
let postsData = [];

// 글쓰기 함수
function submitPost() {
    const username = document.getElementById('username').value;
    const postContent = document.getElementById('postContent').value;

    const post = {
        username: username,
        content: postContent,
        comments: [] // 댓글을 담을 배열
    };

    postsData.push(post);
    displayPosts();
}

// 댓글쓰기 함수
function submitComment() {
    const commentUsername = document.getElementById('commentUsername').value;
    const commentContent = document.getElementById('commentContent').value;

    const postId = document.getElementById('commentForm').getAttribute('data-post-id');
    const comment = {
        username: commentUsername,
        content: commentContent
    };

    postsData[postId].comments.push(comment);
    displayPosts();
}

// 게시글과 댓글을 화면에 표시하는 함수
function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    postsData.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `
            <strong>${post.username}</strong>: ${post.content}
            <button onclick="toggleCommentForm(${index})">댓글쓰기</button>
            <div id="comments-${index}">
                ${getCommentsHTML(post.comments)}
            </div>
            <hr>
        `;
        postsContainer.appendChild(postElement);
    });
}

// 댓글 목록을 HTML로 변환하는 함수
function getCommentsHTML(comments) {
    let commentsHTML = '';
    comments.forEach(comment => {
        commentsHTML += `<p><strong>${comment.username}</strong>: ${comment.content}</p>`;
    });
    return commentsHTML;
}

// 댓글쓰기 양식 토글 함수
function toggleCommentForm(postId) {
    const commentForm = document.getElementById('commentForm');
    commentForm.style.display = 'block';
    commentForm.setAttribute('data-post-id', postId);
}

// 초기화 함수
function init() {
    displayPosts();
}

// 페이지 로드 시 초기화 함수 호출
window.onload = init;
 